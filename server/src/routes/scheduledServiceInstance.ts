import { Router } from 'express';
import { AUTH_SCOPES } from '../constants';
import {
  deleteScheduledServiceInstance,
  getVehicleScheduledServiceInstances,
  postScheduledServiceInstances,
  putScheduledServiceInstance,
} from '../controllers/scheduledServiceInstanceController';
import { authMiddleware } from '../middleware/authMiddleware';
import { scopesMiddleware } from '../middleware/scopesMiddleware';

const router = Router();

router.post(
  '/users/:userId/vehicles/:vehicleId/scheduledServiceInstances',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postScheduledServiceInstances
);
router.get(
  '/users/:userId/vehicles/:vehicleId/scheduledServiceInstances',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleScheduledServiceInstances
);
router.put(
  '/users/:userId/vehicles/:vehicleId/scheduledServiceInstances/:scheduledServiceInstanceId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  putScheduledServiceInstance
);
router.delete(
  '/users/:userId/vehicles/:vehicleId/scheduledServiceInstances/:scheduledServiceInstanceId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteScheduledServiceInstance
);

export default router;
