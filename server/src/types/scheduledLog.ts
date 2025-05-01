import { z } from 'zod';

const ScheduledLogBase = z.object({
  scheduledServiceInstanceId: z.string(),
  mileage: z.number(),
  partsCost: z.number(),
  laborCost: z.number(),
  totalCost: z.number(),
  notes: z.string(),
});

export const CreateScheduledLogRequestSchema = ScheduledLogBase.extend({
  datePerformed: z.number(),
});

export const CreateScheduledLogRequestSchemaInternal = ScheduledLogBase.extend({
  datePerformed: z.date(),
});

export const UpdateScheduledLogRequestSchema = ScheduledLogBase.extend({
  datePerformed: z.number(),
  scheduledServiceInstanceId: z.string(),
});

export const UpdateScheduledLogRequestSchemaInternal = ScheduledLogBase.extend({
  datePerformed: z.date(),
  scheduledServiceInstanceId: z.string(),
});

export const UpdateScheduledLogRequestSchemaArray = z.array(UpdateScheduledLogRequestSchema);

export const UpdateScheduledLogRequestSchemaInternalArray = z.array(UpdateScheduledLogRequestSchemaInternal);

export const ScheduledLogDtoSchema = ScheduledLogBase.extend({
  id: z.string(),
  userId: z.string(),
  vehicleId: z.string(),
  datePerformed: z.date(),
  nextServiceMileage: z.number(),
  nextServiceDate: z.date(),
});

export type CreateScheduledLogRequest = z.infer<typeof CreateScheduledLogRequestSchema>;
export type CreateScheduledLogRequestInternal = z.infer<typeof CreateScheduledLogRequestSchemaInternal>;
export type UpdateScheduledLogRequest = z.infer<typeof UpdateScheduledLogRequestSchema>;
export type UpdateScheduledLogRequestSchemaInternal = z.infer<typeof UpdateScheduledLogRequestSchemaInternal>;
export type ScheduledLogDto = z.infer<typeof ScheduledLogDtoSchema>;
