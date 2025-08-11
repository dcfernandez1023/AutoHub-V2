import * as vehicleChangelogModel from '../models/vehicleChangelog';
import APIError from '../errors/APIError';
import { checkIfCanAccessVehicle } from './vehicleService';

export const findVehicleChangelog = async (vehicleId: string, userId: string) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }

  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);
  const changelog = await vehicleChangelogModel.default.getVehicleChangelog(vehicle.id, 'desc');

  return changelog;
};
