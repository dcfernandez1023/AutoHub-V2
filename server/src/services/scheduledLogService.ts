import APIError from '../errors/APIError';
import {
  CreateScheduledLogRequest,
  CreateScheduledLogRequestSchema,
  CreateScheduledLogRequestSchemaInternal,
  ScheduledLogDto,
  UpdateScheduledLogRequest,
  UpdateScheduledLogRequestSchemaArray,
  UpdateScheduledLogRequestSchemaInternalArray,
} from '../types/scheduledLog';
import { checkIfCanAccessVehicle } from './vehicleService';
import scheduledLog, * as scheduledLogModel from '../models/scheduledLog';
import { ScheduledLog, ScheduledServiceInstance } from '@prisma/client';

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

  return await scheduledLogModel.default.createScheduledLog(vehicle.id, vehicle.userId, internalRequest);
};

export const updateScheduledLogs = async (vehicleId: string, userId: string, request: UpdateScheduledLogRequest) => {
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

  return await scheduledLogModel.default.updateScheduledLogs(vehicle.id, internalRequest);
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
    const { scheduledServiceInstance, ...scheduledLog } = scheduledLogWithInstance;

    const { nextServiceMileage, nextServiceDate } = calculateNextServiceMileageAndDate(
      scheduledLog,
      scheduledServiceInstance
    );

    const dto: ScheduledLogDto = {
      ...scheduledLog,
      nextServiceMileage,
      nextServiceDate,
    };

    return dto;
  });
};

export const removeScheduledLog = async (id: string, vehicleId: string, userId: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  // If requesting user can access the vehicle, then they can delete a scheduled log for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  return await scheduledLogModel.default.deleteScheduledLog(id, vehicle.id);
};

const calculateNextServiceMileageAndDate = (
  scheduledLog: ScheduledLog,
  scheduledServiceInstance: ScheduledServiceInstance
) => {
  const nextServiceDate = scheduledLog.datePerformed;
  const timeUnits = scheduledServiceInstance.timeUnits;
  const timeInterval = scheduledServiceInstance.timeInterval;

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

  const nextServiceMileage = scheduledLog.mileage + scheduledServiceInstance.mileInterval;

  return { nextServiceMileage, nextServiceDate };
};
