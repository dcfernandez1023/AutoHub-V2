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
import DeleteVehicleModal from './DeleteVehicleModal';
import ShareVehicleModal from './ShareVehicleModal';

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
      <DeleteVehicleModal
        show={vehicleModalState === VehicleModalState.Delete}
        vehicleId={vehicle.id}
        title="Delete Vehicle"
        validationError={validationError}
        loading={modalActionLoading}
        onDelete={(vehicleId: string) => void handleDeleteVehice(vehicleId)}
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
    </div>
  );
};

export default Vehicle;
