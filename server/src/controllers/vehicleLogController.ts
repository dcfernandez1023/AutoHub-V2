import { Request, Response } from 'express';
import { handleError } from './utils';
import {
  createScheduledLog,
  findVehicleScheduledLogs,
  removeScheduledLog,
  updateScheduledLogs,
} from '../services/scheduledLogService';

export const postScheduledLog = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const scheduledLog = await createScheduledLog(vehicleId, userId, req.body);
    res.status(200).json(scheduledLog);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const putScheduledLogs = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const scheduledLogs = await updateScheduledLogs(vehicleId, userId, req.body);
    res.status(200).json(scheduledLogs);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getVehicleScheduledLogs = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const scheduledLogs = await findVehicleScheduledLogs(vehicleId, userId);
    res.status(200).json(scheduledLogs);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const deleteScheduledLog = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const scheduledLogId = params.scheduledLogId;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const scheduledLog = await removeScheduledLog(scheduledLogId, vehicleId, userId);
    res.status(200).json(scheduledLog);
  } catch (error) {
    handleError(res, error as Error);
  }
};
