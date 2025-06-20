import { Router } from 'express';
import { AUTH_SCOPES } from '../constants';
import { postImport } from '../controllers/importExportController';
import { authMiddleware } from '../middleware/authMiddleware';
import { scopesMiddleware } from '../middleware/scopesMiddleware';

const router = Router();

router.post('/users/:userId/import', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]), postImport);

export default router;
