import { useCallback, useEffect, useState } from 'react';
import {
  CreateScheduledLogRequest,
  ScheduledLog,
  ScheduledLogRaw,
  UpdateScheduledLogRequest,
} from '../types/vehicleLog';
import { useAuthContext } from '../context/AuthContext';
import ScheduledLogClient from '../api/VehicleLogClient';
import { FilterOptions } from '../components/FilterWidgets';
import {
  ScheduledServiceInstance,
  ScheduledServiceType,
} from '../types/scheduledService';
import useScheduledServiceInstanceSelector from './useScheduledServiceInstanceSelector';

interface UseScheduledLogProps {
  vehicleId: string;
  scheduledServiceTypes: ScheduledServiceType[];
  scheduledServiceInstances: ScheduledServiceInstance[];
}

const useScheduledLog = ({
  vehicleId,
  scheduledServiceTypes,
  scheduledServiceInstances,
}: UseScheduledLogProps) => {
  const [scheduledLogs, setScheduledLogs] = useState<ScheduledLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ScheduledLog[]>();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [actionError, setActionError] = useState<string>();

  const { selectorRecords } = useScheduledServiceInstanceSelector({
    scheduledServiceInstances,
    scheduledServiceTypes,
  });

  const { authContext } = useAuthContext();

  const applyFilter = useCallback(() => {
    if (!filterOptions) {
      setFilteredLogs(undefined);
      return;
    }

    if (scheduledLogs) {
      console.log('scheduled logs', scheduledLogs);
      const filtered = [];
      const mutableScheduledLogs = scheduledLogs.slice();
      for (const scheduledLog of mutableScheduledLogs) {
        let passesFilter: boolean = true;
        // Apply date filters
        for (const dateFilter of filterOptions.date) {
          const { start, end } = dateFilter;
          const key = dateFilter.key as keyof ScheduledLog;
          const dateVal = scheduledLog[key];
          if (start && end && key in scheduledLog && dateVal instanceof Date) {
            passesFilter =
              passesFilter &&
              dateVal.getTime() >= start?.getTime() &&
              dateVal.getTime() <= end?.getTime();
          }
        }

        // Apply number filters
        for (const numberFilter of filterOptions.number) {
          const { start, end } = numberFilter;
          const key = numberFilter.key as keyof ScheduledLog;
          const scheduledLogIntVal = parseInt(scheduledLog[key].toString());
          if (
            end > start &&
            key in scheduledLog &&
            !isNaN(scheduledLogIntVal)
          ) {
            passesFilter =
              passesFilter &&
              scheduledLogIntVal >= start &&
              scheduledLogIntVal <= end;
          }
        }

        // Apply search filters
        for (const searchFilter of filterOptions.search) {
          const { searchText } = searchFilter;
          const key = searchFilter.key as keyof ScheduledLog;
          const stringVal =
            key === 'scheduledServiceInstanceId'
              ? selectorRecords.find(
                  (record) =>
                    record.scheduledServiceInstance.id === scheduledLog[key]
                )?.scheduledServiceType.name
              : scheduledLog[key];
          if (
            searchText.trim().length &&
            key in scheduledLog &&
            typeof stringVal === 'string'
          ) {
            passesFilter =
              passesFilter &&
              stringVal.toLowerCase().includes(searchText.toLowerCase());
          }
        }

        if (passesFilter) {
          filtered.push(scheduledLog);
        }
      }

      console.log('filtered', filtered);

      setFilteredLogs(filtered);
    }
  }, [filterOptions, scheduledLogs, selectorRecords]);

  const getScheduledLogs = useCallback(async () => {
    try {
      if (!authContext) {
        throw new Error('No auth context');
      }

      setLoading(true);
      const fetchedScheduledLogs = await ScheduledLogClient.getScheduledLogs(
        authContext.userId,
        vehicleId
      );

      // Transform dates
      const scheduledLogsWithDates: ScheduledLog[] = fetchedScheduledLogs.map(
        (log) => {
          const { datePerformed, nextServiceDate } = log;
          return {
            ...log,
            datePerformed: new Date(datePerformed),
            nextServiceDate: new Date(nextServiceDate),
          };
        }
      );

      const sorted = scheduledLogsWithDates.sort(
        (a, b) => b.datePerformed.getTime() - a.datePerformed.getTime()
      );

      setScheduledLogs(sorted);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch scheduled logs');
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  const createScheduledLog = useCallback(
    async (log: CreateScheduledLogRequest, callback: () => void) => {
      try {
        if (!authContext) {
          throw new Error('No auth context');
        }

        setActionLoading(true);
        const createdLog: ScheduledLogRaw =
          await ScheduledLogClient.createScheduledLog(
            authContext.userId,
            vehicleId,
            log
          );

        if (scheduledLogs) {
          const mutableScheduledLogs = scheduledLogs.slice();
          mutableScheduledLogs.push({
            ...createdLog,
            datePerformed: new Date(createdLog.datePerformed),
            nextServiceDate: new Date(createdLog.nextServiceDate),
          });
          setScheduledLogs(
            mutableScheduledLogs.sort(
              (a, b) => b.datePerformed.getTime() - a.datePerformed.getTime()
            )
          );
        }

        callback();
      } catch (error) {
        console.error(error);
        setActionError('Failed to create scheduled log');
      } finally {
        setActionLoading(false);
      }
    },
    [vehicleId, scheduledLogs]
  );

  const saveScheduledLogs = useCallback(
    async (
      editedLogIds: Set<string>,
      deletedLogIds: Set<string>,
      callback: (editComplete: boolean, deleteComplete: boolean) => void
    ) => {
      let editComplete = false;
      let deleteComplete = false;

      try {
        if (!scheduledLogs) {
          throw new Error('Scheduled logs not initialized');
        }

        if (!authContext) {
          throw new Error('No auth context');
        }

        setActionLoading(true);
        const mutableScheduledLogs = scheduledLogs.slice();
        console.log('mutable scheduled logs', mutableScheduledLogs);

        // Remove logs marked for deletion from the edited logs. We don't want to edit if it's marked for deletion
        deletedLogIds.forEach((logId) => {
          editedLogIds.delete(logId);
        });

        // Prepare the update request
        const editScheduledLogsRequest: UpdateScheduledLogRequest[] =
          mutableScheduledLogs
            .filter((log) => editedLogIds.has(log.id))
            .map((log) => ({
              mileage: log.mileage,
              partsCost: log.partsCost,
              laborCost: log.laborCost,
              totalCost: log.totalCost,
              notes: log.notes,
              scheduledServiceInstanceId: log.scheduledServiceInstanceId,
              datePerformed: log.datePerformed.getTime(),
              id: log.id,
            }));

        // Make request to edit logs
        const updatedLogs: ScheduledLog[] = (
          await ScheduledLogClient.updateScheduledLogs(
            authContext.userId,
            vehicleId,
            editScheduledLogsRequest
          )
        ).map((log) => ({
          ...log,
          datePerformed: new Date(log.datePerformed),
          nextServiceDate: new Date(log.nextServiceDate),
        }));

        editComplete = updatedLogs.length > 0;

        // Make the request to delete logs
        const deletedLogs: string[] =
          await ScheduledLogClient.deleteScheduledLogs(
            authContext.userId,
            vehicleId,
            Array.from(deletedLogIds)
          );

        deleteComplete = deletedLogs.length > 0;

        // Consolidate the updated logs and deleted logs
        const updatedLogsMap = new Map(updatedLogs.map((log) => [log.id, log]));
        const mutatedScheduledLogs = mutableScheduledLogs
          .map((log) => updatedLogsMap.get(log.id) ?? log)
          .filter((log) => !deletedLogs.includes(log.id));

        // Set the scheduled logs
        setScheduledLogs(
          mutatedScheduledLogs.sort(
            (a, b) => b.datePerformed.getTime() - a.datePerformed.getTime()
          )
        );
      } catch (error) {
        // TODO: Show toast message
        console.error(error);
        setActionError('Failed to save scheduled logs');
      } finally {
        setActionLoading(false);
        callback(editComplete, deleteComplete);
      }
    },
    [vehicleId, scheduledLogs]
  );

  useEffect(() => {
    void getScheduledLogs();
  }, [vehicleId]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  return {
    scheduledLogs: filteredLogs ?? scheduledLogs,
    loading,
    actionLoading,
    error,
    actionError,
    setScheduledLogs: filteredLogs ? setFilteredLogs : setScheduledLogs,
    setError,
    setActionError,
    createScheduledLog,
    saveScheduledLogs,
    applyFilter,
    setFilterOptions,
  };
};

export default useScheduledLog;
