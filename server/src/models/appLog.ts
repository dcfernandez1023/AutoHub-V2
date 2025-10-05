import { db } from '../database/database';
import { AppLog, AppLogLevel } from '@prisma/client';

const APP_LOG_LIMIT = 100000;

const createAppLog = async (
  userId: string,
  event: string,
  duration: number,
  level: AppLogLevel,
  data: string
): Promise<AppLog> => {
  let createdAppLog = null;
  await db.$transaction(async (tx) => {
    // Create the app log
    createdAppLog = await tx.appLog.create({ data: { userId, event, duration, level, data } });

    // Count number of current app logs
    const count = await tx.appLog.count();

    // If count is over the limit, then delete the oldest ones
    if (count > APP_LOG_LIMIT) {
      const excess = count - APP_LOG_LIMIT;

      const oldest = await tx.appLog.findMany({
        orderBy: { timestamp: 'asc' },
        take: excess,
        select: { id: true },
      });

      await tx.appLog.deleteMany({
        where: { id: { in: oldest.map((changelog) => changelog.id) } },
      });
    }
  });

  if (!createdAppLog) {
    throw new Error('No app log created');
  }

  return createdAppLog;
};

export default { createAppLog };
