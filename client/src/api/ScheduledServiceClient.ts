import {
  ScheduledServiceInstance,
  ScheduledServiceType,
} from '../types/scheduledService';
import { getApiBaseUrl } from '../utils/url';
import BaseClient from './BaseClient';

class ScheduledServiceClient extends BaseClient {
  private _baseUrl;

  private static _instance: ScheduledServiceClient;

  private constructor() {
    super();
    this._baseUrl = getApiBaseUrl();
  }

  async getScheduledServiceTypes(
    userId: string
  ): Promise<ScheduledServiceType[]> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/scheduledServiceTypes`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch scheduled service types. Status code ${res.status}`
      );
    }

    const data = (await res.json()) as ScheduledServiceType[];
    return data;
  }

  async getScheduledServiceInstances(
    userId: string,
    vehicleId: string
  ): Promise<ScheduledServiceInstance[]> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/scheduledServiceInstances`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch scheduled service instances. Status code ${res.status}`
      );
    }

    const data = (await res.json()) as ScheduledServiceInstance[];
    return data;
  }

  async createOrUpdateScheduledServiceType(
    userId: string,
    name: string,
    action: 'CREATE' | 'UPDATE',
    scheduledServiceTypeId?: string
  ) {
    if (action === 'UPDATE' && !scheduledServiceTypeId) {
      throw new Error('Must provide a scheduled service type id to update');
    }

    const requestUrl =
      action === 'CREATE'
        ? `${this._baseUrl}/api/users/${userId}/scheduledServiceTypes`
        : `${this._baseUrl}/api/users/${userId}/scheduledServiceTypes/${scheduledServiceTypeId}`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: action === 'CREATE' ? 'POST' : 'PUT',
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to create or update scheduled service types. Status code ${res.status}`
      );
    }

    const data = (await res.json()) as ScheduledServiceType;
    return data;
  }

  async deleteScheduledServiceType(
    userId: string,
    scheduledServiceTypeId: string
  ) {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/scheduledServiceTypes/${scheduledServiceTypeId}`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(
        `Failed to delete scheduled service type. Status code ${res.status}`
      );
    }

    const data = (await res.json()) as ScheduledServiceType;
    return data;
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new ScheduledServiceClient();
    }

    return this._instance;
  }
}

export default ScheduledServiceClient.instance;
