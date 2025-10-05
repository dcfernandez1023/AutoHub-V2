export type Costs = {
  partsCost: number;
  laborCost: number;
  totalCost: number;
};

export type VehicleCosts = {
  repairLogCosts: Costs;
  scheduledLogCosts: Costs;
};

export type ScheduledLogUsage = {
  scheduledServiceInstanceId: string;
  count: number;
  name: string;
};
