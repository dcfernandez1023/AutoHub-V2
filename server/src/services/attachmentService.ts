import { VehicleAttachment } from '@prisma/client';
import { MAX_ATTACHMENT_FILE_BYTES, STORAGE_BUCKET_NAME } from '../constants';
import APIError from '../errors/APIError';
import * as vehicleAttachmentModel from '../models/vehicleAttachment';
import { getSupabaseClient } from '../supabase/supabase';
import { checkIfCanAccessVehicle } from './vehicleService';

export const createVehicleAttachment = async (vehicleId: string, userId: string, file: File) => {
  if (!vehicleId) {
    throw new APIError('No vehicle id provided', 400);
  }
  if (!userId) {
    throw new APIError('No user id provided', 400);
  }
  if (!file) {
    throw new APIError('No file provided', 400);
  }

  if (file.size > MAX_ATTACHMENT_FILE_BYTES) {
    throw new APIError('File size cannot exceed 15 MB', 400);
  }

  // Check that requesting user has access to the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  const path = `${userId}/vehicles/${vehicle.id}/${crypto.randomUUID()}-${file.name}`;
  const size = Math.round((file.size / (1024 * 1024) + Number.EPSILON) * 100) / 100;

  const { vehicleAttachment } = await vehicleAttachmentModel.default.createAttachment(
    vehicle.id,
    vehicle.userId,
    file,
    path,
    size
  );

  return vehicleAttachment;
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

  const deletedAttachment = await vehicleAttachmentModel.default.deleteAttachment(attachmentId, vehicle.id);

  return deletedAttachment;
};

export const exportAttachment = async (userId: string, vehicleId: string, attachmentId: string) => {
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

  const result = await vehicleAttachmentModel.default.getAttachmentWithFile(attachmentId, vehicle.id);

  if (!result) {
    throw new APIError('No attachment found', 404);
  }

  if (!result.file) {
    throw new APIError('Vehicle attachment has no associated file', 500);
  }

  return result;
};

export const generateSignedAttachmentUrl = async (attachment: VehicleAttachment) => {
  const supabaseClient = getSupabaseClient();

  const { data, error } = await supabaseClient.storage
    .from(STORAGE_BUCKET_NAME.VEHICLES)
    .createSignedUrl(attachment.path, 60, { download: attachment.filename });

  if (error) {
    throw error;
  }

  return data.signedUrl;
};
