import Subscriber from './Subscriber';
import VehicleChangeLogSubscriber from './VehicleChangeLogSubscriber';
import ChangelogSubscriber from './ChangelogSubscriber';
import AppLogSubscriber from './AppLogSubscriber';

// Add to list of subscribers here
export const subscribers: Subscriber[] = [
  new VehicleChangeLogSubscriber(),
  new ChangelogSubscriber(),
  new AppLogSubscriber(),
];
