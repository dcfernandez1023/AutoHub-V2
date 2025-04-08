import { db } from '../database/database';

const createAttachment = async (id: string, vehicleId: string, userId: string, url: string) => {
  return await db.vehicleAttachment.create({
    data: { id, vehicleId, userId, url },
  });
};

const getAttachments = async (vehicleId: string, userId: string) => {
  return await db.vehicleAttachment.findMany({ where: { vehicleId, userId } });
};

export default { createAttachment, getAttachments };
