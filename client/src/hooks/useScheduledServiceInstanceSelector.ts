import { useEffect, useState } from 'react';
import {
  ScheduledServiceInstance,
  ScheduledServiceType,
} from '../types/scheduledService';

interface UseScheduledServiceInstanceSelectorProps {
  scheduledServiceTypes: ScheduledServiceType[];
  scheduledServiceInstances: ScheduledServiceInstance[];
}

export type GroupedScheduledServiceInstances = {
  [id: string]: ScheduledServiceInstance;
};

export type SelectorRecord = {
  scheduledServiceType: ScheduledServiceType;
  scheduledServiceInstance: ScheduledServiceInstance;
};

const useScheduledServiceInstanceSelector = (
  props: UseScheduledServiceInstanceSelectorProps
) => {
  const { scheduledServiceTypes, scheduledServiceInstances } = props;

  const [selectorRecords, setSelectorRecords] = useState<SelectorRecord[]>([]);
  const [
    groupedScheduledServiceInstances,
    setGroupedScheduledServiceInstances,
  ] = useState<GroupedScheduledServiceInstances>({});

  useEffect(() => {
    const grouped: GroupedScheduledServiceInstances = {};
    for (const ssi of scheduledServiceInstances) {
      grouped[ssi.scheduledServiceTypeId] = ssi;
    }

    const applicableRecords: SelectorRecord[] = [];
    for (const sst of scheduledServiceTypes) {
      const ssi = grouped[sst.id];
      if (ssi) {
        applicableRecords.push({
          scheduledServiceType: sst,
          scheduledServiceInstance: ssi,
        });
      }
    }

    setGroupedScheduledServiceInstances(grouped);
    setSelectorRecords(applicableRecords);
  }, [scheduledServiceTypes, scheduledServiceInstances]);

  return {
    selectorRecords,
    groupedScheduledServiceInstances,
  };
};

export default useScheduledServiceInstanceSelector;
