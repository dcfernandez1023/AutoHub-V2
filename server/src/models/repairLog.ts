import { Prisma } from '@prisma/client';
import { db } from '../database/database';
import { CreateRepairLogRequestInternal, UpdateRepairLogRequestInternal } from '../types/log';

const createRepairLog = async (vehicleId: string, userId: string, request: CreateRepairLogRequestInternal) => {
  return await db.repairLog.create({ data: { vehicleId, userId, ...request } });
};

const updateRepairLogs = async (vehicleId: string, request: UpdateRepairLogRequestInternal[]) => {
  const updates: Prisma.PrismaPromise<any>[] = request.map((record) =>
    db.repairLog.update({
      where: {
        id: record.id,
        vehicleId,
      },
      data: record,
    })
  );

  return await db.$transaction(updates);
};

const getVehicleRepairLogs = async (vehicleId: string) => {
  return await db.repairLog.findMany({ where: { vehicleId } });
};

const deleteRepairLog = async (id: string, vehicleId: string) => {
  return await db.repairLog.delete({ where: { id, vehicleId } });
};

export default { createRepairLog, updateRepairLogs, getVehicleRepairLogs, deleteRepairLog };
