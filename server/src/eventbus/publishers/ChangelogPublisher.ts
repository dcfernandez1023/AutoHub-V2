import { ChangelogRequest } from '../../types/changelog';
import EventBus from '../EventBus';

class ChangelogPublisher {
  static registrationCompleted(userId: string) {
    const description = `Account registration completed`;
    const payload: ChangelogRequest = {
      userId,
      description,
    };
    ChangelogPublisher.publish(payload);
  }

  static login(userId: string, ipAddress: string | undefined) {
    const description = `Logged in successfully (IP: ${ipAddress ?? '<Could not be determined>'})`;
    const payload: ChangelogRequest = {
      userId,
      description,
    };
    ChangelogPublisher.publish(payload);
  }

  static scheduledServiceTypeCreated(userId: string, name: string) {
    const description = `Created scheduled service type with name ${name}`;
    const payload: ChangelogRequest = {
      userId,
      description,
    };
    ChangelogPublisher.publish(payload);
  }

  static scheduledServiceTypeUpdated(userId: string, name: string) {
    const description = `Updated scheduled service type to name ${name}`;
    const payload: ChangelogRequest = {
      userId,
      description,
    };
    ChangelogPublisher.publish(payload);
  }

  static scheduledServiceTypeDeleted(userId: string, name: string) {
    const description = `Deleted scheduled service type ${name}`;
    const payload: ChangelogRequest = {
      userId,
      description,
    };
    ChangelogPublisher.publish(payload);
  }

  static vehicleDeleted(userId: string, username: string, vehicleName: string) {
    const description = `User ${username} deleted vehicle ${vehicleName}`;
    const payload: ChangelogRequest = {
      userId,
      description,
    };
    ChangelogPublisher.publish(payload);
  }

  static publish(payload: ChangelogRequest) {
    console.log('emitting to eventbus', payload);
    EventBus.emit('user:changelog:create', payload);
  }
}

export default ChangelogPublisher;
