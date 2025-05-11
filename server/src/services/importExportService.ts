import APIError from '../errors/APIError';
import { ImportSchema, RepairLogImportDtoSchema } from '../types/import';

import * as vehicleModel from '../models/vehicle';
import * as scheduledServiceTypeModel from '../models/scheduledServiceType';
import * as scheduledServiceInstanceModel from '../models/scheduledServiceInstance';
import * as scheduledLogModel from '../models/scheduledLog';
import * as repairLogModel from '../models/repairLog';
import { ScheduledLogDtoSchema } from '../types/log';

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
  await scheduledServiceInstanceModel.default.importScheduledServiceInstances(userId, scheduledServiceInstances);
  await scheduledLogModel.default.importScheduledLogs(
    userId,
    scheduledLogs.map((log) => {
      const logDto = { ...log, datePerformed: new Date(log.datePerformed) };
      const logDtoParsed = ScheduledLogDtoSchema.parse(logDto);
      return logDtoParsed;
    })
  );
  await repairLogModel.default.importRepairLogs(
    userId,
    repairLogs.map((log) => {
      const logDto = { ...log, datePerformed: new Date(log.datePerformed) };
      const logDtoParsed = RepairLogImportDtoSchema.parse(logDto);
      return logDtoParsed;
    })
  );
};

export const doExport = async (userId: string): Promise<string> => {
  const vehicles = await vehicleModel.default.getVehicles(userId);
  const scheduledServiceTypes = await scheduledServiceTypeModel.default.getScheduledServiceTypes(userId);
  const scheduledServiceInstances = await scheduledServiceInstanceModel.default.getScheduledServiceInstances(userId);
  const scheduledLogs = await scheduledLogModel.default.getScheduledLogs(userId);
  const repairLogs = await repairLogModel.default.getRepairLogs(userId);

  return JSON.stringify({
    vehicles,
    scheduledServiceTypes,
    scheduledServiceInstances,
    scheduledLogs,
    repairLogs,
  });
};
