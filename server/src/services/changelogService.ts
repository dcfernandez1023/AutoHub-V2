import * as vehicleChangelogModel from '../models/vehicleChangelog';
import * as changelogModel from '../models/changelog';
import APIError from '../errors/APIError';

export const findChangelog = async (userId: string) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const changelog = await changelogModel.default.getChangelog(userId, 'desc');
  const vehicleChangelog = await vehicleChangelogModel.default.getVehicleChangelogByUser(userId, 'desc');

  return {
    changelog,
    vehicleChangelog,
  };
};
