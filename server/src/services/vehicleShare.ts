import APIError from '../errors/APIError';
import * as vehicleShareModel from '../models/vehicleShare';
import * as userModel from '../models/user';
import { checkIfCanAccessVehicle, FormattedVehicle } from './vehicleService';

export const createVehicleShare = async (vehicleId: string, userId: string, sharedUserId: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!sharedUserId) {
    throw new APIError('No userId to share provided', 400);
  }

  // Only the owner of the vehicle can share the vehicle with other users
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId, true);

  // Ensure that the vehicle isn't being shared with the owner of the vehicle
  if (vehicle.userId === sharedUserId) {
    throw new APIError('Cannot share a vehicle with the owning user', 400);
  }

  // Ensure that the user that this vehicle is being shared with actually exists
  const userToShare = await userModel.default.getUserById(sharedUserId);
  if (!userToShare) {
    throw new APIError('No such user found', 404);
  }

  // Ensure that the vehicle share doesn't already exist
  const existingVehicleShare = await vehicleShareModel.default.getVehicleShare(vehicle.id, sharedUserId);
  if (existingVehicleShare) {
    throw new APIError('Vehicle is already shared with user', 400);
  }

  // Share the vehicle
  const vehicleShare = await vehicleShareModel.default.shareVehicle(vehicleId, sharedUserId);

  if (!vehicleShare) {
    throw new APIError('Failed to share vehicle', 500);
  }

  return vehicleShare;
};

export const findVehicleShare = async (vehicleId: string, userId: string, sharedUserId: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!sharedUserId) {
    throw new APIError('No userId provided', 400);
  }

  // Check if vehicle exists and can be accessed by the requesting user
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  // Get the vehicle share
  const vehicleShare = await vehicleShareModel.default.getVehicleShare(vehicle.id, sharedUserId);

  if (!vehicleShare) {
    throw new APIError('Could not find vehicle share', 404);
  }

  return vehicleShare;
};

export const removeVehicleShare = async (vehicleId: string, userId: string, sharedUserId: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }
  if (!sharedUserId) {
    throw new APIError('No userId to share provided', 400);
  }

  // Only the owner of the vehicle can unshare the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId, true);

  if (vehicle.userId === sharedUserId) {
    throw new APIError('Cannot delete a vehicle share of the owning user', 400);
  }

  // Ensure that the vehicle share being deleted exists
  const vehicleShare = await vehicleShareModel.default.getVehicleShare(vehicleId, sharedUserId);
  if (!vehicleShare) {
    throw new APIError('Vehicle share not found', 404);
  }

  // Delete the vehicle share
  await vehicleShareModel.default.deleteVehicleShare(vehicleShare.vehicleId, vehicleShare.userId);
};
