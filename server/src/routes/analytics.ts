import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { scopesMiddleware } from '../middleware/scopesMiddleware';
import { AUTH_SCOPES } from '../constants';
import { getScheduledLogUsage, getVehicleCost } from '../controllers/analyticsController';

const router = Router();

router.get(
  '/users/:userId/vehicles/:vehicleId/analytics/cost',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleCost
);

router.get(
  '/users/:userId/vehicles/:vehicleId/analytics/scheduledLogUsage',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getScheduledLogUsage
);

export default router;
