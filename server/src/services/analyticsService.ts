import repairLog from '../models/repairLog';
import scheduledLog from '../models/scheduledLog';
import { checkIfCanAccessVehicle } from './vehicleService';

export const aggregateVehicleCosts = async (userId: string, vehicleId: string) => {
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

  const repairLogCost = await repairLog.getVehicleRepairCost(vehicle.userId, vehicle.id);
  const scheduledLogCost = await scheduledLog.getVehicleScheduledLogCost(vehicle.userId, vehicle.id);

  return {
    repairLogCosts: {
      partsCost: safeNum(repairLogCost.partsCost),
      laborCost: safeNum(repairLogCost.laborCost),
      totalCost: safeNum(repairLogCost.totalCost),
    },
    scheduledLogCosts: {
      partsCost: safeNum(scheduledLogCost.partsCost),
      laborCost: safeNum(scheduledLogCost.laborCost),
      totalCost: safeNum(scheduledLogCost.totalCost),
    },
  };
};

export const aggregateScheduledLogUsage = async (userId: string, vehicleId: string) => {
  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);
  const usage = await scheduledLog.getScheduledServiceTypeUsageFromLogs(vehicle.userId, vehicle.id);

  return usage;
};

const safeNum = (n: any): number => {
  return isFinite(n) ? (n as number) : 0;
};
