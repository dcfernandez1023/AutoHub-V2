export type ScheduledLog = {
  id: string;
  userId: string;
  mileage: number;
  notes: string;
  vehicleId: string;
  scheduledServiceInstanceId: string;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  datePerformed: Date;
  nextServiceMileage: number;
  nextServiceDate: Date;
};

export type ScheduledLogRaw = {
  id: string;
  userId: string;
  mileage: number;
  notes: string;
  vehicleId: string;
  scheduledServiceInstanceId: string;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  datePerformed: string;
  nextServiceMileage: number;
  nextServiceDate: string;
};

export type CreateScheduledLogRequest = {
  mileage: number;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  notes: string;
  scheduledServiceInstanceId: string;
  datePerformed: number;
};

export type UpdateScheduledLogRequest = {
  mileage: number;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  notes: string;
  scheduledServiceInstanceId: string;
  datePerformed: number;
  id: string;
};

export type RepairLog = {
  id: string;
  userId: string;
  mileage: number;
  name: string;
  notes: string;
  vehicleId: string;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  datePerformed: Date;
};

export type RepairLogRaw = {
  id: string;
  userId: string;
  mileage: number;
  name: string;
  notes: string;
  vehicleId: string;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  datePerformed: string;
};

export type CreateRepairLogRequest = {
  mileage: number;
  name: string;
  notes: string;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  datePerformed: number;
};

export type UpdateRepairLogRequest = {
  mileage: number;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  notes: string;
  datePerformed: number;
  name: string;
  id: string;
};
