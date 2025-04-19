import APIError from '../errors/APIError';
import * as vehicleAttachmentModel from '../models/vehicleAttachment';
import { checkIfCanAccessVehicle } from './vehicleService';

export const createVehicleAttachment = async (id: string, vehicleId: string, userId: string, url: string) => {
  if (!id) {
    throw new APIError('No attachment id provided', 400);
  }
  if (!vehicleId) {
    throw new APIError('No vehicle id provided', 400);
  }
  if (!userId) {
    throw new APIError('No user id provided', 400);
  }
  if (!url) {
    throw new APIError('No attachment url provided', 400);
  }

  // Check that requesting user has access to the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  return await vehicleAttachmentModel.default.createAttachment(id, vehicle.id, userId, url);
};

export const getVehicleAttachments = async (vehicleId: string, userId: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicle id provided', 400);
  }
  if (!userId) {
    throw new APIError('No user id provided', 400);
  }

  // Check that requesting user has access to the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  return await vehicleAttachmentModel.default.getAttachments(vehicle.id, userId);
};
