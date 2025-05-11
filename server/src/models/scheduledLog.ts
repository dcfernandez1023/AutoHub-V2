import { Prisma, ScheduledLog } from '@prisma/client';
import { db } from '../database/database';
import { CreateScheduledLogRequestInternal, UpdateScheduledLogRequestInternal } from '../types/log';

const createScheduledLog = async (vehicleId: string, userId: string, request: CreateScheduledLogRequestInternal) => {
  return await db.scheduledLog.create({ data: { vehicleId, userId, ...request } });
};

const updateScheduledLogs = async (vehicleId: string, request: UpdateScheduledLogRequestInternal[]) => {
  const updates: Prisma.PrismaPromise<any>[] = request.map((record) =>
    db.scheduledLog.update({
      where: {
        id: record.id,
        vehicleId,
      },
      data: record,
    })
  );

  return await db.$transaction(updates);
};

const getVehicleScheduledLogs = async (vehicleId: string) => {
  return await db.scheduledLog.findMany({ where: { vehicleId }, include: { scheduledServiceInstance: true } });
};

const deleteScheduledLog = async (id: string, vehicleId: string) => {
  return await db.scheduledLog.delete({ where: { id, vehicleId } });
};

const getMostRecentScheduledLogs = async (userId: string): Promise<unknown[]> => {
  const latestLogs = await db.$queryRaw`
    SELECT
      sl."id" as "scheduledLogId",
      v."id" as "vehicleId",
      v."name" as "vehicleName",
      v."make" as "vehicleMake",
      v."model" as "vehicleModel",
      v."year" as "vehicleYear",
      v."mileage" as "vehicleMileage",
      sst."id" as "scheduledServiceTypeId",
      sst."name" as "scheduledServiceTypeName",
      ssi."timeInterval" as "timeInterval",
      ssi."timeUnits" as "timeUnits",
      ssi."mileInterval" as "mileInterval",
      sl."datePerformed" as "scheduledLogLastDatePerformed",
      sl."mileage" as "scheduledLogLastMileagePerformed"
    FROM "ScheduledLog" sl
    INNER JOIN (
      SELECT "scheduledServiceInstanceId", MAX("datePerformed") AS max_date
      FROM "ScheduledLog"
      WHERE "userId" = ${userId}
      GROUP BY "scheduledServiceInstanceId"
    ) latest
      ON sl."scheduledServiceInstanceId" = latest."scheduledServiceInstanceId"
      AND sl."datePerformed" = latest.max_date
    INNER JOIN "Vehicle" v
      ON sl."vehicleId" = v."id"
    INNER JOIN "ScheduledServiceInstance" ssi
      ON sl."scheduledServiceInstanceId" = ssi."id"
    INNER JOIN "ScheduledServiceType" sst
      ON ssi."scheduledServiceTypeId" = sst."id"
    WHERE sl."userId" = ${userId};
  `;

  // TODO: Better typing for this
  return latestLogs as unknown[];
};

const getMostRecentScheduledLogsByVehicleId = async (userId: string, vehicleId: string): Promise<unknown[]> => {
  const latestLogs = await db.$queryRaw`
    SELECT
      sl."id" as "scheduledLogId",
      v."id" as "vehicleId",
      v."name" as "vehicleName",
      v."make" as "vehicleMake",
      v."model" as "vehicleModel",
      v."year" as "vehicleYear",
      v."mileage" as "vehicleMileage",
      sst."id" as "scheduledServiceTypeId",
      sst."name" as "scheduledServiceTypeName",
      ssi."timeInterval" as "timeInterval",
      ssi."timeUnits" as "timeUnits",
      ssi."mileInterval" as "mileInterval",
      sl."datePerformed" as "scheduledLogLastDatePerformed",
      sl."mileage" as "scheduledLogLastMileagePerformed"
    FROM "ScheduledLog" sl
    INNER JOIN (
      SELECT "scheduledServiceInstanceId", MAX("datePerformed") AS max_date
      FROM "ScheduledLog"
      WHERE "userId" = ${userId} AND "vehicleId" = ${vehicleId}
      GROUP BY "scheduledServiceInstanceId"
    ) latest
      ON sl."scheduledServiceInstanceId" = latest."scheduledServiceInstanceId"
      AND sl."datePerformed" = latest.max_date
    INNER JOIN "Vehicle" v
      ON sl."vehicleId" = v."id"
    INNER JOIN "ScheduledServiceInstance" ssi
      ON sl."scheduledServiceInstanceId" = ssi."id"
    INNER JOIN "ScheduledServiceType" sst
      ON ssi."scheduledServiceTypeId" = sst."id"
    WHERE sl."userId" = ${userId};
  `;

  // TODO: Better typing for this
  return latestLogs as unknown[];
};

export default {
  createScheduledLog,
  updateScheduledLogs,
  getVehicleScheduledLogs,
  deleteScheduledLog,
  getMostRecentScheduledLogs,
  getMostRecentScheduledLogsByVehicleId,
};
