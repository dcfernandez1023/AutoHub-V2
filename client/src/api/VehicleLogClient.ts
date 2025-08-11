import {
  CreateRepairLogRequest,
  CreateScheduledLogRequest,
  RepairLogRaw,
  ScheduledLog,
  ScheduledLogRaw,
  UpdateRepairLogRequest,
  UpdateScheduledLogRequest,
} from '../types/vehicleLog';
import { getApiBaseUrl } from '../utils/url';
import BaseClient from './BaseClient';

class VehicleLogClient extends BaseClient {
  private _baseUrl;

  private static _instance: VehicleLogClient;

  private constructor() {
    super();
    this._baseUrl = getApiBaseUrl();
  }

  /** Scheduled Logs */
  async getScheduledLogs(
    userId: string,
    vehicleId: string
  ): Promise<ScheduledLogRaw[]> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/scheduledLogs`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch scheduled logs. Status code: ${res.status}`
      );
    }

    const data = await res.json();
    return data as ScheduledLogRaw[];
  }

  async createScheduledLog(
    userId: string,
    vehicleId: string,
    log: CreateScheduledLogRequest
  ): Promise<ScheduledLogRaw> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/scheduledLogs`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'POST',
      body: JSON.stringify(log),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to create scheduled log. Status code: ${res.status}`
      );
    }

    const data = await res.json();
    return data as ScheduledLogRaw;
  }

  async updateScheduledLogs(
    userId: string,
    vehicleId: string,
    logs: UpdateScheduledLogRequest[]
  ): Promise<ScheduledLogRaw[]> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/scheduledLogs`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'PUT',
      body: JSON.stringify(logs),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to update scheduled logs. Status code: ${res.status}`
      );
    }

    const data = await res.json();
    return data as ScheduledLogRaw[];
  }

  async deleteScheduledLogs(
    userId: string,
    vehicleId: string,
    logIds: string[]
  ): Promise<string[]> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/scheduledLogs`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'DELETE',
      body: JSON.stringify(logIds),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to delete scheduled logs. Status code: ${res.status}`
      );
    }

    const data = await res.json();
    return data as string[];
  }

  /** Repair Logs */
  async getRepairLogs(
    userId: string,
    vehicleId: string
  ): Promise<RepairLogRaw[]> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/repairLogs`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch repair logs. Status code: ${res.status}`
      );
    }

    const data = await res.json();
    return data as RepairLogRaw[];
  }

  async createRepairLog(
    userId: string,
    vehicleId: string,
    log: CreateRepairLogRequest
  ): Promise<RepairLogRaw> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/repairLogs`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'POST',
      body: JSON.stringify(log),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to create repair log. Status code: ${res.status}`
      );
    }

    const data = await res.json();
    return data as RepairLogRaw;
  }

  async updateRepairLogs(
    userId: string,
    vehicleId: string,
    logs: UpdateRepairLogRequest[]
  ): Promise<RepairLogRaw[]> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/repairLogs`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'PUT',
      body: JSON.stringify(logs),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to update repair logs. Status code: ${res.status}`
      );
    }

    const data = await res.json();
    return data as RepairLogRaw[];
  }

  async deleteRepairLogs(
    userId: string,
    vehicleId: string,
    logIds: string[]
  ): Promise<string[]> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/repairLogs`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'DELETE',
      body: JSON.stringify(logIds),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to delete repair logs. Status code: ${res.status}`
      );
    }

    const data = await res.json();
    return data as string[];
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new VehicleLogClient();
    }

    return this._instance;
  }
}

export default VehicleLogClient.instance;
