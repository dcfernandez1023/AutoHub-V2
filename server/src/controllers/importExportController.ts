import { Request, Response } from 'express';
import { handleError } from './utils';
import { getFileBuffer } from '../services/storageService';
import { doExport, doImport } from '../services/importExportService';

export const postImport = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;

    const { buffer } = await getFileBuffer(req);
    await doImport(userId, buffer);

    res.status(200).json({ message: 'Import succeeded' });
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const postExport = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = params.userId;

    const jsonExport = await doExport(userId);

    res
      .status(200)
      .setHeader('Content-Disposition', 'attachment; filename="autohub.json"')
      .setHeader('Content-Type', 'application/json')
      .send(jsonExport);
  } catch (error) {
    handleError(res, error as Error);
  }
};
