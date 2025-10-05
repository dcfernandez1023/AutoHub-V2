import { ChangelogRequest, VehicleChangeLogRequest } from '../../types/changelog';
import * as changelogModel from '../../models/changelog';
import EventBus from '../EventBus';
import Subscriber from './Subscriber';

class ChangelogSubscriber extends Subscriber {
  subscribe(): void {
    this.off = EventBus.on('user:changelog:create', (payload: ChangelogRequest) => {
      const { userId, description } = payload;
      void changelogModel.default.createChangelog(userId, description).catch(() => {});
    });
  }

  unsubscribe(): void {
    if (this.off) {
      this.off();
    }
  }
}

export default ChangelogSubscriber;
