import { z } from 'zod';

export const CreateOrUpdateVehicleRequestSchema = z.object({
  name: z.string(),
  mileage: z.number(),
  year: z.number(),
  make: z.string(),
  model: z.string(),
  licensePlate: z.string(),
  vin: z.string(),
  notes: z.string(),
  base64Image: z.string().optional(),
});

export const CreateOrUpdateVehicleRequestInternalSchema = CreateOrUpdateVehicleRequestSchema.extend({
  dateCreated: z.number(),
});

export const ShareVehicleRequestSchema = z.object({
  userId: z.string(),
});

export type CreateOrUpdateVehicleRequest = z.infer<typeof CreateOrUpdateVehicleRequestSchema>;
export type CreateOrUpdateVehicleRequestInternal = z.infer<typeof CreateOrUpdateVehicleRequestInternalSchema>;
export type ShareVehicleRequest = z.infer<typeof ShareVehicleRequestSchema>;
