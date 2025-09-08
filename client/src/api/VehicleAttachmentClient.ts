import { UpcomingMaintenance } from '../types/upcomingManitenance';
import {
  CreateAttachmentResponse,
  CreateOrUpdateVehicle,
  UserSharedWithVehicle,
  Vehicle,
  VehicleAttachment,
  VehicleAttachmentRaw,
  VehicleShare,
} from '../types/vehicle';
import { getApiBaseUrl } from '../utils/url';
import BaseClient from './BaseClient';

class VehicleAttachmentClient extends BaseClient {
  private _baseUrl;

  private static _instance: VehicleAttachmentClient;

  private constructor() {
    super();
    this._baseUrl = getApiBaseUrl();
  }

  async getAttachments(
    userId: string,
    vehicleId: string
  ): Promise<VehicleAttachmentRaw[]> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/attachments`;
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'GET',
    });
    if (res.ok) {
      const data = await res.json();
      return data as VehicleAttachmentRaw[];
    }
    throw new Error(
      `Failed to get vehicle attachments. Status code: ${res.status}`
    );
  }

  async createAttachment(userId: string, vehicleId: string, file: File) {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/attachments`;

    const form = new FormData();
    form.append('file', file);

    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      method: 'POST',
      body: form,
    });
    if (res.ok) {
      const data = await res.json();
      return data as VehicleAttachmentRaw;
    }
    throw new Error(
      `Failed to create vehicle attachments. Status code: ${res.status}`
    );
  }

  async deleteAttachment(
    userId: string,
    vehicleId: string,
    attachmentId: string
  ) {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/attachments/${attachmentId}`;

    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      headers: this._defaultHeaders,
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      return data as VehicleAttachmentRaw;
    }
    throw new Error(
      `Failed to delete vehicle attachments. Status code: ${res.status}`
    );
  }

  async download(
    userId: string,
    vehicleId: string,
    attachmentId: string
  ): Promise<void> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/vehicles/${vehicleId}/attachments/${attachmentId}/download`;
    window.open(requestUrl, '_blank');
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new VehicleAttachmentClient();
    }

    return this._instance;
  }
}

export default VehicleAttachmentClient.instance;
