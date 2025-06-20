import APIError from '../errors/APIError';
import * as vehicleAttachmentModel from '../models/vehicleAttachment';
import { checkIfCanAccessVehicle } from './vehicleService';

export const createVehicleAttachment = async (
  id: string,
  vehicleId: string,
  userId: string,
  url: string,
  filePath: string
) => {
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

  return await vehicleAttachmentModel.default.createAttachment(id, vehicle.id, vehicle.userId, url, filePath);
};

export const findVehicleAttachments = async (vehicleId: string, userId: string, checkAccess: boolean = true) => {
  if (!vehicleId) {
    throw new APIError('No vehicle id provided', 400);
  }
  if (!userId) {
    throw new APIError('No user id provided', 400);
  }

  // Check that requesting user has access to the vehicle
  if (checkAccess) {
    const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);
    return await vehicleAttachmentModel.default.getAttachments(vehicle.id);
  }

  return await vehicleAttachmentModel.default.getAttachments(vehicleId);
};

export const findVehicleAttachment = async (attachmentId: string, vehicleId: string, userId: string) => {
  if (!attachmentId) {
    throw new APIError('No attachmentId provided', 404);
  }
  if (!vehicleId) {
    throw new APIError('No vehicle id provided', 400);
  }
  if (!userId) {
    throw new APIError('No user id provided', 400);
  }

  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  const attachment = await vehicleAttachmentModel.default.getAttachment(attachmentId, vehicle.id);

  if (!attachment) {
    throw new APIError('No attachment found', 404);
  }

  return attachment;
};

export const removeVehicleAttachment = async (attachmentId: string, vehicleId: string, userId: string) => {
  if (!attachmentId) {
    throw new APIError('No attachmentId provided', 404);
  }
  if (!vehicleId) {
    throw new APIError('No vehicle id provided', 400);
  }
  if (!userId) {
    throw new APIError('No user id provided', 400);
  }

  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  const attachment = await findVehicleAttachment(attachmentId, vehicleId, userId);

  const deletedAttachment = await vehicleAttachmentModel.default.deleteAttachment(attachment.id, vehicle.id);

  return deletedAttachment;
};
