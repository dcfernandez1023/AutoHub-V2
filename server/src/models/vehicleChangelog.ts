import { db } from '../database/database';

const createVehicleChangelog = async (vehicleId: string, userId: string, description: string) => {
  return await db.vehicleChangelog.create({
    data: { vehicleId, userId, description },
  });
};

const getVehicleChangelog = async (vehicleId: string) => {
  return await db.vehicleChangelog.findMany({ where: { vehicleId } });
};

export default { createVehicleChangelog, getVehicleChangelog };
