import {
  CreateScheduledServiceInstanceRequest,
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
    userId: string,
    sharedVehicleId?: string
  ): Promise<ScheduledServiceType[]> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/scheduledServiceTypes${sharedVehicleId ? `?sharedVehicle=${sharedVehicleId}` : ''}`;
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

  async createScheduledServiceInstances(
    userId: string,
    vehicleId: string,
    records: CreateScheduledServiceInstanceRequest[]
  ) {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/scheduledServiceInstances`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'POST',
      body: JSON.stringify(records),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to create scheduled service instances. Status code ${res.status}`
      );
    }

    const data = (await res.json()) as ScheduledServiceInstance[];
    console.log(data);
    return data;
  }

  async updateScheduledServiceInstance(
    userId: string,
    vehicleId: string,
    scheduledServiceInstance: ScheduledServiceInstance
  ) {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/scheduledServiceInstances/${scheduledServiceInstance.id}`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'PUT',
      body: JSON.stringify(scheduledServiceInstance),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to update scheduled service instance. Status code ${res.status}`
      );
    }

    const data = (await res.json()) as ScheduledServiceInstance;
    console.log(data);
    return data;
  }

  async deleteScheduledServiceInstance(
    userId: string,
    vehicleId: string,
    scheduledServiceInstanceId: string
  ) {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/scheduledServiceInstances/${scheduledServiceInstanceId}`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(
        `Failed to delete scheduled service instance. Status code ${res.status}`
      );
    }

    const data = (await res.json()) as ScheduledServiceInstance;
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
