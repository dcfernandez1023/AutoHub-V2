import APIError from '../errors/APIError';
import { ImportSchema } from '../types/import';

import * as vehicleModel from '../models/vehicle';
import * as scheduledServiceTypeModel from '../models/scheduledServiceType';
[];
export const doImport = async (userId: string, buffer: Buffer) => {
  let jsonData;

  try {
    jsonData = JSON.parse(buffer.toString('utf-8'));
  } catch (error) {
    throw new APIError(`Invalid json: ${(error as Error)?.message}`, 400);
  }

  let parsedData;
  try {
    parsedData = ImportSchema.parse(jsonData);
  } catch (error) {
    throw new APIError(`Invalid JSON schema for import: ${(error as Error)?.message}`, 400);
  }

  const { vehicles, scheduledServiceTypes, scheduledServiceInstances, scheduledLogs, repairLogs } = parsedData;

  await vehicleModel.default.importVehicles(userId, vehicles);
  await scheduledServiceTypeModel.default.importScheduledServiceTypes(userId, scheduledServiceTypes);
};
