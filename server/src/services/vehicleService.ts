import APIError from '../errors/APIError';
import { CreateOrUpdateVehicleRequest } from '../types/vehicle';
import * as vehicleModel from '../models/vehicle';
import { Vehicle } from '@prisma/client';
import * as vehicleShareModel from '../models/vehicleShare';

export type FormattedVehicle = ReturnType<typeof formatVehicleResponse>;

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

  const vehicle = await checkIfCanAccessVehicle(id, userId);
  const updatedVehicle = await vehicleModel.default.updateVehicle(vehicle.id, userId, request);

  return formatVehicleResponse(updatedVehicle);
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

  const vehicle = await checkIfCanAccessVehicle(id, userId);

  return formatVehicleResponse(vehicle);
};

// TODO: Delete vehicle attachments from storage when vehicle is deleted (also when user is deleted)
export const removeVehicle = async (id: string, userId: string) => {
  if (!id) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const vehicle = await checkIfCanAccessVehicle(id, userId);
  const deletedVehicle = await vehicleModel.default.deleteVehicle(vehicle.id, userId);

  return formatVehicleResponse(deletedVehicle);
};

export const findSharedVehicles = async (userId: string) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const sharedVehicles = await vehicleModel.default.getSharedVehicles(userId);

  if (!sharedVehicles) {
    throw new APIError('No shared vehicles found', 404);
  }

  return sharedVehicles;
};

export const checkIfCanAccessVehicle = async (
  vehicleId: string,
  userId: string,
  ownerOnly: boolean = false
): Promise<Vehicle> => {
  const vehicle = await vehicleModel.default.getVehicleById(vehicleId);

  if (!vehicle) {
    throw new APIError('No vehicle found', 404);
  }

  // If the requesting user is the owner of the vehicle, then return true
  if (vehicle.userId === userId) {
    return vehicle;
  }

  if (!ownerOnly) {
    // Check if the vehicle has been shared with the requesting user
    const vehicleShare = await vehicleShareModel.default.getVehicleShare(vehicleId, userId);
    if (vehicleShare?.userId == userId) {
      return vehicle;
    }
  }

  // Throw 403 (Forbidden) error, since the requesting user is not the owner of the vehicle, and the vehicle is not shared with the requesting user
  throw new APIError('Cannot access this vehicle', 403);
};

export const formatVehicleResponse = (vehicle: Vehicle) => {
  return { ...vehicle, dateCreated: Number(vehicle.dateCreated) };
};
