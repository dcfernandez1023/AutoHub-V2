import { Prisma } from '@prisma/client';
import { db } from '../database/database';
import { CreateRepairLogRequestInternal, UpdateRepairLogRequestInternal } from '../types/log';
import { RepairLogImportDto } from '../types/import';

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

export const getRepairLogs = async (userId: string) => {
  return await db.repairLog.findMany({ where: { userId } });
};

const getVehicleRepairLogs = async (vehicleId: string) => {
  return await db.repairLog.findMany({ where: { vehicleId } });
};

const deleteRepairLogs = async (ids: string[], vehicleId: string) => {
  return await db.repairLog.deleteMany({ where: { id: { in: ids }, vehicleId } });
};

const importRepairLogs = async (userId: string, recordImport: RepairLogImportDto[]) => {
  return await db.repairLog.createMany({ data: recordImport.map((record) => ({ userId, ...record })) });
};

export default {
  createRepairLog,
  updateRepairLogs,
  getVehicleRepairLogs,
  deleteRepairLogs,
  importRepairLogs,
  getRepairLogs,
};
