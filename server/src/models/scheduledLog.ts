import { Prisma } from '@prisma/client';
import { db } from '../database/database';
import { CreateScheduledLogRequestInternal, UpdateScheduledLogRequestInternal } from '../types/log';

const createScheduledLog = async (vehicleId: string, userId: string, request: CreateScheduledLogRequestInternal) => {
  return await db.scheduledLog.create({ data: { vehicleId, userId, ...request } });
};

const updateScheduledLogs = async (vehicleId: string, request: UpdateScheduledLogRequestInternal[]) => {
  const updates: Prisma.PrismaPromise<any>[] = request.map((record) =>
    db.scheduledLog.update({
      where: {
        id: record.id,
        vehicleId,
      },
      data: record,
    })
  );

  return await db.$transaction(updates);
};

const getVehicleScheduledLogs = async (vehicleId: string) => {
  return await db.scheduledLog.findMany({ where: { vehicleId }, include: { scheduledServiceInstance: true } });
};

const deleteScheduledLog = async (id: string, vehicleId: string) => {
  return await db.scheduledLog.delete({ where: { id, vehicleId } });
};

export default { createScheduledLog, updateScheduledLogs, getVehicleScheduledLogs, deleteScheduledLog };
