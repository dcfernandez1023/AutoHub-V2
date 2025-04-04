import APIError from '../errors/APIError';
import { CreateOrUpdateVehicleRequest } from '../types/vehicle';
import * as vehicleModel from '../models/vehicle';
import { Vehicle } from '@prisma/client';

export const createVehicle = async (userId: string, request: CreateOrUpdateVehicleRequest) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  // Set the dateCreated to now
  request.dateCreated = new Date().getTime();
  const vehicle = await vehicleModel.default.createVehicle(userId, request);
  return formatVehicleResponse(vehicle);
};

export const updateVehicle = async (id: string, userId: string, request: CreateOrUpdateVehicleRequest) => {
  if (!id) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const vehicle = await vehicleModel.default.updateVehicle(id, userId, request);
  return formatVehicleResponse(vehicle);
};

export const findVehicles = async (userId: string) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const vehicles = await vehicleModel.default.getVehicles(userId);
  return vehicles.map((vehicle) => formatVehicleResponse(vehicle));
};

export const findVehicle = async (id: string, userId: string) => {
  if (!id) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const vehicle = await vehicleModel.default.getVehicle(id, userId);

  if (!vehicle) {
    throw new APIError('No vehicle found', 404);
  }

  return formatVehicleResponse(vehicle);
};

export const removeVehicle = async (id: string, userId: string) => {
  if (!id) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const vehicle = await vehicleModel.default.deleteVehicle(id, userId);

  if (!vehicle) {
    throw new APIError('No vehicle found', 404);
  }

  return formatVehicleResponse(vehicle);
};

const formatVehicleResponse = (vehicle: Vehicle) => {
  return { ...vehicle, dateCreated: Number(vehicle.dateCreated) };
};
