import { Router } from 'express';
import { AUTH_SCOPES } from '../constants';
import { postExport } from '../controllers/importExportController';
import { authMiddleware } from '../middleware/authMiddleware';
import { scopesMiddleware } from '../middleware/scopesMiddleware';

const router = Router();

router.post('/users/:userId/export', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]), postExport);

export default router;
