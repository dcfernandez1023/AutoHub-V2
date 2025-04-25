import { db } from '../database/database';

const createVehicleChangelog = async (vehicleId: string, userId: string, description: string) => {
  return await db.vehicleChangelog.create({
    data: { vehicleId, userId, description },
  });
};

export default { createVehicleChangelog };
