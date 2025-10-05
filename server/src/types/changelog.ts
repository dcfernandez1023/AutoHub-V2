import { AppLogLevel } from '@prisma/client';

export type VehicleChangeLogRequest = {
  vehicleId: string;
  userId: string;
  description: string;
};

export type ChangelogRequest = {
  userId: string;
  description: string;
};

export type AppLogRequest = {
  userId: string;
  event: string;
  duration: number;
  level: AppLogLevel;
  data: Record<string, any>;
};

export enum APP_LOG_EVENTS {
  VEHICLE_CREATED = 'Vehicle Created',
  VEHICE_UPDATED = 'Vehicle Updated',
  VEHICLE_DELETED = 'Vehicle Deleted',
  VEHICLES_READ = 'Vehicles Read',
  VEHICLE_READ = 'Vehicle Read',
  VEHICLE_SHARED = 'Vehicle Shared',
  VEHICLE_ATTACHMENT_CREATED = 'Vehicle Attachment Created',
  VEHICLE_SHARES_READ = 'Vehicle Shares Read',
  VEHICLE_SHARE_READ = 'Vehicle Share Read',
  VEHICLE_UNSHARED = 'Vehicle Unshared',
  SHARED_VEHICLES_READ = 'Shared Vehicles Read',
  VEHICLE_ATTACHMENT_DELETED = 'Vehicle Attachment Deleted',
  VEHICLE_ATTACHMENTS_READ = 'Vehicle Attachments Read',
  VEHICLE_CHANGELOG_READ = 'Vehicle Changelog Read',
  DOWNLOAD_ATTACHMENT = 'Download Attachment',
}
