import { Request, Response } from 'express';
import { CONSTANTS } from '../constants';
import APIError from '../errors/APIError';
import { UserDecodedTokenPayload } from '../types/user';
import { authenticateToken } from '../services/authService';

export const handleError = (res: Response, error: Error) => {
  if (error instanceof APIError) {
    res.status(error.statusCode).json({ error: error.message });
  } else {
    res.status(500).json({ error: error.message ?? CONSTANTS.GENERIC_ERROR });
  }
};

export const getUserDecodedTokenPayload = (req: Request): UserDecodedTokenPayload => {
  const payload = req.user;
  if (!payload || !payload.email || !payload.userId || !payload.username || !payload.scopes) {
    throw new APIError('Failed to read details from request', 400);
  }
  return payload;
};

export const getUserDecodedPayloadFromToken = (token: string): UserDecodedTokenPayload => {
  const decoded = authenticateToken(token);
  let userDecodedTokenPayload: UserDecodedTokenPayload;
  if (typeof decoded === 'string') {
    userDecodedTokenPayload = JSON.parse(decoded) as UserDecodedTokenPayload;
  } else {
    userDecodedTokenPayload = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
      scopes: decoded.scopes,
    };
  }

  return userDecodedTokenPayload;
};
