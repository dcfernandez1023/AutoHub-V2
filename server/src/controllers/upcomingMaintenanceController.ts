import { Request, Response } from 'express';
import { handleError } from './utils';
import { findUpcomingMaintenance } from '../services/upcomingMaintenanceService';

export const getUpcomingMaintenance = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;
    const vehicleId = params.vehicleId;

    const queryParams = req.query;
    const shared = queryParams.shared;

    const upcomingMaintenance = await findUpcomingMaintenance(userId, vehicleId, shared === 'true');
    res.status(200).json(upcomingMaintenance);
  } catch (error) {
    handleError(res, error as Error);
  }
};
