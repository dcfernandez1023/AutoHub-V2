import APIError from '../errors/APIError';
import * as scheduledServiceTypeModel from '../models/scheduledServiceType';
import * as scheduledServiceInstanceModel from '../models/scheduledServiceInstance';
import { checkIfCanAccessVehicle } from './vehicleService';

export const createScheduledServiceType = async (userId: string, name: string) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }
  if (!name?.trim().length) {
    throw new APIError('No name provided', 400);
  }

  const scheduledServiceType = await scheduledServiceTypeModel.default.createScheduledServiceType(userId, name);
  return scheduledServiceType;
};

export const updateScheduledServiceType = async (id: string, userId: string, name: string) => {
  if (!id) {
    throw new APIError('No id provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }
  if (!name?.trim().length) {
    throw new APIError('No name provided', 400);
  }

  const scheduledServiceType = await scheduledServiceTypeModel.default.updateScheduledServiceType(id, userId, name);
  return scheduledServiceType;
};

export const removeScheduledServiceType = async (id: string, userId: string) => {
  if (!id) {
    throw new APIError('No id provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const scheduledServiceType = await scheduledServiceTypeModel.default.deleteScheduledServiceType(id, userId);
  return scheduledServiceType;
};

// optional param vehicleId for getting scheduled service types related to shared vehicle
export const findScheduledServiceTypes = async (userId: string, vehicleId?: string) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  if (vehicleId) {
    const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);
    const result =
      await scheduledServiceInstanceModel.default.getVehicleScheduledServiceInstancesWithScheduledServiceTypes(
        vehicle.id
      );
    return result.map((d) => d.scheduledServiceType);
  }

  const scheduledServiceTypes = await scheduledServiceTypeModel.default.getScheduledServiceTypes(userId);
  return scheduledServiceTypes;
};
