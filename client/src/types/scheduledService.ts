export type ScheduledServiceType = {
  id: string;
  userId: string;
  name: string;
  hasScheduledServiceInstances?: boolean;
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
