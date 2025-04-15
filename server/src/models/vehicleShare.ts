import { db } from '../database/database';

const shareVehicle = async (vehicleId: string, userId: string) => {
  return await db.vehicleShare.create({
    data: { vehicleId, userId },
  });
};

const getVehicleShare = async (vehicleId: string, userId: string) => {
  return await db.vehicleShare.findFirst({
    where: { vehicleId, userId },
  });
};

const deleteVehicleShare = async (vehicleId: string, userId: string) => {
  return await db.vehicleShare.deleteMany({
    where: { vehicleId, userId },
  });
};

const deleteVehicleShares = async (vehicleId: string) => {
  return await db.vehicleShare.deleteMany({
    where: { vehicleId },
  });
};

export default { shareVehicle, getVehicleShare, deleteVehicleShare, deleteVehicleShares };
