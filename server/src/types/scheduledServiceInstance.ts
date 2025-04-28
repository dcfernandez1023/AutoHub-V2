import { z } from 'zod';

export const ScheduledServiceInstanceRequestSchema = z.object({
  scheduledServiceTypeId: z.string(),
  mileInterval: z.number(),
  timeInterval: z.number(),
  timeUnits: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
});

export const ScheduledServiceInstanceRequestArraySchema = z.array(ScheduledServiceInstanceRequestSchema);

export const CreateManyScheduledServiceInstanceInternalSchema = ScheduledServiceInstanceRequestSchema.extend({
  userId: z.string(),
  vehicleId: z.string(),
  scheduledServiceTypeId: z.string(),
});

export type CreateManyScheduledServiceInstanceInternal = z.infer<
  typeof CreateManyScheduledServiceInstanceInternalSchema
>;
export type ScheduledServiceInstanceRequest = z.infer<typeof ScheduledServiceInstanceRequestSchema>;
