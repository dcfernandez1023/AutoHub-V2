import { AuthContextType } from '../types/auth';
import { getApiBaseUrl } from '../utils/url';
import BaseClient from './BaseClient';

class UserClient extends BaseClient {
  private _baseUrl: string;

  private static _instance: UserClient;

  private constructor() {
    super();
    this._baseUrl = getApiBaseUrl();
  }

  async login(
    email: string,
    password: string
  ): Promise<AuthContextType | null> {
    try {
      const res = await fetch(`${this._baseUrl}/api/users/login`, {
        method: 'POST',
        headers: this._defaultHeaders,
        body: JSON.stringify({ email, password }),
        ...this._defaultOptions,
      });
      if (!res.ok) {
        throw new Error(`Failed to login with status code ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch /api/users/login', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      const res = await fetch(`${this._baseUrl}/api/users/logout`, {
        method: 'POST',
        headers: this._defaultHeaders,
        body: JSON.stringify({}),
        ...this._defaultOptions,
      });
      if (!res.ok) {
        throw new Error(`Failed to logout with status code ${res.status}`);
      }
    } catch (error) {
      console.error('Failed to fetch /api/users/login', error);
    }
  }

  async register(
    email: string,
    username: string,
    password: string
  ): Promise<string> {
    try {
      const res = await fetch(`${this._baseUrl}/api/users/register`, {
        method: 'POST',
        headers: this._defaultHeaders,
        body: JSON.stringify({ email, username, password }),
        ...this._defaultOptions,
      });
      if (!res.ok) {
        throw new Error(`Failed to login with status code ${res.status}`);
      }
      return email;
    } catch (error) {
      console.error('Failed to fetch /api/users/register', error);
      return '';
    }
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new UserClient();
    }

    return this._instance;
  }
}

export default UserClient.instance;
