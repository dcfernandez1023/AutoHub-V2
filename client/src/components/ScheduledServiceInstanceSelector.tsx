import { useEffect, useState } from 'react';
import { FormLabel, FormSelect } from 'react-bootstrap';
import useScheduledServiceInstanceSelector, {
  SelectorRecord,
} from '../hooks/useScheduledServiceInstanceSelector';
import {
  ScheduledServiceInstance,
  ScheduledServiceType,
} from '../types/scheduledService';

type PreviewConfig = {
  disabled: boolean;
  previewSelectedId: string;
};

interface ScheduledServiceInstanceSelectorProps {
  scheduledServiceTypes: ScheduledServiceType[];
  scheduledServiceInstances: ScheduledServiceInstance[];
  selectorId: string;
  previewConfig?: PreviewConfig;
  small?: boolean;
  onSelect: (scheduledServiceInstanceId: string) => void;
}

const ScheduledServiceInstanceSelector: React.FC<
  ScheduledServiceInstanceSelectorProps
> = (props: ScheduledServiceInstanceSelectorProps) => {
  const { selectorId, previewConfig, small, onSelect } = props;
  const { selectorRecords } = useScheduledServiceInstanceSelector(props);

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // Set default to the first option when records load
  useEffect(() => {
    if (previewConfig) {
      setSelectedId(previewConfig.previewSelectedId);
    } else if (selectorRecords.length > 0 && !selectedId) {
      const firstId = selectorRecords[0].scheduledServiceInstance.id;
      setSelectedId(firstId);
      onSelect(firstId);
    }
  }, [selectorRecords, selectedId]);

  return (
    <>
      {previewConfig ? (
        <></>
      ) : (
        <FormLabel htmlFor={selectorId}>Scheduled Service Type</FormLabel>
      )}
      <FormSelect
        id={selectorId}
        size={small ? 'sm' : undefined}
        value={selectedId}
        disabled={previewConfig?.disabled}
        onChange={(e) => {
          const newId = e.currentTarget.value;
          setSelectedId(newId);
          onSelect(newId);
        }}
      >
        {selectorRecords.map(
          ({ scheduledServiceInstance, scheduledServiceType }) => (
            <option
              key={scheduledServiceInstance.id}
              value={scheduledServiceInstance.id}
            >
              {scheduledServiceType.name}
            </option>
          )
        )}
      </FormSelect>
    </>
  );
};

export default ScheduledServiceInstanceSelector;
