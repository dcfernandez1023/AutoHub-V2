import { VehicleAttachment } from '@prisma/client';
import { STORAGE_BUCKET_NAME } from '../constants';
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

  // Check that requesting user has access to the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  const path = `${userId}/vehicles/${vehicle.id}/${crypto.randomUUID()}-${file.name}`;

  // TODO: Upload to storage
  const supabaseClient = getSupabaseClient();

  const { error } = await supabaseClient.storage.from(STORAGE_BUCKET_NAME.VEHICLES).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new APIError(`Failed to upload to storage: ${error.message}`, 500);
  }

  try {
    return await vehicleAttachmentModel.default.createAttachment(
      vehicle.id,
      vehicle.userId,
      file.name,
      path,
      file.type,
      Math.round((file.size / (1024 * 1024) + Number.EPSILON) * 100) / 100
    );
  } catch (error) {
    await supabaseClient.storage.from(STORAGE_BUCKET_NAME.VEHICLES).remove([path]);
    throw new APIError('Failed write attachment to database', 500);
  }
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

  const attachment = await vehicleAttachmentModel.default.getAttachment(attachmentId, vehicle.id);
  if (!attachment) {
    throw new APIError('No attachment found', 404);
  }

  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient.storage.from(STORAGE_BUCKET_NAME.VEHICLES).remove([attachment.path]);
  if (error) {
    throw new APIError(`Failed to delete attachment from storage: ${error.message}`, 500);
  }

  const deletedAttachment = await vehicleAttachmentModel.default.deleteAttachment(attachment.id, vehicle.id);

  return deletedAttachment;
};

export const removeVehicleAttachmentsFromStorage = async (vehicleId: string, userId: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicle id provided', 400);
  }
  if (!userId) {
    throw new APIError('No user id provided', 400);
  }

  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  const attachments = await vehicleAttachmentModel.default.getAttachments(vehicle.id);
  const paths = attachments.map((attachment) => attachment.path);

  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient.storage.from(STORAGE_BUCKET_NAME.VEHICLES).remove(paths);
  if (error) {
    throw new APIError(`Failed to delete attachments from storage: ${error.message}`, 500);
  }
};

export const removeUserVehicleAttachmentsFromStorage = async (userId: string) => {
  if (!userId) {
    throw new APIError('No user id provided', 400);
  }

  const attachments = await vehicleAttachmentModel.default.getAttachmentsByUser(userId);
  const paths = attachments.map((attachment) => attachment.path);

  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient.storage.from(STORAGE_BUCKET_NAME.VEHICLES).remove(paths);
  if (error) {
    throw new APIError(`Failed to delete attachments from storage: ${error.message}`, 500);
  }
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

  const attachment = await vehicleAttachmentModel.default.getAttachment(attachmentId, vehicle.id);

  if (!attachment) {
    throw new APIError('No attachment found', 404);
  }

  return await generateSignedAttachmentUrl(attachment);
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
