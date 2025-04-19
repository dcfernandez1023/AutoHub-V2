import { Vehicle } from '@prisma/client';
import { STORAGE_BUCKET_NAME, VEHICLE_ATTACHMENT_FPATH, VEHICLE_ATTACHMENT_LIMIT } from '../constants';
import APIError from '../errors/APIError';
import { buildStorageFileUrl, getSupabaseClient } from '../supabase/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { checkIfCanAccessVehicle } from './vehicleService';

const busboy = require('busboy');

type FileInfo = {
  filename: string;
  mimeType: string;
};

type FileBufferResult = {
  buffer: Buffer;
  filename: string;
  mimeType: string;
};

export const getFileBuffer = (req: Request): Promise<FileBufferResult> => {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });

    let fileFound = false;

    bb.on('file', (fieldname: string, file: NodeJS.ReadableStream, info: FileInfo) => {
      fileFound = true;
      const { filename, mimeType } = info;
      const chunks: Buffer[] = [];

      file.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      file.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({ buffer, filename, mimeType });
      });

      file.on('error', reject);
    });

    bb.on('finish', () => {
      if (!fileFound) {
        reject(new Error('No file found in the request'));
      }
    });

    bb.on('error', reject);

    req.pipe(bb);
  });
};

export const uploadVehicleAttachment = async (
  id: string,
  userId: string,
  bucketName: STORAGE_BUCKET_NAME,
  buffer: Buffer,
  filename: string,
  mimeType: string
) => {
  if (!id) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!filename) {
    throw new APIError('Filename not provided', 400);
  }
  if (filename.length >= 100) {
    throw new APIError('Filename must be less than 100 characters', 400);
  }
  if (!bucketName) {
    throw new APIError('Failed to find storage bucket', 500);
  }
  if (!buffer || !mimeType) {
    throw new APIError('Could not read buffer or mimetype', 500);
  }

  const vehicle = await checkIfCanAccessVehicle(id, userId);

  const supabaseClient = getSupabaseClient();

  const attachmentId = uuidv4();
  const timestamp = new Date().getTime();
  const storageFilename = `${attachmentId}-${vehicle.id}-${timestamp}-${filename}`;

  const { data, error } = await supabaseClient.storage
    .from(bucketName)
    .upload(storageFilename, buffer, { contentType: mimeType });

  if (error) {
    throw new APIError('Failed to upload attachment', 400);
  }

  return { attachmentId, attachmentUrl: buildStorageFileUrl(bucketName, VEHICLE_ATTACHMENT_FPATH, storageFilename) };
};
