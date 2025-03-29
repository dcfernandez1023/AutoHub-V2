import { UserDecodedTokenPayload } from './user';

declare global {
  namespace Express {
    interface Request {
      user?: UserDecodedTokenPayload;
    }
  }
}
