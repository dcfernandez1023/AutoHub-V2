import { Router } from 'express';
import { AUTH_SCOPES } from '../constants';
import {
  deleteScheduledLogs,
  postScheduledLog,
  putScheduledLogs,
  getVehicleScheduledLogs,
} from '../controllers/vehicleLogController';
import { authMiddleware } from '../middleware/authMiddleware';
import { scopesMiddleware } from '../middleware/scopesMiddleware';

const router = Router();

router.delete(
  '/users/:userId/vehicles/:vehicleId/scheduledLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteScheduledLogs
);
router.post(
  '/users/:userId/vehicles/:vehicleId/scheduledLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postScheduledLog
);
router.put(
  '/users/:userId/vehicles/:vehicleId/scheduledLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  putScheduledLogs
);
router.get(
  '/users/:userId/vehicles/:vehicleId/scheduledLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleScheduledLogs
);

export default router;
