import { useParams } from 'react-router-dom';
import useVehicles from '../hooks/useVehicles';
import NotFound from './NotFound';
import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
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

  const VehicleChangelog = () => {
    return (
      <Row>
        <Col>Vehicle Changelog</Col>
      </Row>
    );
  };

  const VehicleScheduledLog = () => {
    return (
      <Row>
        <Col>Scheduled Log</Col>
      </Row>
    );
  };

  const VehicleRepairLog = () => {
    return (
      <Row>
        <Col>Repair Log</Col>
      </Row>
    );
  };

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
    <div>
      <Tabs
        defaultActiveKey="info"
        mountOnEnter={true}
        unmountOnExit={false}
        fill
      >
        <Tab eventKey="info" title="Info" className="div-spacing">
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
                      onClick={() =>
                        setVehicleModalState(VehicleModalState.Share)
                      }
                    >
                      Share
                    </Dropdown.Item>
                    <Dropdown.Item
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
        </Tab>
        <Tab
          eventKey="scheduled-log"
          title="Scheduled Log"
          className="div-spacing"
        >
          <VehicleScheduledLog />
        </Tab>
        <Tab eventKey="repair-log" title="Repair Log" className="div-spacing">
          <VehicleRepairLog />
        </Tab>
        <Tab eventKey="changelog" title="Changelog" className="div-spacing">
          <VehicleChangelog />
        </Tab>
        <Tab eventKey="attachments" title="Attachments" className="div-spacing">
          <VehicleChangelog />
        </Tab>
      </Tabs>

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
        onSave={async (content: string) => {
          const vehicleUpdate = Object.assign({}, vehicle);
          vehicleUpdate.notes = content;
          await handleEditVehicle(
            vehicleId,
            vehicleUpdate,
            (updatedVehicle: VehicleType) => {
              setVehicle(updatedVehicle);
              setVehicleModalState(VehicleModalState.Hidden);
            }
          );
        }}
      />
    </div>
  );
};

export default Vehicle;
