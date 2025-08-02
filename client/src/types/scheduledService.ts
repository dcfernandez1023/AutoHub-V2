export type ScheduledServiceType = {
  id: string;
  userId: string;
  name: string;
};

export type ScheduledServiceInstance = {
  id: string;
  userId: string;
  vehicleId: string;
  scheduledServiceTypeId: string;
  mileInterval: number;
  timeInterval: number;
  timeUnits: string;
};

export type CreateScheduledServiceInstanceRequest = {
  scheduledServiceTypeId: string;
  mileInterval: number;
  timeInterval: number;
  timeUnits: string;
};
