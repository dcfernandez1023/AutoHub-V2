import { db } from '../database/database';
import { ScheduledServiceTypeImport } from '../types/import';

const createScheduledServiceType = async (userId: string, name: string) => {
  return await db.scheduledServiceType.create({
    data: { userId, name },
  });
};

const updateScheduledServiceType = async (id: string, userId: string, name: string) => {
  return await db.scheduledServiceType.update({
    where: { id, userId },
    data: { name },
  });
};

const deleteScheduledServiceType = async (id: string, userId: string) => {
  return db.scheduledServiceType.delete({ where: { id, userId } });
};

const getScheduledServiceTypes = async (userId: string) => {
  return db.scheduledServiceType.findMany({ where: { userId } });
};

const getScheduledServiceType = async (id: string, userId: string) => {
  return db.scheduledServiceType.findFirst({ where: { id, userId } });
};

const importScheduledServiceTypes = async (userId: string, recordImport: ScheduledServiceTypeImport[]) => {
  return db.scheduledServiceType.createMany({ data: recordImport.map((record) => ({ userId, ...record })) });
};

export default {
  createScheduledServiceType,
  updateScheduledServiceType,
  deleteScheduledServiceType,
  getScheduledServiceTypes,
  getScheduledServiceType,
  importScheduledServiceTypes,
};
