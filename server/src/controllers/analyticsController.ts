import { Request, Response } from 'express';
import { aggregateScheduledLogUsage, aggregateVehicleCosts } from '../services/analyticsService';
import { handleError } from './utils';

export const getVehicleCost = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;
    const vehicleId = params.vehicleId;

    const costs = await aggregateVehicleCosts(userId, vehicleId);
    res.status(200).json(costs);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getScheduledLogUsage = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;
    const vehicleId = params.vehicleId;

    const usage = await aggregateScheduledLogUsage(userId, vehicleId);
    res.status(200).json(usage);
  } catch (error) {
    handleError(res, error as Error);
  }
};
