import { z } from 'zod';

export const VehicleImportSchema = z.object({
  id: z.string(),
  name: z.string(),
  mileage: z.number(),
  year: z.number(),
  make: z.string(),
  model: z.string(),
  licensePlate: z.string(),
  vin: z.string(),
  notes: z.string(),
  dateCreated: z.number(),
  base64Image: z.string().optional(),
});
export type VehicleImport = z.infer<typeof VehicleImportSchema>;

export const ScheduledServiceTypeImportSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type ScheduledServiceTypeImport = z.infer<typeof ScheduledServiceTypeImportSchema>;

export const ScheduledServiceInstanceImportSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  scheduledServiceTypeId: z.string(),
  mileInterval: z.number(),
  timeInterval: z.number(),
  timeUnits: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
});
export type ScheduledServiceInstanceImport = z.infer<typeof ScheduledServiceInstanceImportSchema>;

export const ScheduledLogImportSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  scheduledServiceInstanceId: z.string(),
  datePerformed: z.number(),
  mileage: z.number(),
  partsCost: z.number(),
  laborCost: z.number(),
  totalCost: z.number(),
  notes: z.string(),
});
export const ScheduledLogImportDtoSchema = ScheduledLogImportSchema.extend({
  datePerformed: z.date(),
});
export type ScheduledLogImport = z.infer<typeof ScheduledLogImportSchema>;
export type ScheduledLogImportDto = z.infer<typeof ScheduledLogImportDtoSchema>;

export const RepairLogImportSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  datePerformed: z.number(),
  mileage: z.number(),
  partsCost: z.number(),
  laborCost: z.number(),
  totalCost: z.number(),
  notes: z.string(),
});
export const RepairLogImportDtoSchema = RepairLogImportSchema.extend({
  datePerformed: z.date(),
});
export type RepairLogImport = z.infer<typeof RepairLogImportSchema>;
export type RepairLogImportDto = z.infer<typeof RepairLogImportDtoSchema>;

export const ImportSchema = z.object({
  vehicles: z.array(VehicleImportSchema),
  scheduledServiceTypes: z.array(ScheduledServiceTypeImportSchema),
  scheduledServiceInstances: z.array(ScheduledServiceInstanceImportSchema),
  scheduledLogs: z.array(ScheduledLogImportSchema),
  repairLogs: z.array(RepairLogImportSchema),
});
