import { CHANGELOG_LIMIT_PER_USER } from '../constants';
import { db } from '../database/database';

const createVehicleChangelog = async (vehicleId: string, userId: string, description: string) => {
  let createdChangelog = null;
  await db.$transaction(async (tx) => {
    // Create the changelog
    createdChangelog = await tx.vehicleChangelog.create({ data: { userId, vehicleId, description } });

    // Count number of change logs for the user
    const count = await tx.vehicleChangelog.count({ where: { userId } });

    // If count is over the limit, then delete the oldest ones
    if (count > CHANGELOG_LIMIT_PER_USER) {
      const excess = count - CHANGELOG_LIMIT_PER_USER;

      const oldest = await tx.vehicleChangelog.findMany({
        where: { userId },
        orderBy: { dateCreated: 'asc' },
        take: excess,
        select: { id: true },
      });

      await tx.vehicleChangelog.deleteMany({
        where: { id: { in: oldest.map((changelog) => changelog.id) } },
      });
    }
  });

  if (!createdChangelog) {
    throw new Error('No changelog created');
  }

  return createdChangelog;
};

const getVehicleChangelog = async (vehicleId: string, orderByDate: 'asc' | 'desc' = 'desc') => {
  return await db.vehicleChangelog.findMany({ where: { vehicleId }, orderBy: { dateCreated: orderByDate } });
};

const getVehicleChangelogByUser = async (userId: string, orderByDate: 'asc' | 'desc' = 'desc') => {
  return await db.vehicleChangelog.findMany({ where: { userId }, orderBy: { dateCreated: orderByDate } });
};

export default { createVehicleChangelog, getVehicleChangelog, getVehicleChangelogByUser };
