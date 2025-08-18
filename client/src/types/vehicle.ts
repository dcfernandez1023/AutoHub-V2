import { User } from './user';

export type Vehicle = {
  id: string;
  userId: string;
  name: string;
  mileage: number;
  year: number;
  make: string;
  model: string;
  licensePlate: string;
  vin: string;
  notes: string;
  dateCreated: number;
  base64Image: string | null;
};

export type CreateOrUpdateVehicle = Omit<Vehicle, 'id' | 'userId'>;

export type VehicleShare = {
  userId: string;
  vehicleId: string;
  id: string;
};

export type UserSharedWithVehicle = VehicleShare & {
  user: User;
};

export type CreateAttachmentResponse = {
  attachmentId: string;
  attachmentUrl: string;
};

export type VehicleAttachmentRaw = {
  path: string;
  size: number;
  id: string;
  vehicleId: string;
  userId: string;
  filename: string;
  contentType: string;
  dateCreated: string;
};

export type VehicleAttachment = {
  path: string;
  size: number;
  id: string;
  vehicleId: string;
  userId: string;
  filename: string;
  contentType: string;
  dateCreated: Date;
};
