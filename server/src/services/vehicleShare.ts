import APIError from '../errors/APIError';
import * as vehicleShareModel from '../models/vehicleShare';
import * as userModel from '../models/user';
import { FormattedVehicle } from './vehicleService';

export const createVehicleShare = async (vehicle: FormattedVehicle, userIdToShare: string) => {
  if (!vehicle) {
    throw new APIError('No vehicle provided', 400);
  }

  const vehicleId = vehicle.id;
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userIdToShare) {
    throw new APIError('No userId to share provided', 400);
  }
  if (vehicle.userId === userIdToShare) {
    throw new APIError('Cannot share a vehicle with the owning user', 400);
  }

  const userToShare = await userModel.default.getUserById(userIdToShare);

  if (!userToShare) {
    throw new APIError('No such user found', 404);
  }

  const vehicleShare = await vehicleShareModel.default.shareVehicle(vehicleId, userIdToShare);

  if (!vehicleShare) {
    throw new APIError('Failed to share vehicle', 500);
  }

  return vehicleShare;
};

export const findVehicleShare = async (vehicleId: string, userIdToShare: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userIdToShare) {
    throw new APIError('No userId provided', 400);
  }

  const vehicleShare = await vehicleShareModel.default.getVehicleShare(vehicleId, userIdToShare);

  if (!vehicleShare) {
    throw new APIError('Could not find vehicle share', 404);
  }

  return vehicleShare;
};

export const removeVehicleShare = async (vehicle: FormattedVehicle, userIdToShare: string) => {
  const vehicleId = vehicle.id;
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  if (!userIdToShare) {
    throw new APIError('No userId to share provided', 400);
  }
  if (vehicle.userId === userIdToShare) {
    throw new APIError('Cannot delete a vehicle share of the owning user', 400);
  }

  const vehicleShare = await findVehicleShare(vehicleId, userIdToShare);

  await vehicleShareModel.default.deleteVehicleShare(vehicleShare.vehicleId, vehicleShare.userId);
};

export const removeVehicleShares = async (vehicleId: string) => {
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }

  await vehicleShareModel.default.deleteVehicleShares(vehicleId);
};
