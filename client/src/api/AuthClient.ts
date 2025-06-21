import { AuthContextType } from '../types/auth';
import { getApiBaseUrl } from '../utils/url';
import BaseClient from './BaseClient';

class AuthClient extends BaseClient {
  private _baseUrl: string;

  private static _instance: AuthClient;

  private constructor() {
    super();
    this._baseUrl = getApiBaseUrl();
  }

  async me(): Promise<AuthContextType | null> {
    try {
      const res = await fetch(`${this._baseUrl}/api/auth/me`, {
        method: 'GET',
        ...this._defaultOptions,
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch /api/auth/me', error);
      return null;
    }
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new AuthClient();
    }

    return this._instance;
  }
}

export default AuthClient.instance;
