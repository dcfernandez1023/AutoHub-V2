import { Prisma } from '@prisma/client';
import { db } from '../database/database';

const createAttachment = async (vehicleId: string, userId: string, file: File, path: string, size: number) => {
  const arrayBuf = await file.arrayBuffer();
  const contents = Buffer.from(arrayBuf);

  return await db.$transaction(
    async (tx) => {
      const vehicleAttachment = await tx.vehicleAttachment.create({
        data: { vehicleId, userId, filename: file.name, path, contentType: file.type, size },
      });

      const vehicleAttachmentFile = await tx.vehicleAttachmentFile.create({
        data: { attachmentId: vehicleAttachment.id, contents },
      });

      return { vehicleAttachment, vehicleAttachmentFile };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted }
  );
};

const getAttachments = async (vehicleId: string, orderByDate: 'asc' | 'desc' = 'desc') => {
  return await db.vehicleAttachment.findMany({ where: { vehicleId }, orderBy: { dateCreated: orderByDate } });
};

const getAttachmentsByUser = async (userId: string, orderByDate: 'asc' | 'desc' = 'desc') => {
  return await db.vehicleAttachment.findMany({ where: { userId }, orderBy: { dateCreated: orderByDate } });
};

const getAttachment = async (attachmentId: string, vehicleId: string) => {
  return await db.vehicleAttachment.findFirst({
    where: { id: attachmentId, vehicleId },
  });
};

const getAttachmentWithFile = async (attachmentId: string, vehicleId: string) => {
  return await db.vehicleAttachment.findFirst({
    where: { id: attachmentId, vehicleId },
    select: {
      id: true,
      vehicleId: true,
      userId: true,
      filename: true,
      path: true,
      contentType: true,
      size: true,
      dateCreated: true,
      file: { select: { contents: true } },
    },
  });
};

const deleteAttachment = async (attachmentId: string, vehicleId: string) => {
  return await db.vehicleAttachment.delete({ where: { id: attachmentId, vehicleId } });
};

export default {
  createAttachment,
  getAttachments,
  getAttachment,
  deleteAttachment,
  getAttachmentsByUser,
  getAttachmentWithFile,
};
