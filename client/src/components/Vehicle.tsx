import { useParams } from 'react-router-dom';
import useVehicles from '../hooks/useVehicles';
import NotFound from './NotFound';
import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Nav,
  Row,
  Spinner,
  Tab,
  Tabs,
} from 'react-bootstrap';
import VehicleTable from './VehicleTable';
import UpcomingMaintenance from './UpcomingMaintenance';
import useVehiclesActions, {
  VehicleModalState,
} from '../hooks/useVehiclesActions';
import {
  CreateOrUpdateVehicle,
  Vehicle as VehicleType,
} from '../types/vehicle';
import React from 'react';
import VehicleModal from './VehicleModal';
import DeleteModal from './DeleteModal';
import ShareVehicleModal from './ShareVehicleModal';
import NotesModal from './NotesModal';
import ScheduledLogTab from './ScheduledLog';
import RepairLogTab from './RepairLog';
import Changelog from './Changelog';
import useVehicleOwner from '../hooks/useVehicleOwner';
import Attachments from './Attachments';
import Analytics from './Analytics';

const Vehicle: React.FC = () => {
  const { vehicleId } = useParams();

  const { vehicle, loading, setVehicle } = useVehicles({ vehicleId });
  const {
    vehicleModalState,
    loading: modalActionLoading,
    validationError,
    setVehicleModalState,
    handleEditVehicle,
    handleDeleteVehice,
    setValidationError,
  } = useVehiclesActions();

  const { isOwner } = useVehicleOwner({ vehicle });

  if (loading) {
    return (
      <div className="centered-div">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!vehicle || !vehicleId) {
    return <NotFound />;
  }

  return (
    <Container fluid>
      <Tab.Container id="left-tabs-example" defaultActiveKey="info">
        <Row>
          <Col sm={4} md={2} style={{ marginBottom: '30px' }}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="info">Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="scheduled-log">Scheduled Log</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="repair-log">Repair Log</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="changelog">Changelog</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="attachments">Attachments</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="analytics">Analytics</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={8} md={10}>
            <Tab.Content>
              <Tab.Pane eventKey="info">
                <Row>
                  <Col>
                    <Row>
                      <Col xs={6}></Col>
                      <Col xs={6} className="align-right">
                        <DropdownButton title="Options">
                          <Dropdown.Item
                            onClick={() =>
                              setVehicleModalState(VehicleModalState.Edit)
                            }
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            disabled={!isOwner}
                            onClick={() =>
                              setVehicleModalState(VehicleModalState.Share)
                            }
                          >
                            Share
                          </Dropdown.Item>
                          <Dropdown.Item
                            disabled={!isOwner}
                            onClick={() =>
                              setVehicleModalState(VehicleModalState.Delete)
                            }
                          >
                            Delete
                          </Dropdown.Item>
                        </DropdownButton>
                      </Col>
                    </Row>
                    <VehicleTable
                      vehicle={vehicle}
                      onEditNotes={() =>
                        setVehicleModalState(VehicleModalState.Notes)
                      }
                      onRemoveImage={() =>
                        setVehicleModalState(VehicleModalState.DeleteImage)
                      }
                    />
                  </Col>
                </Row>
                <Row className="div-spacing">
                  <Col>
                    <UpcomingMaintenance vehicleId={vehicleId} />
                  </Col>
                </Row>
                <br />
              </Tab.Pane>
              <Tab.Pane eventKey="scheduled-log">
                <ScheduledLogTab vehicle={vehicle} />
              </Tab.Pane>
              <Tab.Pane eventKey="repair-log">
                <RepairLogTab vehicle={vehicle} />
              </Tab.Pane>
              <Tab.Pane eventKey="changelog">
                <Changelog vehicleId={vehicleId} />
              </Tab.Pane>
              <Tab.Pane eventKey="attachments">
                <Attachments vehicleId={vehicleId} />
              </Tab.Pane>
              <Tab.Pane eventKey="analytics">
                <Analytics vehicleId={vehicleId} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <VehicleModal
        show={vehicleModalState === VehicleModalState.Edit}
        title="Edit Vehicle"
        validationError={validationError}
        existingVehicle={vehicle}
        loading={modalActionLoading}
        onSave={(vehicle: CreateOrUpdateVehicle) =>
          void handleEditVehicle(
            vehicleId,
            vehicle,
            (updatedVehicle: VehicleType) => {
              setVehicle(updatedVehicle);
              setVehicleModalState(VehicleModalState.Hidden);
            }
          )
        }
        onClose={() => {
          setValidationError(undefined);
          setVehicleModalState(VehicleModalState.Hidden);
        }}
      />
      <DeleteModal
        show={
          vehicleModalState === VehicleModalState.Delete ||
          vehicleModalState === VehicleModalState.DeleteImage
        }
        title="Delete Vehicle"
        modalBody={
          vehicleModalState === VehicleModalState.Delete
            ? 'Are you sure you want to delete this vehicle?'
            : vehicleModalState === VehicleModalState.DeleteImage
              ? 'Are you sure you want to delete this image?'
              : ''
        }
        validationError={validationError}
        loading={modalActionLoading}
        onDelete={() => {
          if (vehicleModalState === VehicleModalState.Delete) {
            void handleDeleteVehice(vehicle.id);
          } else if (vehicleModalState === VehicleModalState.DeleteImage) {
            const vehicleWithDeletedImage = Object.assign({}, vehicle);
            vehicleWithDeletedImage.base64Image = '';
            void handleEditVehicle(
              vehicleId,
              vehicleWithDeletedImage,
              (updatedVehicle: VehicleType) => {
                setVehicle(updatedVehicle);
                setVehicleModalState(VehicleModalState.Hidden);
              }
            );
          }
        }}
        onClose={() => {
          setValidationError(undefined);
          setVehicleModalState(VehicleModalState.Hidden);
        }}
      />
      <ShareVehicleModal
        show={vehicleModalState === VehicleModalState.Share}
        vehicleId={vehicle.id}
        title="Share Vehicle"
        onClose={() => {
          setVehicleModalState(VehicleModalState.Hidden);
        }}
      />
      <NotesModal
        show={vehicleModalState === VehicleModalState.Notes}
        title="Vehicle Notes"
        onClose={() => setVehicleModalState(VehicleModalState.Hidden)}
        initialContent={vehicle.notes}
        loading={modalActionLoading}
        onSave={(content: string) => {
          const vehicleUpdate = Object.assign({}, vehicle);
          vehicleUpdate.notes = content;
          void handleEditVehicle(
            vehicleId,
            vehicleUpdate,
            (updatedVehicle: VehicleType) => {
              setVehicle(updatedVehicle);
              setVehicleModalState(VehicleModalState.Hidden);
            }
          );
        }}
      />
    </Container>
  );
};

export default Vehicle;
