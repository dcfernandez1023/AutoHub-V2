import { Request, Response } from 'express';
import { handleError } from './utils';
import {
  createScheduledServiceInstances,
  findVehicleScheduledServiceInstances,
  removeScheduledServiceInstance,
  updateScheduledServiceInstance,
} from '../services/scheduledServiceInstanceService';

export const postScheduledServiceInstances = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;
    const requestBody = req.body;

    const scheduledServiceInstances = await createScheduledServiceInstances(vehicleId, userId, requestBody);
    res.status(200).json(scheduledServiceInstances);
  } catch (error) {
    console.error(error);
    handleError(res, error as Error);
  }
};

export const getVehicleScheduledServiceInstances = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const scheduledServiceInstances = await findVehicleScheduledServiceInstances(vehicleId, userId);
    res.status(200).json(scheduledServiceInstances);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const putScheduledServiceInstance = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const scheduledServiceInstanceId = params.scheduledServiceInstanceId;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const scheduledServiceInstance = await updateScheduledServiceInstance(
      scheduledServiceInstanceId,
      vehicleId,
      userId,
      req.body
    );

    res.status(200).json(scheduledServiceInstance);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const deleteScheduledServiceInstance = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const scheduledServiceInstanceId = params.scheduledServiceInstanceId;
    const vehicleId = params.vehicleId;
    const userId = params.userId;

    const scheduledServiceInstance = await removeScheduledServiceInstance(
      scheduledServiceInstanceId,
      vehicleId,
      userId
    );

    res.status(200).json(scheduledServiceInstance);
  } catch (error) {
    handleError(res, error as Error);
  }
};
