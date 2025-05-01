import { db } from '../database/database';
import { CreateScheduledLogRequestInternal, UpdateScheduledLogRequestSchemaInternal } from '../types/scheduledLog';

const createScheduledLog = async (vehicleId: string, userId: string, request: CreateScheduledLogRequestInternal) => {
  return await db.scheduledLog.create({ data: { vehicleId, userId, ...request } });
};

const updateScheduledLogs = async (vehicleId: string, request: UpdateScheduledLogRequestSchemaInternal[]) => {
  return await Promise.all(
    request.map((record) => {
      db.scheduledLog.update({ where: { id: record.scheduledServiceInstanceId, vehicleId }, data: record });
    })
  );
};

const getVehicleScheduledLogs = async (vehicleId: string) => {
  return await db.scheduledLog.findMany({ where: { vehicleId }, include: { scheduledServiceInstance: true } });
};

const deleteScheduledLog = async (id: string, vehicleId: string) => {
  return await db.scheduledLog.delete({ where: { id, vehicleId } });
};

export default { createScheduledLog, updateScheduledLogs, getVehicleScheduledLogs, deleteScheduledLog };
