import { NextFunction, Request, Response } from 'express';
import { handleError } from '../controllers/utils';
import APIError from '../errors/APIError';

export const scopesMiddleware = (requiredScopes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new APIError('No token provided', 401);
      }

      const scopes = req.user.scopes;
      const hasAllScopes = requiredScopes.every((scope) => scopes.includes(scope));

      if (!hasAllScopes) {
        throw new APIError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      handleError(res, error as Error);
    }
  };
};
