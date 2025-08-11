import { Router } from 'express';
import { AUTH_SCOPES } from '../constants';
import {
  deleteRepairLogs,
  postRepairLog,
  putRepairLogs,
  getVehicleRepairLogs,
} from '../controllers/vehicleLogController';
import { authMiddleware } from '../middleware/authMiddleware';
import { scopesMiddleware } from '../middleware/scopesMiddleware';

const router = Router();

// Repair logs
router.delete(
  '/users/:userId/vehicles/:vehicleId/repairLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  deleteRepairLogs
);
router.post(
  '/users/:userId/vehicles/:vehicleId/repairLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postRepairLog
);
router.put(
  '/users/:userId/vehicles/:vehicleId/repairLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  putRepairLogs
);
router.get(
  '/users/:userId/vehicles/:vehicleId/repairLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleRepairLogs
);

export default router;
