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
import { getFileBuffer, uploadVehicleAttachment } from '../services/storageService';
import { STORAGE_BUCKET_NAME } from '../constants';
import {
  createVehicleAttachment,
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

export const postVehicle = async (req: Request, res: Response) => {
  try {
    console.log(req);
    const params = req.params;
    const userId = params.userId;

    const requestBody: CreateOrUpdateVehicleRequest = CreateOrUpdateVehicleRequestSchema.parse(req.body);
    const vehicle = await createVehicle(userId, requestBody);

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
    res.status(200).json(vehicle);
  } catch (error) {
    handleError(res, error as Error);
  }
};

// TODO: Optimize this. uploadVehicleAttachment() and createVehicleAttachment() both call checkIfCanAccessVehicle()
export const postVehicleAttachment = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const { buffer, filename, mimeType } = await getFileBuffer(req);

    const { attachmentId, attachmentUrl, filePath } = await uploadVehicleAttachment(
      vehicleId,
      userId,
      STORAGE_BUCKET_NAME.VEHICLE,
      buffer,
      filename,
      mimeType
    );

    const attachment = await createVehicleAttachment(attachmentId, vehicleId, userId, attachmentUrl, filePath);

    res.status(200).json({ attachmentId, attachmentUrl });
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

    res.status(200).json(vehicleShare);
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
