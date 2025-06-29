import { User } from '@prisma/client';
import { db } from '../database/database';
import { hash } from 'bcryptjs';
import {
  RepairLogImportDto,
  ScheduledLogImportDto,
  ScheduledServiceInstanceImport,
  ScheduledServiceTypeImport,
  VehicleImport,
} from '../types/import';

const createUser = async (username: string, email: string, password: string, role: 'USER' | 'ADMIN'): Promise<User> => {
  const hashedPassword = await hash(password, 10);
  return await db.user.create({
    data: { username, email, password: hashedPassword, role },
  });
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  return await db.user.findUnique({ where: { email } });
};

const getUserById = async (id: string): Promise<User | null> => {
  return await db.user.findUnique({ where: { id } });
};

const getUserByEmailAndId = async (id: string, email: string): Promise<User | null> => {
  return await db.user.findUnique({ where: { id, email } });
};

const registerUser = async (userId: string, email: string) => {
  return await db.user.update({
    where: { id: userId, email },
    data: { registered: 1 },
  });
};

const deleteUser = async (userId: string) => {
  return await db.user.delete({ where: { id: userId } });
};

const importData = async (
  userId: string,
  vehicleImport: VehicleImport[],
  scheduledServiceTypeImport: ScheduledServiceTypeImport[],
  scheduledServiceInstanceImport: ScheduledServiceInstanceImport[],
  scheduledLogImport: ScheduledLogImportDto[],
  repairLogImport: RepairLogImportDto[]
) => {
  await db.$transaction([
    db.vehicle.createMany({ data: vehicleImport.map((record) => ({ userId, ...record })) }),
    db.scheduledServiceType.createMany({ data: scheduledServiceTypeImport.map((record) => ({ userId, ...record })) }),
    db.scheduledServiceInstance.createMany({
      data: scheduledServiceInstanceImport.map((record) => ({ userId, ...record })),
    }),
    db.scheduledLog.createMany({ data: scheduledLogImport.map((record) => ({ userId, ...record })) }),
    db.repairLog.createMany({ data: repairLogImport.map((record) => ({ userId, ...record })) }),
  ]);
};

const searchForUsersToShareVehicle = async (searchText: string, vehicleId: string) => {
  return await db.user.findMany({
    where: {
      username: {
        startsWith: searchText,
        mode: 'insensitive',
      },
      registered: {
        equals: 1,
      },
      VehicleShare: {
        none: {
          vehicleId: vehicleId,
        },
      },
    },
  });
};

export default {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByEmailAndId,
  registerUser,
  deleteUser,
  importData,
  searchForUsersToShareVehicle,
};
