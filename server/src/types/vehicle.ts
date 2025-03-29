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
  dateCreated: z.number(),
  sharedWith: z.string().optional(),
  base64Image: z.string().optional(),
});

export type CreateOrUpdateVehicleRequest = z.infer<typeof CreateOrUpdateVehicleRequestSchema>;
