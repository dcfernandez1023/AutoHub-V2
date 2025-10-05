import { Accordion, Button, Col, Row, Spinner, Table } from 'react-bootstrap';
import { useScheduledServiceTypes } from '../hooks/useScheduledService';
import useVehicles from '../hooks/useVehicles';
import ScheduledServiceInstanceTable from './ScheduledServiceInstanceTable';
import ScheduledServiceTypeModal from './ScheduledServiceTypeModal';
import { useState } from 'react';
import {
  ScheduledServiceInstance,
  ScheduledServiceType,
} from '../types/scheduledService';
import DeleteModal from './DeleteModal';
import ScheduledServiceInstanceModal from './ScheduledServiceInstanceModal';
import { Vehicle } from '../types/vehicle';

enum ScheduledServiceTypeModalState {
  CreateOrEditScheduledServiceType = 'CreateOrEditScheduledServiceType',
  DeleteScheduledServiceType = 'DeleteScheduledServiceType',
  ApplyScheduledServiceType = 'ApplyScheduledServiceType',
  EditScheduledServiceInstance = 'EditScheduledServiceInstance',
  DeleteScheduledServiceInstance = 'DeleteScheduledServiceInstance',
}

type VehiclesWithScheduledServiceInstances = {
  vehicle: Vehicle;
  scheduledServiceInstances: ScheduledServiceInstance[];
};

//
// Create
//
// Creating scheduled service type: Click 'Create' button --> Enter name --> Create Scheduled Service Type
// Apply Scheduled Service Types: Select vehicle --> Show Scheduled Service types that CAN be applied --> Enter mileage and time intervals for each scheduled service type --> Create scheduled service instances
const ScheduledServiceTypes: React.FC = () => {
  const {
    scheduledServiceTypes,
    loading: loadingScheduledServiceTypes,
    loadingAction: loadingScheduledServiceTypesAction,
    error,
    setError,
    createOrUpdateScheduledServiceType,
    deleteScheduledServiceType,
  } = useScheduledServiceTypes();
  const { vehicles, loading: loadingVehicles } = useVehicles();

  const [modalState, setModalState] =
    useState<ScheduledServiceTypeModalState>();
  const [selectedScheduledServiceType, setSelectedScheduledServiceType] =
    useState<ScheduledServiceType>();
  const [
    vehicleWithScheduledServiceInstances,
    setVehicleWithScheduledServiceInstances,
  ] = useState<VehiclesWithScheduledServiceInstances>();

  if (loadingScheduledServiceTypes || loadingVehicles) {
    return (
      <div className="centered-div">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <Row>
        <Col xs={8}>
          <h2>Scheduled Service Types</h2>
        </Col>
        <Col xs={4} className="align-right">
          <Button
            onClick={() => {
              setModalState(
                ScheduledServiceTypeModalState.CreateOrEditScheduledServiceType
              );
            }}
          >
            Create
          </Button>
        </Col>
      </Row>
      {!scheduledServiceTypes?.length ? (
        <div className="div-spacing">No scheduled service types</div>
      ) : (
        <div className="div-spacing">
          <Table responsive>
            <thead>
              <tr>
                <th style={{ minWidth: '200px' }}>Name</th>
                <th style={{ minWidth: '200px' }}></th>
              </tr>
            </thead>
            <tbody>
              {scheduledServiceTypes.map((scheduledServiceType) => {
                return (
                  <tr key={scheduledServiceType.id}>
                    <td className="scheduled-service-type-table-name vertical-align">
                      {scheduledServiceType.name}
                    </td>
                    <td className="align-right scheduled-service-type-table-actions">
                      <Button
                        className="button-group-spacing"
                        size="sm"
                        onClick={() => {
                          setModalState(
                            ScheduledServiceTypeModalState.CreateOrEditScheduledServiceType
                          );
                          setSelectedScheduledServiceType(scheduledServiceType);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        className="button-group-spacing"
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setModalState(
                            ScheduledServiceTypeModalState.DeleteScheduledServiceType
                          );
                          setSelectedScheduledServiceType(scheduledServiceType);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <div className="div-spacing-large">
            <h2>Apply to Vehicles</h2>
            <div className="div-spacing">
              {!vehicles?.length ? (
                <div>No vehicles</div>
              ) : (
                <Accordion>
                  {vehicles.map((vehicle) => {
                    return (
                      <Accordion.Item key={vehicle.id} eventKey={vehicle.id}>
                        <Accordion.Header>{vehicle.name}</Accordion.Header>
                        <Accordion.Body>
                          <ScheduledServiceInstanceTable
                            vehicle={vehicle}
                            scheduledServiceTypes={scheduledServiceTypes}
                            onEdit={() => {}}
                            onDelete={() => {}}
                          />
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
              )}
            </div>
          </div>
        </div>
      )}
      <ScheduledServiceTypeModal
        show={
          modalState ===
          ScheduledServiceTypeModalState.CreateOrEditScheduledServiceType
        }
        title="Scheduled Service Type"
        onClose={() => {
          setModalState(undefined);
          setError(undefined);
          setSelectedScheduledServiceType(undefined);
        }}
        loading={loadingScheduledServiceTypesAction}
        validationError={error}
        onSave={(name: string) => {
          void createOrUpdateScheduledServiceType(
            name,
            selectedScheduledServiceType?.id,
            (scheduledServiceType: ScheduledServiceType) => {
              setModalState(undefined);
              setError(undefined);
              setSelectedScheduledServiceType(undefined);
            }
          );
        }}
        scheduledServiceType={selectedScheduledServiceType}
      />
      <DeleteModal
        modalBody={
          modalState ===
          ScheduledServiceTypeModalState.DeleteScheduledServiceType
            ? 'Are you sure you want to delete this scheduled service type?'
            : ''
        }
        onDelete={
          modalState ===
            ScheduledServiceTypeModalState.DeleteScheduledServiceType &&
          selectedScheduledServiceType
            ? () =>
                deleteScheduledServiceType(
                  selectedScheduledServiceType?.id,
                  (scheduledServiceTypeId: string) => {
                    setModalState(undefined);
                    setError(undefined);
                    setSelectedScheduledServiceType(undefined);
                  }
                )
            : () => {}
        }
        show={
          modalState ===
          ScheduledServiceTypeModalState.DeleteScheduledServiceType
        }
        loading={loadingScheduledServiceTypesAction}
        title="Delete Scheduled Service Type"
        onClose={() => {
          setModalState(undefined);
          setError(undefined);
          setSelectedScheduledServiceType(undefined);
        }}
      />
    </div>
  );
};

export default ScheduledServiceTypes;
