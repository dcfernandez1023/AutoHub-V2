import { db } from '../database/database';

const createAttachment = async (
  vehicleId: string,
  userId: string,
  filename: string,
  path: string,
  contentType: string,
  size: number
) => {
  return await db.vehicleAttachment.create({
    data: { vehicleId, userId, filename, path, contentType, size },
  });
};

const getAttachments = async (vehicleId: string, orderByDate: 'asc' | 'desc' = 'desc') => {
  return await db.vehicleAttachment.findMany({ where: { vehicleId }, orderBy: { dateCreated: orderByDate } });
};

const getAttachmentsByUser = async (userId: string, orderByDate: 'asc' | 'desc' = 'desc') => {
  return await db.vehicleAttachment.findMany({ where: { userId }, orderBy: { dateCreated: orderByDate } });
};

const getAttachment = async (attachmentId: string, vehicleId: string) => {
  return await db.vehicleAttachment.findFirst({ where: { id: attachmentId, vehicleId } });
};

const deleteAttachment = async (attachmentId: string, vehicleId: string) => {
  return await db.vehicleAttachment.delete({ where: { id: attachmentId, vehicleId } });
};

export default { createAttachment, getAttachments, getAttachment, deleteAttachment, getAttachmentsByUser };
