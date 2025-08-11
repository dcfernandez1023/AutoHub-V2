import { Request, Response } from 'express';
import { handleError } from './utils';
import { findChangelog } from '../services/changelogService';

export const getChangelog = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;

    const changelog = await findChangelog(userId);

    res.status(200).json(changelog);
  } catch (error) {
    handleError(res, error as Error);
  }
};
