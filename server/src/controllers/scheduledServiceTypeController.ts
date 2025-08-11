import { Request, Response } from 'express';
import {
  createScheduledServiceType,
  findScheduledServiceTypes,
  removeScheduledServiceType,
  updateScheduledServiceType,
} from '../services/scheduledServiceTypeService';
import { handleError } from './utils';
import ChangelogPublisher from '../eventbus/publishers/ChangelogPublisher';

export const postScheduledServiceType = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;

    const requestBody = req.body;
    const scheduledServiceType = await createScheduledServiceType(userId, requestBody?.name);

    ChangelogPublisher.scheduledServiceTypeCreated(req.user.userId, scheduledServiceType.name);

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

    ChangelogPublisher.scheduledServiceTypeUpdated(req.user.userId, scheduledServiceType.name);

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

    ChangelogPublisher.scheduledServiceTypeDeleted(req.user.userId, scheduledServiceType.name);

    res.status(200).json(scheduledServiceType);
  } catch (error) {
    console.error(error);
    handleError(res, error as Error);
  }
};

export const getScheduledServiceTypes = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;
    const sharedVehicleId = req.query.sharedVehicle;

    const scheduledServiceTypes = await findScheduledServiceTypes(
      userId,
      typeof sharedVehicleId === 'string' ? sharedVehicleId : undefined
    );

    res.status(200).json(scheduledServiceTypes);
  } catch (error) {
    handleError(res, error as Error);
  }
};
