import { Router } from 'express';
import { register, completeRegistration, login, getUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  deleteVehicle,
  deleteVehicleAttachment,
  deleteVehicleShare,
  getVehicle,
  getVehicleAttachments,
  getVehicleChangelog,
  getVehicles,
  getVehicleShare,
  postVehicle,
  postVehicleAttachment,
  postVehicleShare,
  putVehicle,
} from '../controllers/vehicleController';
import { scopesMiddleware } from '../middleware/scopesMiddleware';
import { AUTH_SCOPES } from '../constants';
import {
  deleteScheduledServiceType,
  getScheduledServiceTypes,
  postScheduledServiceType,
  putScheduledServiceType,
} from '../controllers/scheduledServiceTypeController';

const router = Router();

// Register routes
router.post('/users/register', register);
router.get('/users/register/complete', completeRegistration);

// Login routes
router.post('/users/login', login);

// User routes
router.get('/users/info', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]), getUser);

// Scheduled service type routes
router.get(
  '/users/:userId/scheduledServiceType',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getScheduledServiceTypes
);
router.post(
  '/users/:userId/scheduledServiceType',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postScheduledServiceType
);
router.put(
  '/users/:userId/scheduledServiceType/:scheduledServiceTypeId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  putScheduledServiceType
);
router.delete(
  '/users/:userId/scheduledServiceType/:scheduledServiceTypeId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteScheduledServiceType
);

// Vehicle changelog
router.get(
  '/users/:userId/vehicles/:vehicleId/changelog',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleChangelog
);

// Vehicle share routes
router.post(
  '/users/:userId/vehicles/:vehicleId/share',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postVehicleShare
);
router.get(
  '/users/:userId/vehicles/:vehicleId/share',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleShare
);
router.delete(
  '/users/:userId/vehicles/:vehicleId/share',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteVehicleShare
);

// Vehicle attachments
router.get(
  '/users/:userId/vehicles/:vehicleId/attachments',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleAttachments
);
router.post(
  '/users/:userId/vehicles/:vehicleId/attachments',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postVehicleAttachment
);
router.delete(
  '/users/:userId/vehicles/:vehicleId/attachment/:attachmentId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteVehicleAttachment
);

// Vehicles
router.get(
  '/users/:userId/vehicles/:vehicleId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicle
);
router.put(
  '/users/:userId/vehicles/:vehicleId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  putVehicle
);
router.delete(
  '/users/:userId/vehicles/:vehicleId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteVehicle
);
router.get('/users/:userId/vehicles', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]), getVehicles);
router.post('/users/:userId/vehicles', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]), postVehicle);

export default router;
