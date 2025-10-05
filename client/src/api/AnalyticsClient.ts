import { ScheduledLogUsage, VehicleCosts } from '../types/analytics';
import { getApiBaseUrl } from '../utils/url';
import BaseClient from './BaseClient';

class AnalyticsClient extends BaseClient {
  private _baseUrl;

  private static _instance: AnalyticsClient;

  private constructor() {
    super();
    this._baseUrl = getApiBaseUrl();
  }

  async getVehicleCost(userId: string, vehicleId: string) {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/analytics/cost`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch cost for analytics');
    }

    const data = (await res.json()) as VehicleCosts;
    return data;
  }

  async getScheduledLogUsage(userId: string, vehicleId: string) {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/analytics/scheduledLogUsage`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch scheduled log usage for analytics');
    }

    const data = (await res.json()) as ScheduledLogUsage[];
    return data;
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new AnalyticsClient();
    }

    return this._instance;
  }
}

export default AnalyticsClient.instance;
