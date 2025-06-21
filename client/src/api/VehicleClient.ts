import { AuthContextType } from '../types/auth';
import { Vehicle } from '../types/vehicle';
import { getApiBaseUrl } from '../utils/url';
import BaseClient from './BaseClient';

class VehicleClient extends BaseClient {
  private _baseUrl: string;

  private static _instance: VehicleClient;

  private constructor() {
    super();
    this._baseUrl = getApiBaseUrl();
  }

  async getVehicles(
    userId: string,
    shared: boolean = false
  ): Promise<Vehicle[] | null> {
    try {
      const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles?shared=${shared}`;
      const res = await fetch(requestUrl, {
        method: 'GET',
        ...this._defaultOptions,
      });
      if (res.ok) {
        const data = await res.json();
        return data as Vehicle[];
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch /api/users/${userId}/vehicles`, error);
      return null;
    }
  }

  async getVehicle(userId: string, vehicleId: string): Promise<Vehicle | null> {
    try {
      const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}`;
      const res = await fetch(requestUrl, {
        method: 'GET',
        ...this._defaultOptions,
      });
      if (res.ok) {
        const data = await res.json();
        return data as Vehicle;
      }
      return null;
    } catch (error) {
      console.error(
        `Failed to fetch /api/users/${userId}/vehicles/${vehicleId}`,
        error
      );
      return null;
    }
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new VehicleClient();
    }

    return this._instance;
  }
}

export default VehicleClient.instance;
