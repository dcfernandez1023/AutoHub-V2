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

export type CreateOrUpdateVehicle =
  | Omit<Vehicle, 'id'>
  | Omit<Vehicle, 'userId'>;

export type VehicleShare = {
  userId: string;
  vehicleId: string;
  id: string;
};

export type UserSharedWithVehicle = VehicleShare & {
  user: User;
};
