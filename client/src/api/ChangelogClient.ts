import { ChangelogResponseRaw, VehicleChangelogRaw } from '../types/changelog';
import { getApiBaseUrl } from '../utils/url';
import BaseClient from './BaseClient';

class ChangelogClient extends BaseClient {
  private _baseUrl;

  private static _instance: ChangelogClient;

  private constructor() {
    super();
    this._baseUrl = getApiBaseUrl();
  }

  async getChangelog(userId: string): Promise<ChangelogResponseRaw> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/changelog`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch changelog. Status code: ${res.status}`);
    }

    const data = await res.json();
    return data as ChangelogResponseRaw;
  }

  async getVehicleChangelog(
    userId: string,
    vehicleId: string
  ): Promise<VehicleChangelogRaw[]> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/changelog`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch vehicle changelog. Status code: ${res.status}`
      );
    }

    const data = await res.json();
    return data as VehicleChangelogRaw[];
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new ChangelogClient();
    }

    return this._instance;
  }
}

export default ChangelogClient.instance;
