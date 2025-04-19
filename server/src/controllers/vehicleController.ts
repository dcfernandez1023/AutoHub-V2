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
import { createVehicleAttachment } from '../services/attachmentService';
import { createVehicleShare, findVehicleShare, removeVehicleShare } from '../services/vehicleShare';

export const postVehicle = async (req: Request, res: Response) => {
  try {
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
    const vehicleId = params.id;
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
    const vehicleId = params.id;
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
    const vehicleId = params.id;
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
    const vehicleId = params.id;
    const userId = params.userId;

    const { buffer, filename, mimeType } = await getFileBuffer(req);

    const { attachmentId, attachmentUrl } = await uploadVehicleAttachment(
      vehicleId,
      userId,
      STORAGE_BUCKET_NAME.VEHICLE,
      buffer,
      filename,
      mimeType
    );

    const attachment = await createVehicleAttachment(attachmentId, vehicleId, userId, attachmentUrl);

    res.status(200).json({ attachmentId, attachmentUrl });
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const postVehicleShare = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.id;
    const userId = params.userId;

    const requestBody: ShareVehicleRequest = ShareVehicleRequestSchema.parse(req.body);

    const vehicleShare = await createVehicleShare(vehicleId, userId, requestBody.userId);

    res.status(200).json({ vehicleShare });
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getVehicleShare = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.id;
    const userId = params.userId;

    const requestBody: ShareVehicleRequest = ShareVehicleRequestSchema.parse(req.body);

    const vehicleShare = await findVehicleShare(vehicleId, userId, requestBody.userId);

    res.status(200).json({ vehicleShare });
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const deleteVehicleShare = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.id;
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

    res.status(200).json({ sharedVehicles });
  } catch (error) {
    handleError(res, error as Error);
  }
};
