import { NextFunction, Request, Response } from 'express';
import { CONSTANTS } from '../constants';
import { authenticateToken } from '../services/authService';
import { handleError } from '../controllers/utils';
import APIError from '../errors/APIError';
import { UserDecodedTokenPayload } from '../types/user';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.cookies?.[CONSTANTS.AUTOHUB_ACCESS_TOKEN]) {
      token = req.cookies[CONSTANTS.AUTOHUB_ACCESS_TOKEN];
    }

    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new APIError('No token provided', 401);
    }

    const decoded = authenticateToken(token);
    let userDecodedTokenPayload: UserDecodedTokenPayload;
    if (typeof decoded === 'string') {
      userDecodedTokenPayload = JSON.parse(decoded) as UserDecodedTokenPayload;
    } else {
      userDecodedTokenPayload = {
        userId: decoded.userId,
        email: decoded.email,
        scopes: decoded.scopes,
      };
    }

    const userIdParam = req.params.userId;
    if (userIdParam !== userDecodedTokenPayload.userId) {
      throw new APIError('Forbidden', 403);
    }

    req.user = userDecodedTokenPayload;
    console.log('Token valid');
    next();
  } catch (error) {
    handleError(res, error as Error);
  }
};
