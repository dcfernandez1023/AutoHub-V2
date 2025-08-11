import {
  Modal,
  FormLabel,
  FormControl,
  Button,
  Row,
  Col,
} from 'react-bootstrap';
import { ModalBaseProps } from '../types/modal';
import { CreateRepairLogRequest } from '../types/vehicleLog';
import AppAlert from './AppAlert';
import { useEffect, useState } from 'react';
import { Vehicle } from '../types/vehicle';
import RichTextEditor from './RichTextEditor';
import DatePickerWrapper from './DatePickerWrapper';

interface RepairLogModalProps extends ModalBaseProps {
  vehicle: Vehicle;
  loading: boolean;
  onCreate: (createRepairLogRequest: CreateRepairLogRequest) => void;
}

const RepairLogModal: React.FC<RepairLogModalProps> = (
  props: RepairLogModalProps
) => {
  const { vehicle, title, show, loading, onCreate, onClose, validationError } =
    props;

  const [createRepairLogRequest, setCreateRepairLogRequest] =
    useState<CreateRepairLogRequest>();

  useEffect(() => {
    setCreateRepairLogRequest({
      mileage: vehicle.mileage,
      partsCost: 0,
      laborCost: 0,
      totalCost: 0,
      notes: '',
      name: '',
      datePerformed: new Date().getTime(),
    });
  }, [show]);

  const handleChange = (
    value: string,
    property: keyof CreateRepairLogRequest,
    type: 'string' | 'number'
  ) => {
    const mutableCreateRepairLogRequest = Object.assign(
      {},
      createRepairLogRequest
    );
    if (type === 'string') {
      // @ts-ignore
      mutableCreateRepairLogRequest[property] = value;
    } else if (type === 'number') {
      const intVal = value.length === 0 ? 0 : parseInt(value);
      if (!isNaN(intVal)) {
        // @ts-ignore
        mutableCreateRepairLogRequest[property] = intVal;
      }
    }

    setCreateRepairLogRequest(mutableCreateRepairLogRequest);
  };

  if (!createRepairLogRequest) {
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
              initialDate={new Date(createRepairLogRequest.datePerformed)}
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
              value={createRepairLogRequest.mileage}
              onChange={(e) => {
                handleChange(e.target.value, 'mileage', 'number');
              }}
            />
          </Col>
          <Col md={6}>
            <FormLabel htmlFor="partsCost">Parts Cost</FormLabel>
            <FormControl
              id="partsCost"
              value={createRepairLogRequest.partsCost}
              onChange={(e) => {
                handleChange(e.target.value, 'partsCost', 'number');
              }}
            />
          </Col>
          <Col md={6}>
            <FormLabel htmlFor="laborCost">Labor Cost</FormLabel>
            <FormControl
              id="laborCost"
              value={createRepairLogRequest.laborCost}
              onChange={(e) => {
                handleChange(e.target.value, 'laborCost', 'number');
              }}
            />
          </Col>
          <Col md={6}>
            <FormLabel htmlFor="totalCost">Total Cost</FormLabel>
            <FormControl
              id="totalCost"
              value={createRepairLogRequest.totalCost}
              onChange={(e) => {
                handleChange(e.target.value, 'totalCost', 'number');
              }}
            />
          </Col>
          <Col md={6}>
            <FormLabel htmlFor="serviceName">Service Name</FormLabel>
            <FormControl
              id="serviceName"
              value={createRepairLogRequest.name}
              onChange={(e) => {
                handleChange(e.target.value, 'name', 'string');
              }}
            />
          </Col>
          <Col md={12}>
            <FormLabel htmlFor="notes">Notes</FormLabel>
            <RichTextEditor
              existingContent={createRepairLogRequest.notes}
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
          disabled={loading}
          onClick={async () => {
            void onCreate(createRepairLogRequest);
          }}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RepairLogModal;
