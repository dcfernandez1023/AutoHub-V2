import { Vehicle } from '@prisma/client';
import { db } from '../database/database';
import { CreateOrUpdateVehicleRequest } from '../types/vehicle';

const createVehicle = async (userId: string, request: CreateOrUpdateVehicleRequest) => {
  return await db.vehicle.create({
    data: { userId, ...request },
  });
};

const updateVehicle = async (id: string, userId: string, request: CreateOrUpdateVehicleRequest) => {
  return db.vehicle.update({
    where: { id, userId },
    data: request,
  });
};

const getVehicles = async (userId: string) => {
  return db.vehicle.findMany({ where: { userId } });
};

const getVehicle = async (id: string, userId: string) => {
  return db.vehicle.findFirst({ where: { id, userId } });
};

const getVehicleById = async (id: string) => {
  return db.vehicle.findFirst({ where: { id } });
};

const deleteVehicle = async (id: string, userId: string) => {
  return db.vehicle.delete({ where: { id, userId } });
};

const getSharedVehicles = async (userId: string) => {
  const sharedVehicles = await db.vehicleShare.findMany({
    where: { userId },
    include: {
      vehicle: true, // pull the actual vehicle
    },
  });

  return sharedVehicles.map((share) => share.vehicle);
};

export default {
  createVehicle,
  updateVehicle,
  getVehicles,
  getVehicle,
  getVehicleById,
  deleteVehicle,
  getSharedVehicles,
};
