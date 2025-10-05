import { Button, Col, FormControl, Row, Spinner, Table } from 'react-bootstrap';
import useScheduledLog from '../hooks/useScheduledLog';
import NotFound from './NotFound';
import { Vehicle } from '../types/vehicle';
import ScheduledLogModal from './ScheduledLogModal';
import { CreateScheduledLogRequest, ScheduledLog } from '../types/vehicleLog';
import { useState } from 'react';
import { useScheduledServiceTypes } from '../hooks/useScheduledService';
import { useScheduledServiceInstances } from '../hooks/useScheduledServiceInstances';
import RichTextEditor from './RichTextEditor';
import ScheduledServiceInstanceSelector from './ScheduledServiceInstanceSelector';
import DatePickerWrapper from './DatePickerWrapper';
import NotesModal from './NotesModal';
import ScheduledLogFilterModal from './ScheduledLogFilterModal';
import { SearchFilterOption, type FilterOptions } from './FilterWidgets';
import useVehicleOwner from '../hooks/useVehicleOwner';
import { useCommunicationContext } from '../context/CommunicationContext';
import Search from './Search';

interface ScheduledLogProps {
  vehicle: Vehicle;
}

const ScheduledLogTab: React.FC<ScheduledLogProps> = (
  props: ScheduledLogProps
) => {
  const { vehicle } = props;
  const { id: vehicleId } = vehicle;

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editedLogs, setEditedLogs] = useState<Set<string>>(new Set());
  const [deletedLogs, setDeletedLogs] = useState<Set<string>>(new Set());
  const [selectedScheduledLog, setSelectedScheduledLog] =
    useState<ScheduledLog>();
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const { isOwner } = useVehicleOwner({ vehicle });
  const { scheduledServiceTypes, loading: loadingScheduledServiceTypes } =
    useScheduledServiceTypes(
      isOwner ? { sharedVehicleId: vehicle.id } : undefined
    );
  const {
    scheduledServiceInstances,
    loading: loadingScheduledServiceInstances,
  } = useScheduledServiceInstances({
    vehicleId,
  });

  const { setCommunicationContext } = useCommunicationContext();

  const {
    scheduledLogs,
    loading,
    actionLoading,
    actionError,
    setScheduledLogs,
    setActionError,
    createScheduledLog,
    saveScheduledLogs,
    setFilterOptions,
  } = useScheduledLog({
    vehicleId,
    scheduledServiceInstances,
    scheduledServiceTypes,
  });

  const getStatus = (log: ScheduledLog) => {
    if (deletedLogs.has(log.id)) {
      return '🔴';
    }
    if (editedLogs.has(log.id)) {
      return '🟡';
    }
    return '🟢';
  };

  const markLogForDeletion = (log: ScheduledLog) => {
    const mutableDeletedLogs = new Set(deletedLogs);
    if (mutableDeletedLogs.has(log.id)) {
      mutableDeletedLogs.delete(log.id);
    } else {
      mutableDeletedLogs.add(log.id);
    }
    setDeletedLogs(mutableDeletedLogs);
  };

  const editLog = (
    log: ScheduledLog,
    property: keyof ScheduledLog,
    value: string,
    type: 'string' | 'number' | 'date'
  ) => {
    if (!scheduledLogs) {
      setCommunicationContext({
        kind: 'warning',
        message: 'You have no scheduled logs to edit',
      });
      return;
    }

    const mutableEditedLogs = new Set(editedLogs);
    const mutableSchduledLogs = scheduledLogs.slice();
    let editApplied: boolean = false;

    if (type === 'string') {
      // @ts-ignore
      log[property] = value;
      mutableEditedLogs.add(log.id);
      editApplied = true;
    } else if (type === 'number') {
      const intVal = value.trim().length === 0 ? 0 : parseInt(value);
      if (!isNaN(intVal)) {
        // @ts-ignore
        log[property] = intVal;
        mutableEditedLogs.add(log.id);
        editApplied = true;
      }
    } else if (type === 'date') {
      // @ts-ignore
      log[property] = new Date(value);
      mutableEditedLogs.add(log.id);
      editApplied = true;
    }

    if (editApplied) {
      const index = mutableSchduledLogs.findIndex((l) => l.id === log.id);
      if (index >= 0) {
        mutableSchduledLogs[index] = log;
        setEditedLogs(mutableEditedLogs);
        setScheduledLogs(mutableSchduledLogs);
      }
    }
  };

  if (
    loading ||
    loadingScheduledServiceTypes ||
    loadingScheduledServiceInstances
  ) {
    return (
      <div className="centered-div">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!scheduledLogs || !scheduledServiceTypes || !scheduledServiceInstances) {
    return <NotFound />;
  }

  return (
    <div>
      <Row className="g-3">
        <Col sm={12} md={6} lg={4}>
          {/* <Button onClick={() => setShowFilterModal(true)}>Filter</Button> */}
          <Search
            placeholder="Search logs"
            onSearch={(searchText: string) => {
              const searchOptions: SearchFilterOption[] = [
                {
                  key: 'scheduledServiceInstanceId',
                  searchText,
                },
                {
                  key: 'notes',
                  searchText,
                },
              ];
              setFilterOptions((prev) => {
                return {
                  date: prev?.date ?? [],
                  number: prev?.number ?? [],
                  search: searchOptions,
                };
              });
            }}
          />
        </Col>
        <Col sm={12} md={6} lg={8} className="align-right">
          <Button
            variant="success"
            className="me-2"
            onClick={() => setIsCreating(true)}
          >
            Create
          </Button>
          <Button
            disabled={(!editedLogs.size && !deletedLogs.size) || actionLoading}
            onClick={() => {
              void saveScheduledLogs(
                editedLogs,
                deletedLogs,
                (editComplete: boolean, deleteComplete: boolean) => {
                  if (editComplete) {
                    setEditedLogs(new Set());
                  }
                  if (deleteComplete) {
                    setDeletedLogs(new Set());
                  }
                }
              );
            }}
          >
            Save
          </Button>
        </Col>
      </Row>
      <br />
      {!scheduledLogs.length ? (
        <p>No scheduled logs</p>
      ) : (
        <Table responsive>
          <thead>
            <tr>
              <th></th>
              <th style={{ minWidth: '150px' }}>Date</th>
              <th style={{ minWidth: '150px' }}>Mileage</th>
              <th style={{ minWidth: '200px' }}>Service</th>
              <th style={{ minWidth: '150px' }}>Next Mileage</th>
              <th style={{ minWidth: '150px' }}>Next Date</th>
              <th style={{ minWidth: '150px' }}>Parts Cost</th>
              <th style={{ minWidth: '150px' }}>Labor Cost</th>
              <th style={{ minWidth: '150px' }}>Total Cost</th>
              <th style={{ minWidth: '200px' }}>Notes</th>
              <th style={{ minWidth: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scheduledLogs.map((scheduledLog) => {
              return (
                <tr key={scheduledLog.id}>
                  <td className="vertical-align">{getStatus(scheduledLog)}</td>
                  <td className="vertical-align">
                    <DatePickerWrapper
                      pickerId={`date-performed-${scheduledLog.id}`}
                      label=""
                      initialDate={scheduledLog.datePerformed}
                      onChange={(date: Date | null) => {
                        if (date) {
                          editLog(
                            scheduledLog,
                            'datePerformed',
                            date.toLocaleDateString(),
                            'date'
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="vertical-align">
                    <FormControl
                      value={scheduledLog.mileage}
                      onChange={(e) => {
                        editLog(
                          scheduledLog,
                          'mileage',
                          e.target.value,
                          'number'
                        );
                      }}
                    />
                  </td>
                  <td>
                    <ScheduledServiceInstanceSelector
                      selectorId={`sst-${scheduledLog.id}`}
                      scheduledServiceTypes={scheduledServiceTypes}
                      scheduledServiceInstances={scheduledServiceInstances}
                      previewConfig={{
                        disabled: false,
                        previewSelectedId:
                          scheduledLog.scheduledServiceInstanceId,
                      }}
                      onSelect={(scheduledServiceInstanceId: string) => {
                        editLog(
                          scheduledLog,
                          'scheduledServiceInstanceId',
                          scheduledServiceInstanceId,
                          'string'
                        );
                      }}
                    />
                  </td>
                  <td className="vertical-align">
                    <FormControl
                      value={scheduledLog.nextServiceMileage}
                      disabled
                    />
                  </td>
                  <td className="vertical-align">
                    <FormControl
                      value={scheduledLog.nextServiceDate.toLocaleDateString()}
                      disabled
                    />
                  </td>
                  <td className="vertical-align">
                    <FormControl
                      value={scheduledLog.partsCost}
                      onChange={(e) => {
                        editLog(
                          scheduledLog,
                          'partsCost',
                          e.target.value,
                          'number'
                        );
                      }}
                    />
                  </td>
                  <td className="vertical-align">
                    {' '}
                    <FormControl
                      value={scheduledLog.laborCost}
                      onChange={(e) => {
                        editLog(
                          scheduledLog,
                          'laborCost',
                          e.target.value,
                          'number'
                        );
                      }}
                    />
                  </td>
                  <td className="vertical-align">
                    {' '}
                    <FormControl
                      value={scheduledLog.totalCost}
                      onChange={(e) => {
                        editLog(
                          scheduledLog,
                          'totalCost',
                          e.target.value,
                          'number'
                        );
                      }}
                    />
                  </td>
                  <td className="vertical-align">
                    <RichTextEditor
                      existingContent={scheduledLog.notes}
                      disabled={true}
                      onSave={() => {}}
                      previewConfig={{
                        maxLength: 50,
                      }}
                    />
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="light"
                        active={deletedLogs.has(scheduledLog.id)}
                        onClick={() => {
                          markLogForDeletion(scheduledLog);
                        }}
                      >
                        🗑️
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        onClick={() => {
                          setSelectedScheduledLog(scheduledLog);
                        }}
                      >
                        📝
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <ScheduledLogModal
        vehicle={vehicle}
        loading={actionLoading}
        onCreate={(createScheduledLogRequest: CreateScheduledLogRequest) => {
          void createScheduledLog(createScheduledLogRequest, () =>
            setIsCreating(false)
          );
        }}
        show={isCreating}
        title="Create Scheduled Log"
        onClose={() => {
          setIsCreating(false);
          setActionError(undefined);
        }}
        validationError={actionError}
        scheduledServiceTypes={scheduledServiceTypes}
        scheduledServiceInstances={scheduledServiceInstances}
      />
      <NotesModal
        show={Boolean(selectedScheduledLog)}
        title="Scheduled Log Notes"
        onClose={() => {
          setSelectedScheduledLog(undefined);
        }}
        initialContent={selectedScheduledLog?.notes ?? ''}
        loading={false}
        onSave={(content) => {
          if (selectedScheduledLog) {
            const mutableScheduledLogs = scheduledLogs.slice();
            const index = mutableScheduledLogs.findIndex(
              (log) => log.id === selectedScheduledLog.id
            );
            if (index >= 0) {
              mutableScheduledLogs[index].notes = content;
            }
            setScheduledLogs(mutableScheduledLogs);

            const mutableEditedLogs = new Set(editedLogs);
            mutableEditedLogs.add(selectedScheduledLog.id);
            setEditedLogs(mutableEditedLogs);
          }
          setSelectedScheduledLog(undefined);
        }}
      />
      {/* <ScheduledLogFilterModal
        show={showFilterModal}
        title="Filter"
        onApply={(filterOptions: FilterOptions) => {
          setFilterOptions(filterOptions);
          setShowFilterModal(false);
        }}
        onClose={() => setShowFilterModal(false)}
      /> */}
    </div>
  );
};

export default ScheduledLogTab;
