import { db } from '../database/database';

const createAttachment = async (id: string, vehicleId: string, userId: string, url: string, filePath: string) => {
  return await db.vehicleAttachment.create({
    data: { id, vehicleId, userId, url, filePath },
  });
};

const getAttachments = async (vehicleId: string) => {
  return await db.vehicleAttachment.findMany({ where: { vehicleId } });
};

const getAttachment = async (attachmentId: string, vehicleId: string) => {
  return await db.vehicleAttachment.findFirst({ where: { id: attachmentId, vehicleId } });
};

const deleteAttachment = async (attachmentId: string, vehicleId: string) => {
  return await db.vehicleAttachment.delete({ where: { id: attachmentId, vehicleId } });
};

export default { createAttachment, getAttachments, getAttachment, deleteAttachment };
