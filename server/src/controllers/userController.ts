import { Request, Response } from 'express';
import {
  register as handleRegister,
  completeRegistration as handleCompleteRegistration,
  login as handleLogin,
  getRegisteredUser,
} from '../services/userService';
import { getUserDecodedTokenPayload, handleError } from './utils';
import { authenticateToken, generateJwtToken } from '../services/authService';
import APIError from '../errors/APIError';
import { CONSTANTS, ROLES } from '../constants';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const completeLink = await handleRegister({ username, email, password, baseUrl });
    res.status(200).json({ message: `Registration email sent: ${completeLink}` });
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const completeRegistration = async (req: Request, res: Response) => {
  try {
    const registrationToken = req.query.token;
    if (!registrationToken || typeof registrationToken !== 'string') {
      throw new APIError('No token found', 400);
    }
    const decodedUserPayload = authenticateToken(decodeURIComponent(registrationToken));
    if (typeof decodedUserPayload !== 'string') {
      await handleCompleteRegistration({ userId: decodedUserPayload.userId, email: decodedUserPayload.email });
      res.status(200).json({ message: 'Registration completed' });
      return;
    }
    throw new Error('Could not decode registration token');
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await handleLogin({ email, password });
    const jwtToken = generateJwtToken(user.id, email, user.role as ROLES);
    console.log(`JWT Token: ${jwtToken}`);
    res.cookie(CONSTANTS.AUTOHUB_ACCESS_TOKEN, jwtToken);
    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userDecodedTokenPayload = getUserDecodedTokenPayload(req);
    const { userId, email } = userDecodedTokenPayload;
    console.log(userId, email);
    const user = await getRegisteredUser({ id: userId, email });
    const { password, ...profile } = user;
    console.log(profile);
    res.status(200).json(profile);
  } catch (error) {
    handleError(res, error as Error);
  }
};
