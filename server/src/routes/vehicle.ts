import { Router } from 'express';
import { AUTH_SCOPES } from '../constants';
import {
  deleteVehicle,
  deleteVehicleAttachment,
  deleteVehicleShare,
  getVehicle,
  getVehicleAttachments,
  getVehicleChangelog,
  getVehicles,
  getVehicleShare,
  getVehicleShares,
  postVehicle,
  postVehicleAttachment,
  postVehicleShare,
  putVehicle,
} from '../controllers/vehicleController';
import { authMiddleware } from '../middleware/authMiddleware';
import { scopesMiddleware } from '../middleware/scopesMiddleware';

const router = Router();

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
router.get(
  '/users/:userId/vehicles/:vehicleId/shares',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleShares
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
  '/users/:userId/vehicles/:vehicleId/attachments/:attachmentId',
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
