import {
  Button,
  Col,
  FormControl,
  FormLabel,
  FormSelect,
  ListGroup,
  ListGroupItem,
  Modal,
  Row,
} from 'react-bootstrap';
import { ModalBaseProps } from '../types/modal';
import AppAlert from './AppAlert';
import { JSX, useEffect, useState } from 'react';
import {
  CreateScheduledServiceInstanceRequest,
  ScheduledServiceInstance,
  ScheduledServiceType,
} from '../types/scheduledService';
import { Vehicle } from '../types/vehicle';

type Action = 'Apply' | 'Edit' | 'Delete';

interface ScheduledServiceInstanceModalProps extends ModalBaseProps {
  loading?: boolean;
  action: Action | undefined;
  vehicle: Vehicle;
  scheduledServiceTypes: ScheduledServiceType[];
  scheduledServiceInstances: ScheduledServiceInstance[];
  selectedScheduledServiceInstance: ScheduledServiceInstance | undefined;
  onApply: (records: CreateScheduledServiceInstanceRequest[]) => void;
  onEdit: (scheduledServiceInstance: ScheduledServiceInstance) => void;
  onDelete: (scheduledServiceInstance: ScheduledServiceInstance) => void;
}

type IntervalMap = {
  [id: string]: {
    mileInterval: number;
    timeInterval: number;
    timeUnits: string;
  };
};

type ApplyContentProps = {
  scheduledServiceTypes: ScheduledServiceType[];
  scheduledServiceInstances: ScheduledServiceInstance[];
  intervalMap: IntervalMap;
  setIntervalMap: (intervalMap: IntervalMap) => void;
};

type EditContentProps = {
  scheduledServiceInstance: ScheduledServiceInstance | undefined;
  setScheduledServiceInstance: (
    scheduledServiceInstance: ScheduledServiceInstance
  ) => void;
};

type DeleteContentProps = {
  vehicleName: string;
};

const DeleteContent: React.FC<DeleteContentProps> = (
  props: DeleteContentProps
) => {
  const { vehicleName } = props;

  return (
    <p>
      Are you sure you want to delete this scheduled service instance from{' '}
      <strong>{vehicleName}</strong>?
    </p>
  );
};

const EditContent: React.FC<EditContentProps> = (props: EditContentProps) => {
  const { scheduledServiceInstance, setScheduledServiceInstance } = props;

  if (!scheduledServiceInstance) {
    return <></>;
  }

  return (
    <Row>
      <Col xs={4}>
        <FormLabel>Mile Interval</FormLabel>
        <FormControl
          size="sm"
          value={scheduledServiceInstance?.mileInterval ?? 0}
          onChange={(e) => {
            const intVal =
              e.target.value.trim().length === 0 ? 0 : parseInt(e.target.value);
            const mutableScheduledServiceInstance = Object.assign(
              {},
              scheduledServiceInstance
            );
            if (!isNaN(intVal)) {
              mutableScheduledServiceInstance.mileInterval = intVal;
            }
            setScheduledServiceInstance(mutableScheduledServiceInstance);
          }}
        />
      </Col>
      <Col xs={8}>
        <FormLabel>Time Interval</FormLabel>
        <div className="d-flex gap-2">
          <FormControl
            size="sm"
            value={scheduledServiceInstance?.timeInterval ?? 0}
            onChange={(e) => {
              const intVal =
                e.target.value.trim().length === 0
                  ? 0
                  : parseInt(e.target.value);
              const mutableScheduledServiceInstance = Object.assign(
                {},
                scheduledServiceInstance
              );
              if (!isNaN(intVal)) {
                mutableScheduledServiceInstance.timeInterval = intVal;
              }
              setScheduledServiceInstance(mutableScheduledServiceInstance);
            }}
          />
          <FormSelect
            size="sm"
            value={scheduledServiceInstance?.timeUnits ?? 'DAY'}
            onChange={(e) => {
              const mutableScheduledServiceInstance = Object.assign(
                {},
                scheduledServiceInstance
              );
              mutableScheduledServiceInstance.timeUnits = e.target.value;
              setScheduledServiceInstance(mutableScheduledServiceInstance);
            }}
          >
            <option value="DAY">Days</option>
            <option value="WEEK">Weeks</option>
            <option value="MONTH">Months</option>
            <option value="YEAR">Years</option>
          </FormSelect>
        </div>
      </Col>
    </Row>
  );
};

