import { AppLogRequest, VehicleChangeLogRequest } from '../types/changelog';
import { ChangelogRequest } from '../types/changelog';

// Define all app events here
export type AppEvents = {
  'vehicle:changelog:create': VehicleChangeLogRequest;
  'user:changelog:create': ChangelogRequest;
  'app:log:create': AppLogRequest;
};
