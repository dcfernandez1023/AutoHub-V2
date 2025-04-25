import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';

import { ALLOWED_SCOPES, AUTH_SCOPES, CONSTANTS, ROLES } from '../constants';
import APIError from '../errors/APIError';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const generateRegistrationToken = (userId: string, email: string): string => {
  const scopes = [AUTH_SCOPES.REGISTER];
  return jwt.sign({ userId, email, scopes }, JWT_SECRET, { expiresIn: '10m' });
};

export const generateJwtToken = (userId: string, email: string, role: ROLES): string => {
  const scopes = ALLOWED_SCOPES[role];
  if (!scopes) {
    throw new APIError('Invalid role', 400);
  }
  if (!userId || !email) {
    throw new APIError('Failed to generate access token. Invalid userId or email provided', 400);
  }

  const payload = { userId, email, scopes };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const authenticateToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new APIError('Invalid or expired token', 403);
  }
};

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await compare(plainPassword, hashedPassword);
};
