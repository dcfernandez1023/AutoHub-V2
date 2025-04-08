import { Router } from 'express';
import { register, completeRegistration, login, getUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  deleteVehicle,
  getVehicle,
  getVehicles,
  postVehicle,
  postVehicleAttachment,
  putVehicle,
} from '../controllers/vehicleController';
import { scopesMiddleware } from '../middleware/scopesMiddleware';
import { AUTH_SCOPES } from '../constants';

const router = Router();

// Register routes
router.post('/users/register', register);
router.get('/users/register/complete', completeRegistration);

// Login routes
router.post('/users/login', login);

// User routes
router.get('/users/info', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]), getUser);

// Vehicle routes
router.post(
  '/users/:userId/vehicles/:id/attachments',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postVehicleAttachment
);
router.get('/users/:userId/vehicles/:id', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]), getVehicle);
router.put('/users/:userId/vehicles/:id', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]), putVehicle);
router.delete(
  '/users/:userId/vehicles/:id',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteVehicle
);
router.get('/users/:userId/vehicles', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]), getVehicles);
router.post('/users/:userId/vehicles', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]), postVehicle);

export default router;
