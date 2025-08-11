import { z } from 'zod';

// Base log schema
const LogBase = z.object({
  mileage: z.number(),
  partsCost: z.number(),
  laborCost: z.number(),
  totalCost: z.number(),
  notes: z.string(),
});

// Repair log schemas
export const CreateRepairLogRequestSchema = LogBase.extend({
  datePerformed: z.number(),
  name: z.string(),
});

export const CreateRepairLogRequestSchemaInternal = LogBase.extend({
  datePerformed: z.date(),
  name: z.string(),
});

export const UpdateRepairLogRequestSchema = LogBase.extend({
  id: z.string(),
  datePerformed: z.number(),
  name: z.string(),
});

export const UpdateRepairLogRequestSchemaInternal = LogBase.extend({
  id: z.string(),
  datePerformed: z.date(),
  name: z.string(),
});

export const UpdateRepairLogRequestSchemaArray = z.array(UpdateRepairLogRequestSchema);

export const UpdateRepairLogRequestSchemaInternalArray = z.array(UpdateRepairLogRequestSchemaInternal);

// Scheduled log schemas
const ScheduledLogBase = LogBase.extend({
  scheduledServiceInstanceId: z.string(),
});

export const CreateScheduledLogRequestSchema = ScheduledLogBase.extend({
  datePerformed: z.number(),
});

export const CreateScheduledLogRequestSchemaInternal = ScheduledLogBase.extend({
  datePerformed: z.date(),
});

export const UpdateScheduledLogRequestSchema = ScheduledLogBase.extend({
  datePerformed: z.number(),
  id: z.string(),
  scheduledServiceInstanceId: z.string(),
});

export const UpdateScheduledLogRequestSchemaInternal = ScheduledLogBase.extend({
  datePerformed: z.date(),
  id: z.string(),
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

// Repair log types
export type CreateRepairLogRequest = z.infer<typeof CreateRepairLogRequestSchema>;
export type CreateRepairLogRequestInternal = z.infer<typeof CreateRepairLogRequestSchemaInternal>;
export type UpdateRepairLogRequest = z.infer<typeof UpdateRepairLogRequestSchema>;
export type UpdateRepairLogRequestInternal = z.infer<typeof UpdateRepairLogRequestSchemaInternal>;

// Scheduled log types
export type CreateScheduledLogRequest = z.infer<typeof CreateScheduledLogRequestSchema>;
export type CreateScheduledLogRequestInternal = z.infer<typeof CreateScheduledLogRequestSchemaInternal>;
export type UpdateScheduledLogRequest = z.infer<typeof UpdateScheduledLogRequestSchema>;
export type UpdateScheduledLogRequestInternal = z.infer<typeof UpdateScheduledLogRequestSchemaInternal>;
export type ScheduledLogDto = z.infer<typeof ScheduledLogDtoSchema>;
