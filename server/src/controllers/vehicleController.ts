import { Request, Response } from 'express';
import { handleError } from './utils';
import {
  createVehicle,
  updateVehicle,
  findVehicles,
  findVehicle,
  removeVehicle,
  findSharedVehicles,
} from '../services/vehicleService';
import {
  CreateOrUpdateVehicleRequest,
  CreateOrUpdateVehicleRequestSchema,
  ShareVehicleRequest,
  ShareVehicleRequestSchema,
} from '../types/vehicle';
import { getFileBuffer } from '../services/storageService';
import { STORAGE_BUCKET_NAME } from '../constants';
import {
  createVehicleAttachment,
  exportAttachment,
  findVehicleAttachments,
  removeVehicleAttachment,
} from '../services/attachmentService';
import {
  createVehicleShare,
  findVehicleShare,
  getUsersSharedWithVehicle,
  removeVehicleShare,
} from '../services/vehicleShare';
import { findVehicleChangelog } from '../services/vehicleChangelogService';
import VehicleChangeLogPublisher from '../eventbus/publishers/VehicleChangeLogPublisher';
import ChangelogPublisher from '../eventbus/publishers/ChangelogPublisher';
import APIError from '../errors/APIError';

export const postVehicle = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;

    const requestBody: CreateOrUpdateVehicleRequest = CreateOrUpdateVehicleRequestSchema.parse(req.body);
    const vehicle = await createVehicle(userId, requestBody);

    VehicleChangeLogPublisher.vehicleCreated(req.user.userId, req.user.username, vehicle.id, vehicle.name);

    res.status(200).json(vehicle);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const putVehicle = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const requestBody: CreateOrUpdateVehicleRequest = CreateOrUpdateVehicleRequestSchema.parse(req.body);
    const vehicle = await updateVehicle(vehicleId, userId, requestBody);

    VehicleChangeLogPublisher.vehicleUpdated(req.user.userId, req.user.username, vehicle.id, requestBody);

    res.status(200).json(vehicle);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;

    const queryParams = req.query;
    const shared = queryParams.shared;

    const vehicles = shared === 'true' ? await findSharedVehicles(userId) : await findVehicles(userId);
    res.status(200).json(vehicles);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getVehicle = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const vehicle = await findVehicle(vehicleId, userId);
    res.status(200).json(vehicle);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const vehicle = await removeVehicle(vehicleId, userId);

    ChangelogPublisher.vehicleDeleted(req.user.userId, req.user.username, vehicle.name);

    res.status(200).json(vehicle);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const postVehicleAttachment = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const { buffer, filename, mimeType } = await getFileBuffer(req);
    const uint8 = new Uint8Array(buffer);
    const file = new File([uint8], filename, { type: mimeType, lastModified: Date.now() });

    const attachment = await createVehicleAttachment(vehicleId, userId, file);

    res.status(200).json(attachment);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const postVehicleShare = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const requestBody: ShareVehicleRequest = ShareVehicleRequestSchema.parse(req.body);

    const vehicleShare = await createVehicleShare(vehicleId, userId, requestBody.userId);
    const { usernameOfShared, vehicleName, ...rest } = vehicleShare;

    VehicleChangeLogPublisher.shareVehicle(
      req.user.userId,
      req.user.username,
      usernameOfShared,
      vehicleShare.vehicleId,
      vehicleName
    );

    res.status(200).json(rest);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getVehicleShare = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const requestBody: ShareVehicleRequest = ShareVehicleRequestSchema.parse(req.body);

    const vehicleShare = await findVehicleShare(vehicleId, userId, requestBody.userId);

    res.status(200).json(vehicleShare);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getVehicleShares = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const vehicleShares = await getUsersSharedWithVehicle(vehicleId, userId);

    res.status(200).json(vehicleShares);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const deleteVehicleShare = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const requestBody: ShareVehicleRequest = ShareVehicleRequestSchema.parse(req.body);

    await removeVehicleShare(vehicleId, userId, requestBody.userId);

    res.status(200).json({ vehicleId, userId: requestBody.userId });
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getSharedVehicles = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;

    const sharedVehicles = await findSharedVehicles(userId);

    res.status(200).json(sharedVehicles);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const deleteVehicleAttachment = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;
    const vehicleId = params.vehicleId;
    const attachmentId = params.attachmentId;

    const attachment = await removeVehicleAttachment(attachmentId, vehicleId, userId);

    res.status(200).json(attachment);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getVehicleAttachments = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;
    const vehicleId = params.vehicleId;

    const attachments = await findVehicleAttachments(vehicleId, userId);

    res.status(200).json(attachments);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getVehicleChangelog = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;
    const vehicleId = params.vehicleId;

    const changelog = await findVehicleChangelog(vehicleId, userId);

    res.status(200).json(changelog);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const downloadAttachment = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;
    const vehicleId = params.vehicleId;
    const attachmentId = params.attachmentId;

    const attachmentWithBytes = await exportAttachment(userId, vehicleId, attachmentId);
    const { file } = attachmentWithBytes;

    if (!file) {
      throw new APIError('No file associated with attachment', 500);
    }

    const contentType =
      attachmentWithBytes.contentType && attachmentWithBytes.contentType.trim()
        ? attachmentWithBytes.contentType
        : 'application/octet-stream';
    const filename =
      attachmentWithBytes.filename && attachmentWithBytes.filename ? attachmentWithBytes.filename : 'download.bin';

    // Minimal sanitizing
    const fallback = filename.replace(/["\\]/g, '_');
    const encoded = encodeURIComponent(filename);
    const contentDisposition = `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;

    const bytes = file.contents as Uint8Array;
    const buf: Buffer = Buffer.isBuffer(bytes) ? (bytes as Buffer) : Buffer.from(bytes);

    res.set({
      'Content-Type': contentType,
      'Content-Length': buf.length.toString(),
      'Content-Disposition': contentDisposition,
      'Cache-Control': 'private, max-age=0, must-revalidate',
    });

    res.send(buf);
  } catch (error) {
    handleError(res, error as Error);
  }
};
