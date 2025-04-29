import { db } from '../database/database';
import {
  CreateManyScheduledServiceInstanceInternal,
  UpdateScheduledServiceInstanceRequest,
} from '../types/scheduledServiceInstance';

const createScheduledServiceInstances = async (request: CreateManyScheduledServiceInstanceInternal[]) => {
  return await db.scheduledServiceInstance.createMany({ data: request });
};

const updateScheduledServiceInstance = async (
  id: string,
  vehicleId: string,
  userId: string,
  request: UpdateScheduledServiceInstanceRequest
) => {
  return await db.scheduledServiceInstance.update({
    where: { id, vehicleId, userId },
    data: request,
  });
};

const getVehicleScheduledServiceInstances = async (vehicleId: string) => {
  return await db.scheduledServiceInstance.findMany({ where: { vehicleId } });
};

const deleteScheduledServiceInstance = async (id: string, vehicleId: string, userId: string) => {
  return await db.scheduledServiceInstance.delete({ where: { id, vehicleId, userId } });
};

export default {
  createScheduledServiceInstances,
  updateScheduledServiceInstance,
  getVehicleScheduledServiceInstances,
  deleteScheduledServiceInstance,
};
