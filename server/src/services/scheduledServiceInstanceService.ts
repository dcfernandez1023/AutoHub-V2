import APIError from '../errors/APIError';
import {
  CreateManyScheduledServiceInstanceInternal,
  ScheduledServiceInstanceRequest,
  ScheduledServiceInstanceRequestArraySchema,
} from '../types/scheduledServiceInstance';
import * as scheduledServiceTypeModel from '../models/scheduledServiceType';
import * as scheduledServiceInstanceModel from '../models/scheduledServiceInstance';
import { checkIfCanAccessVehicle } from './vehicleService';

export const createScheduledServiceInstances = async (
  vehicleId: string,
  userId: string,
  request: ScheduledServiceInstanceRequest[]
) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  const parsedRequestArray = ScheduledServiceInstanceRequestArraySchema.parse(request);

  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId, true);

  const internalRequestArray: CreateManyScheduledServiceInstanceInternal[] = [];

  // Ensure that all scheduled service types exist and can be accessed by the user
  for (const requestObj of parsedRequestArray) {
    const { scheduledServiceTypeId } = requestObj;
    const scheduledServiceType = await scheduledServiceTypeModel.default.getScheduledServiceType(
      scheduledServiceTypeId,
      userId
    );

    if (!scheduledServiceType) {
      throw new APIError(`No scheduled service type found: ${scheduledServiceTypeId}`, 404);
    }

    const internalObj = { userId, vehicleId: vehicle.id, ...requestObj };
    internalRequestArray.push(internalObj);
  }

  const scheduledServiceInstances =
    await scheduledServiceInstanceModel.default.createScheduledServiceInstances(internalRequestArray);

  return scheduledServiceInstances;
};
