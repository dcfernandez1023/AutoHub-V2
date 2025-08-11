import { Request, Response } from 'express';
import { handleError } from './utils';
import {
  createScheduledLog,
  findVehicleScheduledLogs,
  removeScheduledLogs,
  updateScheduledLogs,
} from '../services/scheduledLogService';
import {
  createRepairLog,
  updateRepairLogs,
  findVehicleRepairLogs,
  removeRepairLogs,
} from '../services/repairLogService';
import VehicleChangeLogPublisher from '../eventbus/publishers/VehicleChangeLogPublisher';

export const postScheduledLog = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const { scheduledLog, scheduledServiceType, vehicle } = await createScheduledLog(vehicleId, userId, req.body);

    VehicleChangeLogPublisher.scheduledLogCreated(
      req.user.userId,
      req.user.username,
      vehicle.id,
      vehicle.name,
      scheduledServiceType?.name,
      scheduledLog.datePerformed,
      scheduledLog.mileage
    );

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

    const { scheduledLogs, vehicle } = await updateScheduledLogs(vehicleId, userId, req.body);

    if (scheduledLogs.length) {
      VehicleChangeLogPublisher.scheduledLogsUpdated(
        req.user.userId,
        req.user.username,
        vehicle.id,
        vehicle.name,
        scheduledLogs.length
      );
    }

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

export const deleteScheduledLogs = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const { ids, vehicle } = await removeScheduledLogs(req.body, vehicleId, userId);

    if (ids.length) {
      VehicleChangeLogPublisher.scheduledLogsDeleted(
        req.user.userId,
        req.user.username,
        vehicle.id,
        vehicle.name,
        ids.length
      );
    }

    res.status(200).json(ids);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const postRepairLog = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const { repairLog, vehicle } = await createRepairLog(vehicleId, userId, req.body);

    VehicleChangeLogPublisher.repairLogCreated(
      req.user.userId,
      req.user.username,
      vehicle.id,
      vehicle.name,
      repairLog.name,
      repairLog.datePerformed,
      repairLog.mileage
    );

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

    const { repairLogs, vehicle } = await updateRepairLogs(vehicleId, userId, req.body);

    if (repairLogs.length) {
      VehicleChangeLogPublisher.repairLogsUpdated(
        req.user.userId,
        req.user.username,
        vehicle.id,
        vehicle.name,
        repairLogs.length
      );
    }

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

export const deleteRepairLogs = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const { ids, vehicle } = await removeRepairLogs(req.body, vehicleId, userId);

    if (ids.length) {
      VehicleChangeLogPublisher.repairLogsDeleted(
        req.user.userId,
        req.user.username,
        vehicle.id,
        vehicle.name,
        ids.length
      );
    }

    res.status(200).json(ids);
  } catch (error) {
    handleError(res, error as Error);
  }
};
