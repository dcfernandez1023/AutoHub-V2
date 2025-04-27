import APIError from '../errors/APIError';
import * as scheduledServiceTypeModel from '../models/scheduledServiceType';

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

export const findScheduledServiceTypes = async (userId: string) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const scheduledServiceTypes = await scheduledServiceTypeModel.default.getScheduledServiceTypes(userId);
  return scheduledServiceTypes;
};
