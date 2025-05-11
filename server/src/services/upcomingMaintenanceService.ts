import APIError from '../errors/APIError';
import * as scheduledLogModel from '../models/scheduledLog';
import {
  NextScheduledServiceMetadataDtoSchema,
  UpcomingMaintenanceDto,
  UpcomingMaintenanceDtoSchema,
} from '../types/upcomingMaintenance';
import { calculateNextServiceMileageAndDate } from './scheduledLogService';

export const findUpcomingMaintenance = async (userId: string, vehicleId?: string) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }

  const logData = vehicleId
    ? await scheduledLogModel.default.getMostRecentScheduledLogsByVehicleId(userId, vehicleId)
    : await scheduledLogModel.default.getMostRecentScheduledLogs(userId);

  return transformToUpcomingMaintenanceDto(userId, logData);
};

const transformToUpcomingMaintenanceDto = (userId: string, logData: any[]): UpcomingMaintenanceDto[] => {
  return logData.map((d) => {
    const nextScheduledServiceMetadata = NextScheduledServiceMetadataDtoSchema.parse({
      datePerformed: d.scheduledLogLastDatePerformed,
      mileagePerformed: d.scheduledLogLastMileagePerformed,
      mileInterval: d.mileInterval,
      timeInterval: d.timeInterval,
      timeUnits: d.timeUnits,
    });

    const { nextServiceMileage, nextServiceDate } = calculateNextServiceMileageAndDate(
      nextScheduledServiceMetadata.datePerformed,
      nextScheduledServiceMetadata.mileagePerformed,
      nextScheduledServiceMetadata.mileInterval,
      nextScheduledServiceMetadata.timeInterval,
      nextScheduledServiceMetadata.timeUnits
    );

    const upcomingMaintenanceDto = UpcomingMaintenanceDtoSchema.parse({
      userId,
      lastScheduledLogId: d.scheduledLogId,
      vehicleId: d.vehicleId,
      vehicleName: d.vehicleName,
      vehicleMake: d.vehicleMake,
      vehicleModel: d.vehicleModel,
      vehicleYear: d.vehicleYear,
      vehicleMileage: d.vehicleMileage,
      scheduledServiceTypeId: d.scheduledServiceTypeId,
      scheduledServiceTypeName: d.scheduledServiceTypeName,
      scheduledServiceInstanceTimeInterval: d.timeInterval,
      scheduledServiceInstanceTimeUnits: d.timeUnits,
      scheduledServiceInstanceMileInterval: d.mileInterval,
      scheduledLogLastDatePerformed: d.scheduledLogLastDatePerformed,
      scheduledLogLastMileagePerformed: d.scheduledLogLastMileagePerformed,
      mileageDue: nextServiceMileage,
      dateDue: nextServiceDate,
      isOverdue: false,
    });

    const now = new Date();
    const isDateOverdue = nextServiceDate < now;
    const isMileageOverdue = nextServiceMileage < upcomingMaintenanceDto.vehicleMileage;

    if (isDateOverdue || isMileageOverdue) {
      upcomingMaintenanceDto.isOverdue = true;

      if (isDateOverdue && isMileageOverdue) {
        upcomingMaintenanceDto.overdueReason = 'OVERDUE';
      } else if (isDateOverdue) {
        upcomingMaintenanceDto.overdueReason = 'DATE_OVERDUE';
      } else if (isMileageOverdue) {
        upcomingMaintenanceDto.overdueReason = 'MILEAGE_OVERDUE';
      }
    }

    return upcomingMaintenanceDto;
  });
};
