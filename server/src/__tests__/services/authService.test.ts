import jwt from 'jsonwebtoken';
import {
  generateRegistrationToken,
  authenticateToken,
  verifyPassword,
  generateJwtToken,
} from '../../services/authService';
import { AUTH_SCOPES, ROLES } from '../../constants';

const mockUserId = '5282fc15-73f1-422d-ac21-045a7470c201';
const mockEmail = 'test@email.com';
const mockSecret = 'your_secret_key';

describe('authService tests', () => {
  describe('generateRegistrationToken', () => {
    test('can successfully generate registration token', () => {
      const token = generateRegistrationToken(mockUserId, mockEmail);

      // Decode the token
      const decoded = jwt.verify(token, mockSecret) as jwt.JwtPayload;

      expect(decoded).toHaveProperty('userId', mockUserId);
      expect(decoded).toHaveProperty('email', mockEmail);
      expect(decoded).toHaveProperty('scopes');
      expect(decoded.scopes).toContain(AUTH_SCOPES.REGISTER);

      // Optional: Check for expiration
      expect(decoded).toHaveProperty('exp');
    });
  });

  describe('generateJwtToken', () => {
    test('can successfully generate jwt token', () => {
      const token = generateJwtToken(mockUserId, mockEmail, ROLES.USER_ROLE);

      // Decode the token
      const decoded = jwt.verify(token, mockSecret) as jwt.JwtPayload;

      expect(decoded).toHaveProperty('userId', mockUserId);
      expect(decoded).toHaveProperty('email', mockEmail);
      expect(decoded).toHaveProperty('scopes');
      expect(decoded.scopes).toContain(AUTH_SCOPES.AUTOHUB_READ);
      expect(decoded.scopes).toContain(AUTH_SCOPES.AUTOHUB_WRITE);
      expect(decoded.scopes).toContain(AUTH_SCOPES.REGISTER);

      // Optional: Check for expiration
      expect(decoded).toHaveProperty('exp');
    });

    test('throws error if invalid role provided', () => {
      // @ts-expect-error
      const testFunc = () => generateJwtToken(mockUserId, mockEmail, 'invalid role');
      expect(testFunc).toThrow();
    });
  });

  describe('authenticateToken', () => {
    test('can successfully authenticate token', () => {
      const token = generateJwtToken(mockUserId, mockEmail, ROLES.USER_ROLE);
      const testFunc = () => authenticateToken(token);
      expect(testFunc).not.toThrow();
    });

    test('throws error if invalid token provided', () => {
      const testFunc = () => authenticateToken('invalid token');
      expect(testFunc).toThrow();
    });
  });
});
