import { Request, Response } from 'express';
import {
  createScheduledServiceType,
  findScheduledServiceTypes,
  removeScheduledServiceType,
  updateScheduledServiceType,
} from '../services/scheduledServiceTypeService';
import { handleError } from './utils';

export const postScheduledServiceType = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;

    const requestBody = req.body;
    const scheduledServiceType = await createScheduledServiceType(userId, requestBody?.name);

    res.status(200).json(scheduledServiceType);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const putScheduledServiceType = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const id = req.params.scheduledServiceTypeId;
    const userId = params.userId;

    const requestBody = req.body;
    const scheduledServiceType = await updateScheduledServiceType(id, userId, requestBody?.name);

    res.status(200).json(scheduledServiceType);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const deleteScheduledServiceType = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const id = req.params.scheduledServiceTypeId;
    const userId = params.userId;

    const scheduledServiceType = await removeScheduledServiceType(id, userId);

    res.status(200).json(scheduledServiceType);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getScheduledServiceTypes = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;

    const scheduledServiceTypes = await findScheduledServiceTypes(userId);

    res.status(200).json(scheduledServiceTypes);
  } catch (error) {
    handleError(res, error as Error);
  }
};
