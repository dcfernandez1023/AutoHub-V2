import { Router } from 'express';
import { getToken, me } from '../controllers/authController';
import { AUTH_SCOPES } from '../constants';
import { authMiddleware } from '../middleware/authMiddleware';
import { scopesMiddleware } from '../middleware/scopesMiddleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     GetTokenRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     GetTokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 */

/**
 * @swagger
 * /api/auth/token:
 *   post:
 *     summary: Get an access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetTokenRequest'
 *     responses:
 *       200:
 *         description: Token returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetTokenResponse'
 */
router.post('/auth/token', getToken);
router.get('/auth/me', me);

export default router;
