import { z } from 'zod';

export const UpdateScheduledServiceInstanceRequestSchema = z.object({
  mileInterval: z.number(),
  timeInterval: z.number(),
  timeUnits: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
});

export const CreateScheduledServiceInstanceRequestSchema = z.object({
  scheduledServiceTypeId: z.string(),
  mileInterval: z.number(),
  timeInterval: z.number(),
  timeUnits: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
});

export const ScheduledServiceInstanceRequestArraySchema = z.array(CreateScheduledServiceInstanceRequestSchema);

export const CreateManyScheduledServiceInstanceInternalSchema = CreateScheduledServiceInstanceRequestSchema.extend({
  userId: z.string(),
  vehicleId: z.string(),
});

export type CreateManyScheduledServiceInstanceInternal = z.infer<
  typeof CreateManyScheduledServiceInstanceInternalSchema
>;
export type CreateScheduledServiceInstanceRequest = z.infer<typeof CreateScheduledServiceInstanceRequestSchema>;
export type UpdateScheduledServiceInstanceRequest = z.infer<typeof UpdateScheduledServiceInstanceRequestSchema>;
