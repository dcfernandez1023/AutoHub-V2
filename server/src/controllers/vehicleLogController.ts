import { Request, Response } from 'express';
import { handleError } from './utils';
import {
  createScheduledLog,
  findVehicleScheduledLogs,
  removeScheduledLog,
  updateScheduledLogs,
} from '../services/scheduledLogService';
import {
  createRepairLog,
  updateRepairLogs,
  findVehicleRepairLogs,
  removeRepairLog,
} from '../services/repairLogService';

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

export const postRepairLog = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const repairLog = await createRepairLog(vehicleId, userId, req.body);
    res.status(200).json(repairLog);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const putRepairLogs = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const repairLogs = await updateRepairLogs(vehicleId, userId, req.body);
    res.status(200).json(repairLogs);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getVehicleRepairLogs = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const repairLogs = await findVehicleRepairLogs(vehicleId, userId);
    res.status(200).json(repairLogs);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const deleteRepairLog = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const repairLogId = params.repairLogId;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const repairLog = await removeRepairLog(repairLogId, vehicleId, userId);
    res.status(200).json(repairLog);
  } catch (error) {
    handleError(res, error as Error);
  }
};
