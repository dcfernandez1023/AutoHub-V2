import { VehicleChangeLogRequest } from '../../types/changelog';
import * as vehicleChangelogModel from '../../models/vehicleChangelog';
import EventBus from '../EventBus';
import Subscriber from './Subscriber';

class VehicleChangeLogSubscriber extends Subscriber {
  subscribe(): void {
    this.off = EventBus.on('vehicle:changelog:create', (payload: VehicleChangeLogRequest) => {
      const { vehicleId, userId, description } = payload;
      void vehicleChangelogModel.default.createVehicleChangelog(vehicleId, userId, description).catch((err) => {
        // TODO: Log this somewhere
      });
    });
  }

  unsubscribe(): void {
    if (this.off) {
      this.off();
    }
  }
}

export default VehicleChangeLogSubscriber;
