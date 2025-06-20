import { Router } from 'express';
import { register, completeRegistration, login, getUser, logout } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { scopesMiddleware } from '../middleware/scopesMiddleware';
import { AUTH_SCOPES } from '../constants';
import { getToken } from '../controllers/authController';

const router = Router();

// Register routes
router.post('/users/register', register);
router.get('/users/register/complete', completeRegistration);

// Login routes
router.post('/users/login', login);
router.post('/users/logout', logout);

// User routes
router.get('/users/:userId/info', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]), getUser);

export default router;
