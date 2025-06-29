import { Button, Col, Modal, Row } from 'react-bootstrap';
import { ModalBaseProps } from '../types/modal';
import AppAlert from './AppAlert';

interface DeleteVehicleModalProps extends ModalBaseProps {
  loading?: boolean;
  vehicleId: string;
  onDelete: (vehicleId: string) => void;
}

const DeleteVehicleModal: React.FC<DeleteVehicleModalProps> = (
  props: DeleteVehicleModalProps
) => {
  const {
    vehicleId,
    show,
    title,
    onClose,
    validationError,
    loading,
    onDelete,
  } = props;

  return (
    <Modal
      show={show}
      onHide={() => {
        onClose();
      }}
    >
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        {validationError ? <AppAlert message={validationError} /> : <></>}
        {!vehicleId ? (
          <p>No vehicle chosen</p>
        ) : (
          <Row>
            <Col>Are you sure you want to delete this vehicle?</Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          disabled={loading}
          onClick={() => {
            if (vehicleId) {
              void onDelete(vehicleId);
            }
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteVehicleModal;
