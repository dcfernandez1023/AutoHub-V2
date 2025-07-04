import APIError from '../errors/APIError';
import {
  CreateManyScheduledServiceInstanceInternal,
  CreateScheduledServiceInstanceRequest,
  ScheduledServiceInstanceRequestArraySchema,
  UpdateScheduledServiceInstanceRequest,
  UpdateScheduledServiceInstanceRequestSchema,
} from '../types/scheduledServiceInstance';
import * as scheduledServiceTypeModel from '../models/scheduledServiceType';
import * as scheduledServiceInstanceModel from '../models/scheduledServiceInstance';
import { checkIfCanAccessVehicle } from './vehicleService';
import { createVehicleChangelog } from './vehicleChangelogService';
import { ACTION, SUBJECT } from '../types/changelog';

export const createScheduledServiceInstances = async (
  vehicleId: string,
  userId: string,
  request: CreateScheduledServiceInstanceRequest[]
) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }
  const parsedRequestArray = ScheduledServiceInstanceRequestArraySchema.parse(request);

  // Ensure there's no duplicate scheduled service types in the request
  const uniqueScheduledServiceTypeIds = new Set();
  for (const requestObj of parsedRequestArray) {
    const { scheduledServiceTypeId } = requestObj;
    if (uniqueScheduledServiceTypeIds.has(scheduledServiceTypeId)) {
      throw new APIError(
        `Cannot apply the same scheduled service type ${scheduledServiceTypeId} to a vehicle more than once`,
        400
      );
    }
    uniqueScheduledServiceTypeIds.add(scheduledServiceTypeId);
  }

  // Only the owner of the vehicle can create a scheduled service instance for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId, true);

  const internalRequestArray: CreateManyScheduledServiceInstanceInternal[] = [];
  const scheduledServiceTypeNames: string[] = [];

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

    scheduledServiceTypeNames.push(scheduledServiceType.name);
  }

  const test = await scheduledServiceInstanceModel.default.createScheduledServiceInstances(internalRequestArray);

  const changelogSubjectName = scheduledServiceTypeNames.join(',');
  await createVehicleChangelog(vehicle, userId, {
    action: ACTION.APPLIED,
    subject: SUBJECT.SCHEDULED_SERVICE_TYPE,
    subjectName: changelogSubjectName,
    targetName: `${SUBJECT.VEHICLE} ${vehicle.name}`,
  });

  return internalRequestArray;
};

export const findVehicleScheduledServiceInstances = async (vehicleId: string, userId: string) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }

  // Shared users of the vehicle can query scheduled service instances for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  const scheduledServiceInstances = await scheduledServiceInstanceModel.default.getVehicleScheduledServiceInstances(
    vehicle.id
  );

  return scheduledServiceInstances;
};

export const updateScheduledServiceInstance = async (
  id: string,
  vehicleId: string,
  userId: string,
  request: UpdateScheduledServiceInstanceRequest
) => {
  if (!id) {
    throw new APIError('No scheduled service instance id provided', 400);
  }
  if (!vehicleId) {
    throw new APIError('No vehicle id provided', 400);
  }
  if (!userId) {
    throw new APIError('No user id provided', 400);
  }

  const parsedRequest = UpdateScheduledServiceInstanceRequestSchema.parse(request);

  // Only the owner of the vehicle can update scheduled service instances for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId, true);

  const scheduledServiceInstance = await scheduledServiceInstanceModel.default.updateScheduledServiceInstance(
    id,
    vehicle.id,
    userId,
    parsedRequest
  );

  return scheduledServiceInstance;
};

export const removeScheduledServiceInstance = async (id: string, vehicleId: string, userId: string) => {
  if (!id) {
    throw new APIError('No scheduled service instance id provided', 400);
  }
  if (!vehicleId) {
    throw new APIError('No vehicle id provided', 400);
  }
  if (!userId) {
    throw new APIError('No user id provided', 400);
  }

  // Only the owner of the vehicle can delete a scheduled service instance for the vehicle
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId, true);

  const scheduledServiceInstance = await scheduledServiceInstanceModel.default.deleteScheduledServiceInstance(
    id,
    vehicle.id,
    userId
  );

  return scheduledServiceInstance;
};
