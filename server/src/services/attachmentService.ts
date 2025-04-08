import APIError from '../errors/APIError';
import * as vehicleAttachmentModel from '../models/vehicleAttachment';

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

  return await vehicleAttachmentModel.default.createAttachment(id, vehicleId, userId, url);
};

export const getVehicleAttachments = async (vehicleId: string, userId: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicle id provided', 400);
  }
  if (!userId) {
    throw new APIError('No user id provided', 400);
  }

  return await vehicleAttachmentModel.default.getAttachments(vehicleId, userId);
};
