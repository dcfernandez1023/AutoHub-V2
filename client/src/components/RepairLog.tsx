import { Button, Col, FormControl, Row, Spinner, Table } from 'react-bootstrap';
import useRepairLog from '../hooks/useRepairLog';
import NotFound from './NotFound';
import { Vehicle } from '../types/vehicle';
import RepairLogModal from './RepairLogModal';
import { CreateRepairLogRequest, RepairLog } from '../types/vehicleLog';
import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import DatePickerWrapper from './DatePickerWrapper';
import NotesModal from './NotesModal';
import RepairLogFilterModal from './RepairLogFilterModal';
import { type FilterOptions } from './FilterWidgets';

interface RepairLogProps {
  vehicle: Vehicle;
}

const RepairLogTab: React.FC<RepairLogProps> = (props: RepairLogProps) => {
  const { vehicle } = props;
  const { id: vehicleId } = vehicle;

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editedLogs, setEditedLogs] = useState<Set<string>>(new Set());
  const [deletedLogs, setDeletedLogs] = useState<Set<string>>(new Set());
  const [selectedRepairLog, setSelectedRepairLog] = useState<RepairLog>();
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const {
    repairLogs,
    loading,
    actionLoading,
    error,
    actionError,
    setRepairLogs,
    setError,
    setActionError,
    createRepairLog,
    saveRepairLogs,
    setFilterOptions,
  } = useRepairLog({
    vehicleId,
  });

  const getStatus = (log: RepairLog) => {
    if (deletedLogs.has(log.id)) {
      return '🔴';
    }
    if (editedLogs.has(log.id)) {
      return '🟡';
    }
    return '🟢';
  };

  const markLogForDeletion = (log: RepairLog) => {
    const mutableDeletedLogs = new Set(deletedLogs);
    if (mutableDeletedLogs.has(log.id)) {
      mutableDeletedLogs.delete(log.id);
    } else {
      mutableDeletedLogs.add(log.id);
    }
    setDeletedLogs(mutableDeletedLogs);
  };

  const editLog = (
    log: RepairLog,
    property: keyof RepairLog,
    value: string,
    type: 'string' | 'number' | 'date'
  ) => {
    // TODO: Handle this better
    if (!repairLogs) {
      return;
    }

    const mutableEditedLogs = new Set(editedLogs);
    const mutableSchduledLogs = repairLogs.slice();
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
        setRepairLogs(mutableSchduledLogs);
      }
    }
  };

  if (loading) {
    return (
      <div className="centered-div">
        <Spinner animation="border" />
      </div>
    );
  }

  // TODO: Fancier error handling
  if (error) {
    return <p>{error}</p>;
  }

  if (!repairLogs) {
    return <NotFound />;
  }

  return (
    <div>
      <Row>
        <Col xs={4}>
          <Button onClick={() => setShowFilterModal(true)}>Filter</Button>
        </Col>
        <Col xs={8} className="align-right">
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
              void saveRepairLogs(
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
      {!repairLogs.length ? (
        <p>No repair logs</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Mileage</th>
              <th>Service Name</th>
              <th>Parts Cost</th>
              <th>Labor Cost</th>
              <th>Total Cost</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {repairLogs.map((repairLog) => {
              return (
                <tr key={repairLog.id}>
                  <td className="vertical-align">{getStatus(repairLog)}</td>
                  <td className="vertical-align">
                    <DatePickerWrapper
                      pickerId={`date-performed-${repairLog.id}`}
                      label=""
                      initialDate={repairLog.datePerformed}
                      onChange={(date: Date | null) => {
                        if (date) {
                          editLog(
                            repairLog,
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
                      value={repairLog.mileage}
                      onChange={(e) => {
                        editLog(repairLog, 'mileage', e.target.value, 'number');
                      }}
                    />
                  </td>
                  <td>
                    <FormControl
                      value={repairLog.name}
                      onChange={(e) => {
                        editLog(repairLog, 'name', e.target.value, 'string');
                      }}
                    />
                  </td>
                  <td className="vertical-align">
                    <FormControl
                      value={repairLog.partsCost}
                      onChange={(e) => {
                        editLog(
                          repairLog,
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
                      value={repairLog.laborCost}
                      onChange={(e) => {
                        editLog(
                          repairLog,
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
                      value={repairLog.totalCost}
                      onChange={(e) => {
                        editLog(
                          repairLog,
                          'totalCost',
                          e.target.value,
                          'number'
                        );
                      }}
                    />
                  </td>
                  <td className="vertical-align">
                    <RichTextEditor
                      existingContent={repairLog.notes}
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
                        active={deletedLogs.has(repairLog.id)}
                        onClick={() => {
                          markLogForDeletion(repairLog);
                        }}
                      >
                        🗑️
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        onClick={() => {
                          setSelectedRepairLog(repairLog);
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
      <RepairLogModal
        vehicle={vehicle}
        loading={actionLoading}
        onCreate={(createRepairLogRequest: CreateRepairLogRequest) => {
          void createRepairLog(createRepairLogRequest, () =>
            setIsCreating(false)
          );
        }}
        show={isCreating}
        title="Create Repair Log"
        onClose={() => {
          setIsCreating(false);
          setActionError(undefined);
        }}
        validationError={actionError}
      />
      <NotesModal
        show={Boolean(selectedRepairLog)}
        title="Repair Log Notes"
        onClose={() => {
          setSelectedRepairLog(undefined);
        }}
        initialContent={selectedRepairLog?.notes ?? ''}
        loading={false}
        onSave={(content) => {
          if (selectedRepairLog) {
            const mutableRepairLogs = repairLogs.slice();
            const index = mutableRepairLogs.findIndex(
              (log) => log.id === selectedRepairLog.id
            );
            if (index >= 0) {
              mutableRepairLogs[index].notes = content;
            }
            setRepairLogs(mutableRepairLogs);

            const mutableEditedLogs = new Set(editedLogs);
            mutableEditedLogs.add(selectedRepairLog.id);
            setEditedLogs(mutableEditedLogs);
          }
          setSelectedRepairLog(undefined);
        }}
      />
      <RepairLogFilterModal
        show={showFilterModal}
        title="Filter"
        onApply={(filterOptions: FilterOptions) => {
          console.log('filter options', filterOptions);
          setFilterOptions(filterOptions);
          setShowFilterModal(false);
        }}
        onClose={() => setShowFilterModal(false)}
      />
    </div>
  );
};

export default RepairLogTab;
