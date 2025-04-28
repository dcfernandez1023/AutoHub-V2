import { db } from '../database/database';
import { CreateOrUpdateManyScheduledServiceInstanceInternal } from '../types/scheduledServiceInstance';

const createScheduledServiceInstances = async (request: CreateOrUpdateManyScheduledServiceInstanceInternal[]) => {
  return await db.scheduledServiceInstance.createMany({ data: request });
};

export default { createScheduledServiceInstances };
