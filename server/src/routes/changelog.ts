import { Router } from 'express';
import { AUTH_SCOPES } from '../constants';
import { getVehicleChangelog } from '../controllers/vehicleController';
import { authMiddleware } from '../middleware/authMiddleware';
import { scopesMiddleware } from '../middleware/scopesMiddleware';
import { getChangelog } from '../controllers/changelogController';

const router = Router();

// Vehicle changelog
router.get('/users/:userId/changelog', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]), getChangelog);

export default router;
