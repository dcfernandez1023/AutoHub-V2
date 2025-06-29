import { AuthContextType } from '../types/auth';
import { User } from '../types/user';
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
        ...this._defaultOptions,
        method: 'POST',
        headers: this._defaultHeaders,
        body: JSON.stringify({ email, password }),
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
        ...this._defaultOptions,
        method: 'POST',
        headers: this._defaultHeaders,
        body: JSON.stringify({}),
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
        ...this._defaultOptions,
        method: 'POST',
        headers: this._defaultHeaders,
        body: JSON.stringify({ email, username, password }),
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

  async searchUsers(
    userId: string,
    vehicleId: string,
    searchText: string
  ): Promise<User[] | null> {
    try {
      const requestUrl = `${this._baseUrl}/api/users/${userId}/searchToShare?q=${searchText}&vehicleId=${vehicleId}`;
      const res = await fetch(requestUrl, {
        ...this._defaultOptions,
        headers: this._defaultHeaders,
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        return data as User[];
      }
      return null;
    } catch (error) {
      console.error('Failed to search users', error);
      return null;
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
