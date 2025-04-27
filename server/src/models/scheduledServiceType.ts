import { db } from '../database/database';

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

export default {
  createScheduledServiceType,
  updateScheduledServiceType,
  deleteScheduledServiceType,
  getScheduledServiceTypes,
};