const ApplyContent: React.FC<ApplyContentProps> = (
  props: ApplyContentProps
) => {
  const {
    scheduledServiceTypes,
    scheduledServiceInstances,
    intervalMap,
    setIntervalMap,
  } = props;

  const [sharedMileInterval, setSharedMileInterval] = useState<number>(0);
  const [sharedTimeInterval, setSharedTimeInterval] = useState<number>(0);
  const [sharedTimeUnits, setSharedTimeUnits] = useState<string>();

  return (
    <div>
      <br />
      <span className="d-flex align-items-center w-100 gap-1">
        Every
        <div className="flex-grow-1" style={{ maxWidth: '100px' }}>
          <FormControl
            size="sm"
            value={sharedMileInterval}
            onChange={(e) => {
              const intVal =
                e.target.value.trim().length === 0
                  ? 0
                  : parseInt(e.target.value);
              if (!isNaN(intVal)) {
                setSharedMileInterval(intVal);
              }
            }}
          />
        </div>
        miles or
        <div className="flex-grow-1" style={{ maxWidth: '100px' }}>
          <FormControl
            size="sm"
            value={sharedTimeInterval}
            onChange={(e) => {
              const intVal =
                e.target.value.trim().length === 0
                  ? 0
                  : parseInt(e.target.value);
              if (!isNaN(intVal)) {
                setSharedTimeInterval(intVal);
              }
            }}
          />
        </div>
        <div className="flex-grow-1">
          <FormSelect
            size="sm"
            value={sharedTimeUnits}
            onChange={(e) => setSharedTimeUnits(e.currentTarget.value)}
          >
            <option value="DAY">Days</option>
            <option value="WEEK">Weeks</option>
            <option value="MONTH">Months</option>
            <option value="YEAR">Years</option>
          </FormSelect>
        </div>
      </span>
      <div style={{ textAlign: 'right', marginTop: '8px' }}>
        <Button
          size="sm"
          variant="success"
          onClick={() => {
            const mutableIntervalMap = Object.assign({}, intervalMap);
            const scheduledServiceTypeIds = Object.keys(intervalMap);
            for (const scheduledServiceTypeId of scheduledServiceTypeIds) {
              mutableIntervalMap[scheduledServiceTypeId].mileInterval =
                sharedMileInterval ?? 0;
              mutableIntervalMap[scheduledServiceTypeId].timeInterval =
                sharedTimeInterval ?? 0;
              mutableIntervalMap[scheduledServiceTypeId].timeUnits =
                sharedTimeUnits ?? 'DAY';
            }
            setIntervalMap(mutableIntervalMap);
          }}
        >
          Apply
        </Button>
      </div>
      <br />
      <ListGroup>
        {scheduledServiceTypes.map((sst) => {
          return (
            <ListGroupItem>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{sst.name}</p>
              <Row>
                <Col xs={4}>
                  <FormLabel>Mile Interval</FormLabel>
                  <FormControl
                    size="sm"
                    value={intervalMap[sst.id]?.mileInterval ?? 0}
                    onChange={(e) => {
                      const intVal =
                        e.target.value.trim().length === 0
                          ? 0
                          : parseInt(e.target.value);
                      const mutableIntervalMap = Object.assign({}, intervalMap);
                      if (!mutableIntervalMap[sst.id]) {
                        mutableIntervalMap[sst.id] = {
                          mileInterval: 0,
                          timeInterval: 0,
                          timeUnits: 'DAY',
                        };
                      }
                      if (!isNaN(intVal)) {
                        mutableIntervalMap[sst.id].mileInterval = intVal;
                      }
                      setIntervalMap(mutableIntervalMap);
                    }}
                  />
                </Col>
                <Col xs={8}>
                  <FormLabel>Time Interval</FormLabel>
                  <div className="d-flex gap-2">
                    <FormControl
                      size="sm"
                      value={intervalMap[sst.id]?.timeInterval ?? 0}
                      onChange={(e) => {
                        const intVal =
                          e.target.value.trim().length === 0
                            ? 0
                            : parseInt(e.target.value);
                        const mutableIntervalMap = Object.assign(
                          {},
                          intervalMap
                        );
                        if (!mutableIntervalMap[sst.id]) {
                          mutableIntervalMap[sst.id] = {
                            mileInterval: 0,
                            timeInterval: 0,
                            timeUnits: 'DAY',
                          };
                        }
                        if (!isNaN(intVal)) {
                          mutableIntervalMap[sst.id].timeInterval = intVal;
                        }
                        setIntervalMap(mutableIntervalMap);
                      }}
                    />
                    <FormSelect
                      size="sm"
                      value={intervalMap[sst.id]?.timeUnits ?? 'DAY'}
                      onChange={(e) => {
                        const mutableIntervalMap = Object.assign(
                          {},
                          intervalMap
                        );
                        if (!mutableIntervalMap[sst.id]) {
                          mutableIntervalMap[sst.id] = {
                            mileInterval: 0,
                            timeInterval: 0,
                            timeUnits: 'DAY',
                          };
                        }
                        mutableIntervalMap[sst.id].timeUnits =
                          e.currentTarget.value;
                        setIntervalMap(mutableIntervalMap);
                      }}
                    >
                      <option value="DAY">Days</option>
                      <option value="WEEK">Weeks</option>
                      <option value="MONTH">Months</option>
                      <option value="YEAR">Years</option>
                    </FormSelect>
                  </div>
                </Col>
              </Row>
              <br />
            </ListGroupItem>
          );
        })}
      </ListGroup>
    </div>
  );
};

