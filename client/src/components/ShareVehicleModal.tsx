import {
  Button,
  Col,
  FormControl,
  FormLabel,
  ListGroup,
  ListGroupItem,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap';
import { ModalBaseProps } from '../types/modal';
import AppAlert from './AppAlert';
import useVehicleShareModal from '../hooks/useVehicleShareModal';
import Typeahead from './Typeahead';
import { User } from '../types/user';

interface ShareVehicleModal extends ModalBaseProps {
  vehicleId: string;
}

const ShareVehicleModal: React.FC<ShareVehicleModal> = (
  props: ShareVehicleModal
) => {
  const { vehicleId, show, title, onClose } = props;

  const {
    usersSharedWithVehicle,
    loading,
    error,
    userToShare,
    setError,
    setUserToShare,
    handeSearch,
    handleShare,
    handleDeleteShare,
  } = useVehicleShareModal({
    vehicleId,
    defer: !show,
  });

  const closeModal = () => {
    setError(undefined);
    setUserToShare(undefined);
    onClose();
  };

  return (
    <Modal show={show} onHide={() => closeModal()}>
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        {error ? <AppAlert message={error} /> : <></>}
        {!vehicleId ? (
          <p>No vehicle chosen</p>
        ) : (
          <Row>
            <Col>
              {loading ? (
                <Spinner animation="border" />
              ) : (
                <>
                  <FormLabel>Search Users</FormLabel>
                  <Typeahead<User>
                    debounce={200}
                    onSearch={async (searchText: string) => {
                      setUserToShare(undefined);
                      return await handeSearch(searchText);
                    }}
                    onSelect={(user: User) => {
                      setUserToShare(user);
                    }}
                    getLabel={(user: User) => user.username}
                  />
                </>
              )}
            </Col>
          </Row>
        )}
        <div className="div-spacing">
          {usersSharedWithVehicle?.length
            ? 'Currently shared with:'
            : 'ℹ️ This vehicle has not been shared'}
          <br />
          <ListGroup variant="flush">
            {usersSharedWithVehicle?.map((d) => {
              return (
                <ListGroupItem key={d.id}>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="remove-share-button"
                    onClick={() => {
                      handleDeleteShare(d.user.id);
                    }}
                  >
                    x
                  </Button>
                  {d.user.username}
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          disabled={!userToShare || loading}
          onClick={() => {
            if (userToShare?.id) {
              handleShare(userToShare.id).then((res) => {
                if (res) {
                  closeModal();
                } else {
                  setUserToShare(undefined);
                }
              });
            }
          }}
        >
          Share
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareVehicleModal;
