import { AppLogRequest } from '../../types/changelog';
import * as appLogModel from '../../models/appLog';
import EventBus from '../EventBus';
import Subscriber from './Subscriber';

class AppLogSubscriber extends Subscriber {
  subscribe(): void {
    this.off = EventBus.on('app:log:create', (payload: AppLogRequest) => {
      const { userId, event, duration, level, data } = payload;
      let serializedData = '';
      try {
        serializedData = JSON.stringify(data);
      } catch {
        serializedData = String(data);
      }
      appLogModel.default.createAppLog(userId, event, duration, level, serializedData).catch(() => {});
    });
  }

  unsubscribe(): void {
    if (this.off) {
      this.off();
    }
  }
}

export default AppLogSubscriber;
