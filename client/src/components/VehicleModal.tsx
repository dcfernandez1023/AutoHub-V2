import {
  Button,
  Col,
  FormControl,
  FormLabel,
  Modal,
  Row,
} from 'react-bootstrap';
import { ModalBaseProps } from '../types/modal';
import { CreateOrUpdateVehicle, Vehicle } from '../types/vehicle';
import useVehicleModal from '../hooks/useVehicleModal';
import AppAlert from './AppAlert';
import FileUpload from './FileUpload';

interface VehicleModalProps extends ModalBaseProps {
  existingVehicle?: Vehicle;
  loading?: boolean;
  onSave: (vehicle: CreateOrUpdateVehicle) => void;
}

const VehicleModal: React.FC<VehicleModalProps> = (
  props: VehicleModalProps
) => {
  const {
    show,
    title,
    onClose,
    validationError,
    existingVehicle,
    loading,
    onSave,
  } = props;

  const { vehicle, setVehicle, handleChange, handleImageUpload } =
    useVehicleModal({
      existingVehicle,
    });

  return (
    <Modal
      show={show}
      onHide={() => {
        if (existingVehicle) {
          setVehicle(existingVehicle);
        }
        onClose();
      }}
    >
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        {validationError ? <AppAlert message={validationError} /> : <></>}
        {!vehicle ? (
          <p>No vehicle chosen</p>
        ) : (
          <Row>
            <Col md={6}>
              <FormLabel htmlFor="vehicle-name">Name</FormLabel>
              <FormControl
                id="vehicle-name"
                value={vehicle.name}
                onChange={(e) => handleChange(e, 'string', 'name')}
              />
            </Col>
            <Col md={6}>
              <FormLabel htmlFor="vehicle-mileage">Mileage</FormLabel>
              <FormControl
                id="vehicle-mileage"
                value={vehicle.mileage}
                onChange={(e) => handleChange(e, 'number', 'mileage')}
              />
            </Col>
            <Col md={6}>
              <FormLabel htmlFor="vehicle-year">Year</FormLabel>
              <FormControl
                id="vehicle-year"
                value={vehicle.year}
                onChange={(e) => handleChange(e, 'number', 'year')}
              />
            </Col>
            <Col md={6}>
              <FormLabel htmlFor="vehicle-make">Make</FormLabel>
              <FormControl
                id="vehicle-make"
                value={vehicle.make}
                onChange={(e) => handleChange(e, 'string', 'make')}
              />
            </Col>
            <Col md={6}>
              <FormLabel htmlFor="vehicle-model">Model</FormLabel>
              <FormControl
                id="vehicle-model"
                value={vehicle.model}
                onChange={(e) => handleChange(e, 'string', 'model')}
              />
            </Col>
            <Col md={6}>
              <FormLabel htmlFor="vehicle-licensePlate">
                License Plate
              </FormLabel>
              <FormControl
                id="vehicle-licensePlate"
                value={vehicle.licensePlate}
                onChange={(e) => handleChange(e, 'string', 'licensePlate')}
              />
            </Col>
            <Col md={6}>
              <FormLabel htmlFor="vehicle-vin">VIN</FormLabel>
              <FormControl
                id="vehicle-vin"
                value={vehicle.vin}
                onChange={(e) => handleChange(e, 'string', 'vin')}
              />
            </Col>
            <Col xs={12}>
              <FileUpload
                accept="image/*"
                base64Preview={vehicle.base64Image}
                label="Image"
                handleChooseFile={(file: File) => {
                  handleImageUpload(file).catch(() => {
                    // TODO: Log and display error
                  });
                }}
              />
            </Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          disabled={loading}
          onClick={async () => {
            if (vehicle) {
              void onSave(vehicle);
            }
          }}
        >
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VehicleModal;