const ScheduledServiceInstanceModal: React.FC<
  ScheduledServiceInstanceModalProps
> = (props: ScheduledServiceInstanceModalProps) => {
  const {
    show,
    title,
    onClose,
    validationError,
    loading,
    action,
    onApply,
    onEdit,
    onDelete,
    vehicle,
    scheduledServiceTypes,
    scheduledServiceInstances,
    selectedScheduledServiceInstance,
  } = props;

  const [intervalMap, setIntervalMap] = useState<IntervalMap>({});
  const [applicableScheduledServiceTypes, setApplicableScheduledServiceTypes] =
    useState<ScheduledServiceType[]>([]);
  const [scheduledServiceInstance, setScheduledServiceInstance] =
    useState<ScheduledServiceInstance>();

  useEffect(() => {
    if (action === 'Apply') {
      const unappliedScheduledServiceTypes = scheduledServiceTypes?.filter(
        (sst) =>
          !scheduledServiceInstances
            ?.map((ssi) => ssi.scheduledServiceTypeId)
            .includes(sst.id)
      );

      const mutableIntervalMap: IntervalMap = {};
      for (const scheduledServiceType of unappliedScheduledServiceTypes) {
        mutableIntervalMap[scheduledServiceType.id] = {
          mileInterval: 0,
          timeInterval: 0,
          timeUnits: 'DAY',
        };
      }

      setApplicableScheduledServiceTypes(unappliedScheduledServiceTypes);
      setIntervalMap(mutableIntervalMap);
    }
  }, [action, scheduledServiceTypes, scheduledServiceInstances]);

  useEffect(() => {
    if (action === 'Edit' || action === 'Delete') {
      setScheduledServiceInstance(selectedScheduledServiceInstance);
    }
  }, [action, selectedScheduledServiceInstance]);

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        {validationError ? <AppAlert message={validationError} /> : <></>}
        {action === 'Apply' ? (
          <ApplyContent
            scheduledServiceTypes={applicableScheduledServiceTypes}
            scheduledServiceInstances={scheduledServiceInstances}
            intervalMap={intervalMap}
            setIntervalMap={setIntervalMap}
          />
        ) : action === 'Edit' ? (
          <EditContent
            scheduledServiceInstance={scheduledServiceInstance}
            setScheduledServiceInstance={setScheduledServiceInstance}
          />
        ) : action === 'Delete' ? (
          <DeleteContent vehicleName={vehicle.name} />
        ) : (
          <></>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={
            action === 'Apply' || action === 'Edit' ? 'success' : 'danger'
          }
          disabled={
            loading ||
            (action === 'Apply' &&
              applicableScheduledServiceTypes.length === 0) ||
            (action === 'Edit' && !scheduledServiceInstance)
          }
          onClick={() => {
            if (action === 'Apply') {
              const records: CreateScheduledServiceInstanceRequest[] =
                Object.keys(intervalMap).map((scheduledServiceTypeId) => {
                  const intervalData = intervalMap[scheduledServiceTypeId];
                  return {
                    scheduledServiceTypeId,
                    mileInterval: intervalData.mileInterval,
                    timeInterval: intervalData.timeInterval,
                    timeUnits: intervalData.timeUnits,
                  };
                });
              void onApply(records);
            } else if (action === 'Edit') {
              if (scheduledServiceInstance) {
                // Some logic...
                void onEdit(scheduledServiceInstance);
              }
            } else if (action === 'Delete') {
              if (scheduledServiceInstance) {
                void onDelete(scheduledServiceInstance);
              }
            }
          }}
        >
          {action === 'Apply' || action === 'Edit' ? 'Save' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScheduledServiceInstanceModal;
