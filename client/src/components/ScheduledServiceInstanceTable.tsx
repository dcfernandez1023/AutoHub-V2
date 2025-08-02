import { Button, Col, Row, Spinner, Table } from 'react-bootstrap';
import { useScheduledServiceInstances } from '../hooks/useScheduledServiceInstances';
import {
  CreateScheduledServiceInstanceRequest,
  ScheduledServiceInstance,
  ScheduledServiceType,
} from '../types/scheduledService';
import ScheduledServiceInstanceModal from './ScheduledServiceInstanceModal';
import { useState } from 'react';
import { Vehicle } from '../types/vehicle';

type ScheduledServiceInstanceTableProps = {
  vehicle: Vehicle;
  scheduledServiceTypes: ScheduledServiceType[];
  onEdit: () => void;
  onDelete: () => void;
};

enum ModalState {
  Apply = 'Apply',
  Edit = 'Edit',
  Delete = 'Delete',
}

const ScheduledServiceInstanceTable: React.FC<
  ScheduledServiceInstanceTableProps
> = (props: ScheduledServiceInstanceTableProps) => {
  const { vehicle, scheduledServiceTypes, onEdit, onDelete } = props;
  const { id: vehicleId } = vehicle;

  const {
    loading,
    actionLoading,
    scheduledServiceInstances,
    error,
    setError,
    createScheduledServiceInstances,
    updateScheduledServiceInstance,
  } = useScheduledServiceInstances({ vehicleId });

  const [modalState, setModalState] = useState<ModalState>();
  const [
    selectedScheduledServiceInstance,
    setSelectedScheduledServiceInstance,
  ] = useState<ScheduledServiceInstance>();

  if (loading) {
    return <Spinner animation="border" />;
  }

  const getScheduledServiceTypeName = (scheduledServiceTypeId: string) => {
    return scheduledServiceTypes?.find(
      (scheduledServiceType) =>
        scheduledServiceType.id === scheduledServiceTypeId
    )?.name;
  };

  if (!scheduledServiceInstances) {
    return <div>No scheduled service instances</div>;
  }

  return (
    <div>
      <Row>
        <Col xs={6}>
          <span>ℹ️</span>
          <i>
            Click 'Apply' to assign a Scheduled Service Type to this vehicle
          </i>
        </Col>
        <Col xs={6} className="align-right">
          <Button
            size="sm"
            onClick={() => {
              setModalState(ModalState.Apply);
            }}
          >
            Apply
          </Button>
        </Col>
      </Row>
      <br />
      {scheduledServiceInstances.length ? (
        <Table>
          <thead>
            <tr>
              <th>Scheduled Service Type</th>
              <th>Mile Interval</th>
              <th>Time Interval</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {scheduledServiceInstances.map((scheduledServiceInstance) => {
              const scheduledServiceTypeName = getScheduledServiceTypeName(
                scheduledServiceInstance.scheduledServiceTypeId
              );
              if (scheduledServiceTypeName) {
                return (
                  <tr key={scheduledServiceInstance.id}>
                    <td className="vertical-align">
                      {scheduledServiceTypeName}
                    </td>
                    <td className="vertical-align">
                      {scheduledServiceInstance.mileInterval}
                    </td>
                    <td className="vertical-align">
                      {scheduledServiceInstance.timeInterval}{' '}
                      {scheduledServiceInstance.timeUnits}
                    </td>
                    <td className="align-right scheduled-service-type-table-actions">
                      <Button
                        className="button-group-spacing"
                        size="sm"
                        onClick={() => {
                          setSelectedScheduledServiceInstance(
                            scheduledServiceInstance
                          );
                          setModalState(ModalState.Edit);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        className="button-group-spacing"
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedScheduledServiceInstance(
                            scheduledServiceInstance
                          );
                          setModalState(ModalState.Delete);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              }

              return <></>;
            })}
          </tbody>
        </Table>
      ) : (
        <></>
      )}
      <ScheduledServiceInstanceModal
        action={modalState}
        onApply={(records: CreateScheduledServiceInstanceRequest[]) => {
          if (modalState === 'Apply') {
            void createScheduledServiceInstances(vehicleId, records, () =>
              setModalState(undefined)
            );
          }
        }}
        onEdit={(scheduledServiceInstance: ScheduledServiceInstance) => {
          if (modalState === 'Edit') {
            void updateScheduledServiceInstance(
              vehicleId,
              scheduledServiceInstance,
              () => {
                setModalState(undefined);
              }
            );
          }
        }}
        onDelete={(scheduledServiceInstance: ScheduledServiceInstance) => {
          if (modalState === 'Delete') {
            console.log('Deleting', scheduledServiceInstance);
          }
        }}
        show={
          modalState === ModalState.Apply ||
          modalState === ModalState.Edit ||
          modalState === ModalState.Delete
        }
        title={
          modalState === ModalState.Apply ? (
            <span>
              Apply Scheduled Service Types to <strong>{vehicle.name}</strong>
            </span>
          ) : modalState === ModalState.Edit ? (
            <span>
              Edit Scheduled Service Instance -{' '}
              <strong>
                {getScheduledServiceTypeName(
                  selectedScheduledServiceInstance?.scheduledServiceTypeId ?? ''
                )}
              </strong>
            </span>
          ) : modalState === ModalState.Delete ? (
            <span>
              Delete Scheduled Service Instance -{' '}
              <strong>
                {getScheduledServiceTypeName(
                  selectedScheduledServiceInstance?.scheduledServiceTypeId ?? ''
                )}
              </strong>
            </span>
          ) : (
            <></>
          )
        }
        onClose={() => {
          setModalState(undefined);
          setError(undefined);
        }}
        vehicle={vehicle}
        scheduledServiceTypes={scheduledServiceTypes}
        scheduledServiceInstances={scheduledServiceInstances}
        selectedScheduledServiceInstance={selectedScheduledServiceInstance}
        loading={actionLoading}
        validationError={error}
      />
    </div>
  );
};

export default ScheduledServiceInstanceTable;
