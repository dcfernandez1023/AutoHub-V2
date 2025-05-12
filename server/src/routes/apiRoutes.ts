import { Router } from 'express';
import { register, completeRegistration, login, getUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  deleteVehicle,
  deleteVehicleAttachment,
  deleteVehicleShare,
  getVehicle,
  getVehicleAttachments,
  getVehicleChangelog,
  getVehicles,
  getVehicleShare,
  postVehicle,
  postVehicleAttachment,
  postVehicleShare,
  putVehicle,
} from '../controllers/vehicleController';
import { scopesMiddleware } from '../middleware/scopesMiddleware';
import { AUTH_SCOPES } from '../constants';
import {
  deleteScheduledServiceType,
  getScheduledServiceTypes,
  postScheduledServiceType,
  putScheduledServiceType,
} from '../controllers/scheduledServiceTypeController';
import {
  deleteScheduledServiceInstance,
  getVehicleScheduledServiceInstances,
  postScheduledServiceInstances,
  putScheduledServiceInstance,
} from '../controllers/scheduledServiceInstanceController';
import {
  deleteRepairLog,
  deleteScheduledLog,
  getVehicleRepairLogs,
  getVehicleScheduledLogs,
  postRepairLog,
  postScheduledLog,
  putRepairLogs,
  putScheduledLogs,
} from '../controllers/vehicleLogController';
import { getUpcomingMaintenance } from '../controllers/upcomingMaintenanceController';
import { postExport, postImport } from '../controllers/importExportController';

const router = Router();

// Register routes
router.post('/users/register', register);
router.get('/users/register/complete', completeRegistration);

// Login routes
router.post('/users/login', login);

// Import/Export
router.post('/users/:userId/import', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]), postImport);
router.post('/users/:userId/export', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]), postExport);

// Upcoming maintenance
router.get(
  '/users/:userId/upcomingMaintenance',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getUpcomingMaintenance
);
router.get(
  '/users/:userId/vehicles/:vehicleId/upcomingMaintenance',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getUpcomingMaintenance
);

// Scheduled service type routes
router.get(
  '/users/:userId/scheduledServiceTypes',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getScheduledServiceTypes
);
router.post(
  '/users/:userId/scheduledServiceTypes',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postScheduledServiceType
);
router.put(
  '/users/:userId/scheduledServiceTypes/:scheduledServiceTypeId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  putScheduledServiceType
);
router.delete(
  '/users/:userId/scheduledServiceTypes/:scheduledServiceTypeId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteScheduledServiceType
);

// Vehicle changelog
router.get(
  '/users/:userId/vehicles/:vehicleId/changelog',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleChangelog
);

// Vehicle share routes
router.post(
  '/users/:userId/vehicles/:vehicleId/share',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postVehicleShare
);
router.get(
  '/users/:userId/vehicles/:vehicleId/share',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleShare
);
router.delete(
  '/users/:userId/vehicles/:vehicleId/share',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteVehicleShare
);

// Vehicle attachments
router.delete(
  '/users/:userId/vehicles/:vehicleId/attachment/:attachmentId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteVehicleAttachment
);
router.get(
  '/users/:userId/vehicles/:vehicleId/attachments',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleAttachments
);
router.post(
  '/users/:userId/vehicles/:vehicleId/attachments',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postVehicleAttachment
);

// Scheduled Service Instances
router.post(
  '/users/:userId/vehicles/:vehicleId/scheduledServiceInstances',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postScheduledServiceInstances
);
router.get(
  '/users/:userId/vehicles/:vehicleId/scheduledServiceInstances',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleScheduledServiceInstances
);
router.put(
  '/users/:userId/vehicles/:vehicleId/scheduledServiceInstances/:scheduledServiceInstanceId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  putScheduledServiceInstance
);
router.delete(
  '/users/:userId/vehicles/:vehicleId/scheduledServiceInstances/:scheduledServiceInstanceId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteScheduledServiceInstance
);

// Scheduled Logs
router.delete(
  '/users/:userId/vehicles/:vehicleId/scheduledLogs/:scheduledLogId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  deleteScheduledLog
);
router.post(
  '/users/:userId/vehicles/:vehicleId/scheduledLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postScheduledLog
);
router.put(
  '/users/:userId/vehicles/:vehicleId/scheduledLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  putScheduledLogs
);
router.get(
  '/users/:userId/vehicles/:vehicleId/scheduledLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleScheduledLogs
);

// Repair logs
router.delete(
  '/users/:userId/vehicles/:vehicleId/repairLogs/:repairLogId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  deleteRepairLog
);

router.post(
  '/users/:userId/vehicles/:vehicleId/repairLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  postRepairLog
);
router.put(
  '/users/:userId/vehicles/:vehicleId/repairLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  putRepairLogs
);
router.get(
  '/users/:userId/vehicles/:vehicleId/repairLogs',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicleRepairLogs
);
// Vehicles
router.get(
  '/users/:userId/vehicles/:vehicleId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]),
  getVehicle
);
router.put(
  '/users/:userId/vehicles/:vehicleId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  putVehicle
);
router.delete(
  '/users/:userId/vehicles/:vehicleId',
  authMiddleware,
  scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]),
  deleteVehicle
);
router.get('/users/:userId/vehicles', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]), getVehicles);
router.post('/users/:userId/vehicles', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_WRITE]), postVehicle);

// User routes
router.get('/users/:userId/info', authMiddleware, scopesMiddleware([AUTH_SCOPES.AUTOHUB_READ]), getUser);

export default router;
