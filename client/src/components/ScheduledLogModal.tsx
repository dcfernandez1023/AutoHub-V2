import {
  Modal,
  FormLabel,
  FormControl,
  Button,
  Row,
  Col,
} from 'react-bootstrap';
import { ModalBaseProps } from '../types/modal';
import { CreateScheduledLogRequest } from '../types/vehicleLog';
import AppAlert from './AppAlert';
import { useEffect, useState } from 'react';
import { Vehicle } from '../types/vehicle';
import ScheduledServiceInstanceSelector from './ScheduledServiceInstanceSelector';
import {
  ScheduledServiceInstance,
  ScheduledServiceType,
} from '../types/scheduledService';
import RichTextEditor from './RichTextEditor';
import DatePickerWrapper from './DatePickerWrapper';

interface ScheduledLogModalProps extends ModalBaseProps {
  vehicle: Vehicle;
  loading: boolean;
  scheduledServiceTypes: ScheduledServiceType[];
  scheduledServiceInstances: ScheduledServiceInstance[];
  onCreate: (createScheduledLogRequest: CreateScheduledLogRequest) => void;
}

const ScheduledLogModal: React.FC<ScheduledLogModalProps> = (
  props: ScheduledLogModalProps
) => {
  const {
    vehicle,
    title,
    show,
    loading,
    onCreate,
    onClose,
    validationError,
    scheduledServiceTypes,
    scheduledServiceInstances,
  } = props;

  const [createScheduledLogRequest, setCreateScheduledLogRequest] =
    useState<CreateScheduledLogRequest>();

  useEffect(() => {
    setCreateScheduledLogRequest({
      mileage: vehicle.mileage,
      partsCost: 0,
      laborCost: 0,
      totalCost: 0,
      notes: '',
      scheduledServiceInstanceId: '',
      datePerformed: new Date().getTime(),
    });
  }, [show]);

  const handleChange = (
    value: string,
    property: keyof CreateScheduledLogRequest,
    type: 'string' | 'number'
  ) => {
    const mutableCreateScheduledLogRequest = Object.assign(
      {},
      createScheduledLogRequest
    );
    if (type === 'string') {
      // @ts-ignore
      mutableCreateScheduledLogRequest[property] = value;
    } else if (type === 'number') {
      const intVal = value.length === 0 ? 0 : parseInt(value);
      if (!isNaN(intVal)) {
        // @ts-ignore
        mutableCreateScheduledLogRequest[property] = intVal;
      }
    }

    setCreateScheduledLogRequest(mutableCreateScheduledLogRequest);
  };

  if (!createScheduledLogRequest) {
    return <></>;
  }

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        {validationError ? <AppAlert message={validationError} /> : <></>}
        <Row className="g-3">
          <Col md={6}>
            <DatePickerWrapper
              pickerId="datePerformed"
              label="Date Performed"
              initialDate={new Date(createScheduledLogRequest.datePerformed)}
              onChange={(date: Date | null) => {
                if (date) {
                  handleChange(
                    date.getTime().toString(),
                    'datePerformed',
                    'number'
                  );
                }
              }}
            />
          </Col>
          <Col md={6}>
            <FormLabel htmlFor="mileage">Mileage Performed</FormLabel>
            <FormControl
              id="mileage"
              value={createScheduledLogRequest.mileage}
              onChange={(e) => {
                handleChange(e.target.value, 'mileage', 'number');
              }}
            />
          </Col>
          <Col md={6}>
            <FormLabel htmlFor="partsCost">Parts Cost</FormLabel>
            <FormControl
              id="partsCost"
              value={createScheduledLogRequest.partsCost}
              onChange={(e) => {
                handleChange(e.target.value, 'partsCost', 'number');
              }}
            />
          </Col>
          <Col md={6}>
            <FormLabel htmlFor="laborCost">Labor Cost</FormLabel>
            <FormControl
              id="laborCost"
              value={createScheduledLogRequest.laborCost}
              onChange={(e) => {
                handleChange(e.target.value, 'laborCost', 'number');
              }}
            />
          </Col>
          <Col md={6}>
            <FormLabel htmlFor="totalCost">Total Cost</FormLabel>
            <FormControl
              id="totalCost"
              value={createScheduledLogRequest.totalCost}
              onChange={(e) => {
                handleChange(e.target.value, 'totalCost', 'number');
              }}
            />
          </Col>
          <Col md={6}>
            <ScheduledServiceInstanceSelector
              selectorId="scheduledServiceInstanceId"
              scheduledServiceTypes={scheduledServiceTypes}
              scheduledServiceInstances={scheduledServiceInstances}
              onSelect={(scheduledServiceInstanceId: string) => {
                handleChange(
                  scheduledServiceInstanceId,
                  'scheduledServiceInstanceId',
                  'string'
                );
              }}
            />
          </Col>
          <Col md={12}>
            <FormLabel htmlFor="notes">Notes</FormLabel>
            <RichTextEditor
              existingContent={createScheduledLogRequest.notes}
              disabled={false}
              onSave={(content: string) => {
                handleChange(content, 'notes', 'string');
              }}
              height="200px"
              saveDebounce={1000}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          disabled={loading || !scheduledServiceInstances.length}
          onClick={async () => {
            void onCreate(createScheduledLogRequest);
          }}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScheduledLogModal;
