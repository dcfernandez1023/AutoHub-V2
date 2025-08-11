import { Vehicle } from '@prisma/client';
import { VehicleChangeLogRequest } from '../../types/changelog';
import EventBus from '../EventBus';
import { CreateOrUpdateVehicleRequest } from '../../types/vehicle';
import { date } from 'zod';

class VehicleChangeLogPublisher {
  static vehicleCreated(userId: string, username: string, vehicleId: string, vehicleName: string) {
    const description = `User ${username} created vehicle ${vehicleName}`;
    const payload: VehicleChangeLogRequest = {
      userId,
      vehicleId,
      description,
    };
    VehicleChangeLogPublisher.publish(payload);
  }

  static vehicleUpdated(
    userId: string,
    username: string,
    vehicleId: string,
    updateRequest: CreateOrUpdateVehicleRequest
  ) {
    try {
      const excludedKeys: (keyof Vehicle)[] = ['base64Image', 'notes'];
      const parts: string[] = [];
      let description = `User ${username} updated vehicle ${updateRequest.name}. Current changes:`;

      for (const key of Object.keys(updateRequest)) {
        if (!excludedKeys.includes(key as keyof CreateOrUpdateVehicleRequest)) {
          parts.push(`${key} = ${updateRequest[key as keyof CreateOrUpdateVehicleRequest]}`);
        } else {
          parts.push(`${key} = <REDACTED>`);
        }
      }

      description = `${description} ${parts.join(', ')}`;
      const payload: VehicleChangeLogRequest = {
        userId,
        vehicleId,
        description,
      };
      VehicleChangeLogPublisher.publish(payload);
    } catch (error) {
      // TODO: Log this somewhere
      console.error(error);
    }
  }

  static shareVehicle(
    ownerUserId: string,
    ownerUsername: string,
    sharedUsername: string,
    vehicleId: string,
    vehicleName: string
  ) {
    const description = `User ${ownerUsername} shared vehicle ${vehicleName} with ${sharedUsername}`;
    const payload: VehicleChangeLogRequest = {
      userId: ownerUserId,
      vehicleId,
      description,
    };
    VehicleChangeLogPublisher.publish(payload);
  }

  static appliedScheduledServiceTypes(
    userId: string,
    username: string,
    vehicleId: string,
    vehicleName: string,
    names: string[]
  ) {
    const description = `User ${username} applied scheduled service types to vehicle ${vehicleName}: ${names.join(', ')}`;
    const payload: VehicleChangeLogRequest = {
      userId,
      vehicleId,
      description,
    };
    VehicleChangeLogPublisher.publish(payload);
  }

  static unapplyScheduledServiceType(userId: string, username: string, vehicleId: string, vehicleName: string) {
    const description = `User ${username} unapplied a service type on vehicle ${vehicleName}`;
    const payload: VehicleChangeLogRequest = {
      userId,
      vehicleId,
      description,
    };
    VehicleChangeLogPublisher.publish(payload);
  }

  static scheduledLogCreated(
    userId: string,
    username: string,
    vehicleId: string,
    vehicleName: string,
    scheduledServiceTypeName: string | undefined,
    datePerformed: Date,
    mileagePerformed: number
  ) {
    const description = `User ${username} created scheduled log ${scheduledServiceTypeName ?? '<Could not be determined>'} on vehicle ${vehicleName}. Mileage performed: ${mileagePerformed} | Date Performed: ${datePerformed.toDateString()}`;
    const payload: VehicleChangeLogRequest = {
      userId,
      vehicleId,
      description,
    };
    VehicleChangeLogPublisher.publish(payload);
  }

  static scheduledLogsUpdated(
    userId: string,
    username: string,
    vehicleId: string,
    vehicleName: string,
    logCount: number
  ) {
    const description = `User ${username} updated ${logCount} scheduled logs on vehicle ${vehicleName}`;
    const payload: VehicleChangeLogRequest = {
      userId,
      vehicleId,
      description,
    };
    VehicleChangeLogPublisher.publish(payload);
  }

  static scheduledLogsDeleted(
    userId: string,
    username: string,
    vehicleId: string,
    vehicleName: string,
    logCount: number
  ) {
    const description = `User ${username} deleted ${logCount} scheduled logs on vehicle ${vehicleName}`;
    const payload: VehicleChangeLogRequest = {
      userId,
      vehicleId,
      description,
    };
    VehicleChangeLogPublisher.publish(payload);
  }

  static repairLogCreated(
    userId: string,
    username: string,
    vehicleId: string,
    vehicleName: string,
    repairLogName: string,
    datePerformed: Date,
    mileagePerformed: number
  ) {
    const description = `User ${username} created repair log ${repairLogName ?? '<Could not be determined>'} on vehicle ${vehicleName}. Mileage performed: ${mileagePerformed} | Date Performed: ${datePerformed.toDateString()}`;
    const payload: VehicleChangeLogRequest = {
      userId,
      vehicleId,
      description,
    };
    VehicleChangeLogPublisher.publish(payload);
  }

  static repairLogsUpdated(userId: string, username: string, vehicleId: string, vehicleName: string, logCount: number) {
    const description = `User ${username} updated ${logCount} repair logs on vehicle ${vehicleName}`;
    const payload: VehicleChangeLogRequest = {
      userId,
      vehicleId,
      description,
    };
    VehicleChangeLogPublisher.publish(payload);
  }

  static repairLogsDeleted(userId: string, username: string, vehicleId: string, vehicleName: string, logCount: number) {
    const description = `User ${username} deleted ${logCount} repair logs on vehicle ${vehicleName}`;
    const payload: VehicleChangeLogRequest = {
      userId,
      vehicleId,
      description,
    };
    VehicleChangeLogPublisher.publish(payload);
  }

  static publish(payload: VehicleChangeLogRequest) {
    console.log('emitting to eventbus', payload);
    EventBus.emit('vehicle:changelog:create', payload);
  }
}

export default VehicleChangeLogPublisher;
