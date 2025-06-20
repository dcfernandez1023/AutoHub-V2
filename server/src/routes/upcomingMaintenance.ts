import { Router } from 'express';
import { AUTH_SCOPES } from '../constants';
import { getUpcomingMaintenance } from '../controllers/upcomingMaintenanceController';
import { authMiddleware } from '../middleware/authMiddleware';
import { scopesMiddleware } from '../middleware/scopesMiddleware';

const router = Router();

router.get(
  '/users/:userId/upcomingMaintenance',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getUpcomingMaintenance
);
router.get(
  '/users/:userId/vehicles/:vehicleId/upcomingMaintenance',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getUpcomingMaintenance
);

export default router;
