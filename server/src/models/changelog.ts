import { CHANGELOG_LIMIT_PER_USER } from '../constants';
import { db } from '../database/database';

const createChangelog = async (userId: string, description: string) => {
  let createdChangelog = null;
  await db.$transaction(async (tx) => {
    // Create the changelog
    createdChangelog = await tx.changelog.create({ data: { userId, description } });

    // Count number of change logs for the user
    const count = await tx.changelog.count({ where: { userId } });

    // If count is over the limit, then delete the oldest ones
    if (count > CHANGELOG_LIMIT_PER_USER) {
      const excess = count - CHANGELOG_LIMIT_PER_USER;

      const oldest = await tx.changelog.findMany({
        where: { userId },
        orderBy: { dateCreated: 'asc' },
        take: excess,
        select: { id: true },
      });

      await tx.changelog.deleteMany({
        where: { id: { in: oldest.map((changelog) => changelog.id) } },
      });
    }
  });

  if (!createdChangelog) {
    throw new Error('No changelog created');
  }

  return createdChangelog;
};

const getChangelog = async (userId: string, orderByDate: 'asc' | 'desc' = 'desc') => {
  return await db.changelog.findMany({ where: { userId }, orderBy: { dateCreated: orderByDate } });
};

export default { createChangelog, getChangelog };
