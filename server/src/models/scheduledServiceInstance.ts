import { db } from '../database/database';
import { ScheduledServiceInstanceImport } from '../types/import';
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

const getScheduledServiceInstances = async (userId: string) => {
  return await db.scheduledServiceInstance.findMany({ where: { userId } });
};

const getVehicleScheduledServiceInstances = async (vehicleId: string) => {
  return await db.scheduledServiceInstance.findMany({ where: { vehicleId } });
};

const deleteScheduledServiceInstance = async (id: string, vehicleId: string, userId: string) => {
  return await db.scheduledServiceInstance.delete({ where: { id, vehicleId, userId } });
};

const importScheduledServiceInstances = async (userId: string, recordImport: ScheduledServiceInstanceImport[]) => {
  return await db.scheduledServiceInstance.createMany({ data: recordImport.map((record) => ({ userId, ...record })) });
};

export default {
  createScheduledServiceInstances,
  updateScheduledServiceInstance,
  getScheduledServiceInstances,
  getVehicleScheduledServiceInstances,
  deleteScheduledServiceInstance,
  importScheduledServiceInstances,
};
