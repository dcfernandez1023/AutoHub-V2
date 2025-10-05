import { AppLogRequest } from '../../types/changelog';
import EventBus from '../EventBus';

class AppLogPublisher {
  static logEvent(appLog: AppLogRequest) {
    AppLogPublisher.publish(appLog);
  }

  static publish(payload: AppLogRequest) {
    EventBus.emit('app:log:create', payload);
  }
}

export default AppLogPublisher;
