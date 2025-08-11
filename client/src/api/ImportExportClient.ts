import { ImportResult } from '../types/importExport';
import { getApiBaseUrl } from '../utils/url';
import BaseClient from './BaseClient';

class ImportExportClient extends BaseClient {
  private _baseUrl: string;

  private static _instance: ImportExportClient;

  private constructor() {
    super();
    this._baseUrl = getApiBaseUrl();
  }

  async doExport(userId: string): Promise<void> {
    window.open(`${this._baseUrl}/api/users/${userId}/export`);
  }

  async doImport(userId: string, file: File): Promise<ImportResult> {
    const requestUrl = `${this._baseUrl}/api/users/${userId}/import`;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(requestUrl, {
      ...this._defaultOptions,
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Failed to import data. Status code: ${res.status}`);
    }

    return (await res.json()) as ImportResult;
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new ImportExportClient();
    }

    return this._instance;
  }
}

export default ImportExportClient.instance;
