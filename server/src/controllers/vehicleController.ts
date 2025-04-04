import { Request, Response } from 'express';
import { handleError } from './utils';
import { createVehicle, updateVehicle, findVehicles, findVehicle, removeVehicle } from '../services/vehicleService';
import { CreateOrUpdateVehicleRequest, CreateOrUpdateVehicleRequestSchema } from '../types/vehicle';

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

    const vehicles = await findVehicles(userId);
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
