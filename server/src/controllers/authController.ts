import { Request, Response } from 'express';
import { getUserDecodedPayloadFromToken, getUserDecodedTokenPayload, handleError } from './utils';
import { login } from '../services/userService';
import { generateJwtToken } from '../services/authService';
import { CONSTANTS, ROLES } from '../constants';
import APIError from '../errors/APIError';

export const getToken = async (req: Request, res: Response) => {
  try {
    const user = await login(req.body);
    const token = generateJwtToken(user.id, user.email, user.username, ROLES.USER_ROLE);
    res.status(200).json({ accessToken: token });
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const token = req.cookies[CONSTANTS.AUTOHUB_ACCESS_TOKEN];
    if (!token) {
      throw new APIError('No token', 400);
    }
    const userDecodedTokenPayload = getUserDecodedPayloadFromToken(token);
    console.log('decoded', userDecodedTokenPayload);
    res.status(200).json(userDecodedTokenPayload);
  } catch (error) {
    handleError(res, error as Error);
  }
};
