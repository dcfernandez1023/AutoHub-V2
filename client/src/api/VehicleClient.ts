import { UpcomingMaintenance } from '../types/upcomingManitenance';
import {
  CreateAttachmentResponse,
  CreateOrUpdateVehicle,
  UserSharedWithVehicle,
  Vehicle,
  VehicleAttachment,
  VehicleShare,
} from '../types/vehicle';
import { getApiBaseUrl } from '../utils/url';
import BaseClient from './BaseClient';

class VehicleClient extends BaseClient {
  private _baseUrl;

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
        ...this._defaultOptions,
        headers: this._defaultHeaders,
        method: 'GET',
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
        ...this._defaultOptions,
        headers: this._defaultHeaders,
        method: 'GET',
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

  async createVehicle(
    userId: string,
    vehicle: CreateOrUpdateVehicle
  ): Promise<Vehicle | null> {
    try {
      const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles`;
      const res = await fetch(requestUrl, {
        ...this._defaultOptions,
        method: 'POST',
        headers: this._defaultHeaders,
        body: JSON.stringify(vehicle),
      });
      if (res.ok) {
        const data = await res.json();
        return data as Vehicle;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch /api/users/${userId}/vehicles`, error);
      return null;
    }
  }

  async updateVehicle(
    userId: string,
    vehicleId: string,
    vehicle: CreateOrUpdateVehicle
  ): Promise<Vehicle | null> {
    try {
      const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}`;
      const res = await fetch(requestUrl, {
        ...this._defaultOptions,
        method: 'PUT',
        headers: this._defaultHeaders,
        body: JSON.stringify(vehicle),
      });
      if (res.ok) {
        const data = await res.json();
        return data as Vehicle;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch /api/users/${userId}/vehicles`, error);
      return null;
    }
  }

  async deleteVehicle(
    userId: string,
    vehicleId: string
  ): Promise<Vehicle | null> {
    try {
      const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}`;
      const res = await fetch(requestUrl, {
        ...this._defaultOptions,
        method: 'DELETE',
        headers: this._defaultHeaders,
      });
      if (res.ok) {
        const data = await res.json();
        return data as Vehicle;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch /api/users/${userId}/vehicles`, error);
      return null;
    }
  }

  async getUpcomingMaintenance(
    userId: string,
    vehicleId?: string,
    shared?: boolean
  ): Promise<UpcomingMaintenance[] | null> {
    try {
      const requestUrl = vehicleId
        ? `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/upcomingMaintenance`
        : `${this._baseUrl}/api/users/${userId}/vehicles/upcomingMaintenance${shared ? '?shared=true' : ''}`;
      const res = await fetch(requestUrl, {
        ...this._defaultOptions,
        headers: this._defaultHeaders,
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        return data as UpcomingMaintenance[];
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch /api/users/${userId}/vehicles`, error);
      return null;
    }
  }

  async getVehicleShares(
    userId: string,
    vehicleId: string
  ): Promise<UserSharedWithVehicle[] | null> {
    try {
      const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/shares`;
      const res = await fetch(requestUrl, {
        ...this._defaultOptions,
        headers: this._defaultHeaders,
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        return data as UserSharedWithVehicle[];
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

  async shareVehicle(
    userId: string,
    vehicleId: string,
    userIdToShare: string
  ): Promise<VehicleShare | null> {
    try {
      const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/share`;
      const res = await fetch(requestUrl, {
        ...this._defaultOptions,
        method: 'POST',
        headers: this._defaultHeaders,
        body: JSON.stringify({ userId: userIdToShare }),
      });
      if (res.ok) {
        const data = (await res.json()) as VehicleShare;
        return data;
      }
      return null;
    } catch (error) {
      console.error('Failed to share vehicle', error);
      return null;
    }
  }

  async unshareVehicle(
    userId: string,
    vehicleId: string,
    userIdToShare: string
  ): Promise<{ userId: string; vehicleId: string } | null> {
    try {
      const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/share`;
      const res = await fetch(requestUrl, {
        ...this._defaultOptions,
        method: 'DELETE',
        headers: this._defaultHeaders,
        body: JSON.stringify({ userId: userIdToShare }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          userId: string;
          vehicleId: string;
        };
        return data;
      }
      return null;
    } catch (error) {
      console.error('Failed to unshare vehicle', error);
      return null;
    }
  }

  async uploadAttachment(
    userId: string,
    vehicleId: string,
    file: File
  ): Promise<CreateAttachmentResponse | null> {
    try {
      const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/attachments`;
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(requestUrl, {
        ...this._defaultOptions,
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = (await res.json()) as CreateAttachmentResponse;
        return data;
      }
      return null;
    } catch (error) {
      console.error('Failed to create vehicle attachment', error);
      return null;
    }
  }

  async deleteImage(
    userId: string,
    vehicleId: string,
    attachmentId: string
  ): Promise<VehicleAttachment | null> {
    try {
      const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/attachments/${attachmentId}`;
      const res = await fetch(requestUrl, {
        ...this._defaultOptions,
        method: 'DELETE',
      });
      if (res.ok) {
        const data = (await res.json()) as VehicleAttachment;
        return data;
      }
      return null;
    } catch (error) {
      console.error('Failed to delete vehicle image', error);
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
