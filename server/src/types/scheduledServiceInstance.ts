import { z } from 'zod';

export const CreateOrUpdateManyScheduledServiceInstanceRequestSchema = z.object({
  vehicleId: z.string(),
  mileInterval: z.number(),
  timeInterval: z.number(),
  timeUnits: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
});

export const CreateOrUpdateManyScheduledServiceInstanceInternalSchema =
  CreateOrUpdateManyScheduledServiceInstanceRequestSchema.extend({
    userId: z.string(),
    scheduledServiceTypeId: z.string(),
  });

export type CreateOrUpdateManyScheduledServiceInstanceRequest = z.infer<
  typeof CreateOrUpdateManyScheduledServiceInstanceRequestSchema
>;
export type CreateOrUpdateManyScheduledServiceInstanceInternal = z.infer<
  typeof CreateOrUpdateManyScheduledServiceInstanceInternalSchema
>;
