import APIError from '../errors/APIError';
import {
  CreateRepairLogRequest,
  CreateRepairLogRequestSchema,
  CreateRepairLogRequestSchemaInternal,
  UpdateRepairLogRequest,
  UpdateRepairLogRequestSchemaArray,
  UpdateRepairLogRequestSchemaInternalArray,
} from '../types/log';
import { checkIfCanAccessVehicle } from './vehicleService';
import * as repairLogModel from '../models/repairLog';

export const createRepairLog = async (vehicleId: string, userId: string, request: CreateRepairLogRequest) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const parsedRequest = CreateRepairLogRequestSchema.parse(request);
  // Transform to internal request, with datePerformed as a Date type
  const internalRequest = CreateRepairLogRequestSchemaInternal.parse({
    ...parsedRequest,
    datePerformed: new Date(parsedRequest.datePerformed),
  });

  // If requesting user can access the vehicle, then they can create a repair log for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  return await repairLogModel.default.createRepairLog(vehicle.id, vehicle.userId, internalRequest);
};

export const updateRepairLogs = async (vehicleId: string, userId: string, request: UpdateRepairLogRequest) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }

  const parsedRequest = UpdateRepairLogRequestSchemaArray.parse(request);
  // Transform to internal request, with datePerformed as a Date type
  const internalRequest = UpdateRepairLogRequestSchemaInternalArray.parse(
    parsedRequest.map((obj) => ({
      ...obj,
      datePerformed: new Date(obj.datePerformed),
    }))
  );

  // If requesting user can access the vehicle, then they can update repair logs for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  return await repairLogModel.default.updateRepairLogs(vehicle.id, internalRequest);
};

export const findVehicleRepairLogs = async (vehicleId: string, userId: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  // If requesting user can access the vehicle, then they can fetch the repair logs for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  const repairLogs = await repairLogModel.default.getVehicleRepairLogs(vehicle.id);
  return repairLogs;
};

export const removeRepairLog = async (id: string, vehicleId: string, userId: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  // If requesting user can access the vehicle, then they can delete a repair log for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  return await repairLogModel.default.deleteRepairLog(id, vehicle.id);
};
