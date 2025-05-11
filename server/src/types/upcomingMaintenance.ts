import { z } from 'zod';

export const UpcomingMaintenanceDtoSchema = z.object({
  userId: z.string(),
  lastScheduledLogId: z.string(),
  vehicleId: z.string(),
  vehicleName: z.string(),
  vehicleMake: z.string(),
  vehicleModel: z.string(),
  vehicleYear: z.number(),
  vehicleMileage: z.number(),
  scheduledServiceTypeId: z.string(),
  scheduledServiceTypeName: z.string(),
  scheduledServiceInstanceTimeInterval: z.number(),
  scheduledServiceInstanceTimeUnits: z.string(),
  scheduledServiceInstanceMileInterval: z.number(),
  scheduledLogLastDatePerformed: z.date(),
  scheduledLogLastMileagePerformed: z.number(),
  mileageDue: z.number(),
  dateDue: z.date(),
  isOverdue: z.boolean(),
  overdueReason: z.enum(['MILEAGE_OVERDUE', 'DATE_OVERDUE', 'OVERDUE']).optional(),
});

export const NextScheduledServiceMetadataDtoSchema = z.object({
  datePerformed: z.date(),
  mileagePerformed: z.number(),
  mileInterval: z.number(),
  timeInterval: z.number(),
  timeUnits: z.string(),
});

export type UpcomingMaintenanceDto = z.infer<typeof UpcomingMaintenanceDtoSchema>;
export type NextScheduledServiceMetadataDto = z.infer<typeof NextScheduledServiceMetadataDtoSchema>;
