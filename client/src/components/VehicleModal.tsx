import { Modal } from 'react-bootstrap';
import { ModalBaseProps } from '../types/modal';
import { Vehicle } from '../types/vehicle';

interface VehicleModalProps extends ModalBaseProps {
  vehicle?: Vehicle;
}

const VehicleModal: React.FC<VehicleModalProps> = (
  props: VehicleModalProps
) => {
  const { show, onClose } = props;
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Body>Create Vehicle Modal</Modal.Body>
      </Modal.Header>
    </Modal>
  );
};

export default VehicleModal;
