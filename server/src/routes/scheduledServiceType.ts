import { Router } from 'express';
import { AUTH_SCOPES } from '../constants';
import {
  getScheduledServiceTypes,
  postScheduledServiceType,
  putScheduledServiceType,
  deleteScheduledServiceType,
} from '../controllers/scheduledServiceTypeController';
import { authMiddleware } from '../middleware/authMiddleware';
import { scopesMiddleware } from '../middleware/scopesMiddleware';

const router = Router();

router.get(
  '/users/:userId/scheduledServiceTypes',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getScheduledServiceTypes
);
router.post(
  '/users/:userId/scheduledServiceTypes',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postScheduledServiceType
);
router.put(
  '/users/:userId/scheduledServiceTypes/:scheduledServiceTypeId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  putScheduledServiceType
);
router.delete(
  '/users/:userId/scheduledServiceTypes/:scheduledServiceTypeId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteScheduledServiceType
);

export default router;
