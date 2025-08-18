import APIError from '../errors/APIError';
import {
  ImportSchema,
  RepairLogImportDtoSchema,
  ScheduledLogImportDtoSchema,
  VehicleImportSchema,
} from '../types/import';

import * as vehicleModel from '../models/vehicle';
import * as scheduledServiceTypeModel from '../models/scheduledServiceType';
import * as scheduledServiceInstanceModel from '../models/scheduledServiceInstance';
import scheduledLog, * as scheduledLogModel from '../models/scheduledLog';
import * as repairLogModel from '../models/repairLog';
import * as userModel from '../models/user';
import { formatVehicleResponse } from './vehicleService';

export const doImport = async (userId: string, buffer: Buffer) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }
  if (!buffer) {
    throw new APIError('No import json file provided', 400);
  }

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

  const vehicleImport = vehicles.map((vehicle) => {
    const vehicleDto = { ...vehicle, dateCreated: new Date(vehicle.dateCreated).getTime() };
    const vehicleDtoParsed = VehicleImportSchema.parse(vehicleDto);
    return vehicleDtoParsed;
  });
  const scheduledServiceTypeImport = scheduledServiceTypes;
  const scheduledServiceInstanceImport = scheduledServiceInstances;
  const scheduledLogImport = scheduledLogs.map((log) => {
    const logDto = { ...log, datePerformed: new Date(log.datePerformed) };
    const logDtoParsed = ScheduledLogImportDtoSchema.parse(logDto);
    return logDtoParsed;
  });
  const repairLogImport = repairLogs.map((log) => {
    const logDto = { ...log, datePerformed: new Date(log.datePerformed) };
    const logDtoParsed = RepairLogImportDtoSchema.parse(logDto);
    return logDtoParsed;
  });

  // All or none succeed
  await userModel.default.importData(
    userId,
    vehicleImport,
    scheduledServiceTypeImport,
    scheduledServiceInstanceImport,
    scheduledLogImport,
    repairLogImport
  );

  return {
    vehicleCount: vehicles.length,
    scheduledServiceTypeCount: scheduledServiceTypes.length,
    scheduledServiceInstanceCount: scheduledServiceInstances.length,
    scheduledLogCount: scheduledLogs.length,
    repairLogCount: repairLogs.length,
  };
};

export const doExport = async (userId: string): Promise<string> => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const vehicles = (await vehicleModel.default.getVehicles(userId)).map((vehicle) => formatVehicleResponse(vehicle));
  const scheduledServiceTypes = await scheduledServiceTypeModel.default.getScheduledServiceTypes(userId);
  const scheduledServiceInstances = await scheduledServiceInstanceModel.default.getScheduledServiceInstances(userId);
  const scheduledLogs = await scheduledLogModel.default.getScheduledLogs(userId);
  const repairLogs = await repairLogModel.default.getRepairLogs(userId);

  return JSON.stringify(
    {
      vehicles,
      scheduledServiceTypes,
      scheduledServiceInstances,
      scheduledLogs,
      repairLogs,
    },
    null,
    2
  );
};
