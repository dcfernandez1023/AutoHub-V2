import APIError from '../errors/APIError';
import {
  CreateScheduledLogRequest,
  CreateScheduledLogRequestSchema,
  CreateScheduledLogRequestSchemaInternal,
  ScheduledLogDto,
  UpdateScheduledLogRequest,
  UpdateScheduledLogRequestSchemaArray,
  UpdateScheduledLogRequestSchemaInternalArray,
} from '../types/log';
import { checkIfCanAccessVehicle } from './vehicleService';
import * as scheduledLogModel from '../models/scheduledLog';
import * as scheduledServiceTypeModel from '../models/scheduledServiceType';

export const createScheduledLog = async (vehicleId: string, userId: string, request: CreateScheduledLogRequest) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const parsedRequest = CreateScheduledLogRequestSchema.parse(request);
  // Transform to internal request, with datePerformed as a Date type
  const internalRequest = CreateScheduledLogRequestSchemaInternal.parse({
    ...parsedRequest,
    datePerformed: new Date(parsedRequest.datePerformed),
  });

  // If requesting user can access the vehicle, then they can create a scheduled log for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  const createdLog = await scheduledLogModel.default.createScheduledLog(vehicle.id, vehicle.userId, internalRequest);
  const scheduledLogWithInstance = await scheduledLogModel.default.getVehicleScheduledLog(createdLog.id, vehicle.id);
  const scheduledServiceType = await scheduledServiceTypeModel.default.getScheduledServiceType(
    scheduledLogWithInstance.scheduledServiceInstance.scheduledServiceTypeId,
    userId
  );

  return {
    scheduledLog: transformToCalculatedScheduledLogDto(scheduledLogWithInstance),
    scheduledServiceType,
    vehicle,
  };
};

export const updateScheduledLogs = async (vehicleId: string, userId: string, request: UpdateScheduledLogRequest[]) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }

  const parsedRequest = UpdateScheduledLogRequestSchemaArray.parse(request);
  // Transform to internal request, with datePerformed as a Date type
  const internalRequest = UpdateScheduledLogRequestSchemaInternalArray.parse(
    parsedRequest.map((obj) => ({
      ...obj,
      datePerformed: new Date(obj.datePerformed),
    }))
  );

  // If requesting user can access the vehicle, then they can update scheduled logs for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  const updatedLogs = await scheduledLogModel.default.updateScheduledLogs(vehicle.id, internalRequest);
  const scheduledLogsWithInstances = await scheduledLogModel.default.getSpecifiedVehicleScheduledLogs(
    updatedLogs.map((log) => log.id),
    vehicle.id
  );

  return {
    scheduledLogs: scheduledLogsWithInstances.map((scheduledLogWithInstance) => {
      return transformToCalculatedScheduledLogDto(scheduledLogWithInstance);
    }),
    vehicle,
  };
};

export const findVehicleScheduledLogs = async (vehicleId: string, userId: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  // If requesting user can access the vehicle, then they can fetch the scheduled logs for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  const scheduledLogsWithInstances = await scheduledLogModel.default.getVehicleScheduledLogs(vehicle.id);
  return scheduledLogsWithInstances.map((scheduledLogWithInstance) => {
    return transformToCalculatedScheduledLogDto(scheduledLogWithInstance);
  });
};

export const removeScheduledLogs = async (ids: string[], vehicleId: string, userId: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  // If requesting user can access the vehicle, then they can delete a scheduled log for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  await scheduledLogModel.default.deleteScheduledLogs(ids, vehicle.id);

  return { ids, vehicle };
};

export const calculateNextServiceMileageAndDate = (
  datePerformed: Date,
  mileagePerformed: number,
  mileInterval: number,
  timeInterval: number,
  timeUnits: string
) => {
  const nextServiceDate = new Date(datePerformed);

  switch (timeUnits) {
    case 'DAY':
      nextServiceDate.setDate(nextServiceDate.getDate() + timeInterval);
      break;
    case 'WEEK':
      nextServiceDate.setDate(nextServiceDate.getDate() + timeInterval * 7);
      break;
    case 'MONTH':
      nextServiceDate.setMonth(nextServiceDate.getMonth() + timeInterval);
      break;
    case 'YEAR':
      nextServiceDate.setFullYear(nextServiceDate.getFullYear() + timeInterval);
      break;
  }

  const nextServiceMileage = mileagePerformed + mileInterval;

  return { nextServiceMileage, nextServiceDate };
};

const transformToCalculatedScheduledLogDto = (
  scheduledLogWithInstance: Awaited<ReturnType<typeof scheduledLogModel.default.getVehicleScheduledLog>>
) => {
  const { scheduledServiceInstance, ...scheduledLog } = scheduledLogWithInstance;

  const { nextServiceMileage, nextServiceDate } = calculateNextServiceMileageAndDate(
    scheduledLog.datePerformed,
    scheduledLog.mileage,
    scheduledServiceInstance.mileInterval,
    scheduledServiceInstance.timeInterval,
    scheduledServiceInstance.timeUnits
  );

  const dto: ScheduledLogDto = {
    ...scheduledLog,
    nextServiceMileage,
    nextServiceDate,
  };

  return dto;
};
