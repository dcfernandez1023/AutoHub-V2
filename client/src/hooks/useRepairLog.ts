import { useCallback, useEffect, useState } from 'react';
import {
  CreateRepairLogRequest,
  RepairLog,
  RepairLogRaw,
  UpdateRepairLogRequest,
} from '../types/vehicleLog';
import { useAuthContext } from '../context/AuthContext';
import RepairLogClient from '../api/VehicleLogClient';
import { FilterOptions } from '../components/FilterWidgets';

interface UseRepairLogProps {
  vehicleId: string;
}

const useRepairLog = ({ vehicleId }: UseRepairLogProps) => {
  const [repairLogs, setRepairLogs] = useState<RepairLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<RepairLog[]>();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [actionError, setActionError] = useState<string>();

  const { authContext } = useAuthContext();

  const applyFilter = useCallback(() => {
    if (!filterOptions) {
      setFilteredLogs(undefined);
      return;
    }

    if (repairLogs) {
      console.log('repair logs', repairLogs);
      const filtered = [];
      const mutableRepairLogs = repairLogs.slice();
      for (const repairLog of mutableRepairLogs) {
        let passesFilter: boolean = true;
        // Apply date filters
        for (const dateFilter of filterOptions.date) {
          const { start, end } = dateFilter;
          const key = dateFilter.key as keyof RepairLog;
          const dateVal = repairLog[key];
          if (start && end && key in repairLog && dateVal instanceof Date) {
            passesFilter =
              passesFilter &&
              dateVal.getTime() >= start?.getTime() &&
              dateVal.getTime() <= end?.getTime();
          }
        }

        // Apply number filters
        for (const numberFilter of filterOptions.number) {
          const { start, end } = numberFilter;
          const key = numberFilter.key as keyof RepairLog;
          const repairLogIntVal = parseInt(repairLog[key].toString());
          if (end > start && key in repairLog && !isNaN(repairLogIntVal)) {
            passesFilter =
              passesFilter &&
              repairLogIntVal >= start &&
              repairLogIntVal <= end;
          }
        }

        // Apply search filters
        for (const searchFilter of filterOptions.search) {
          const { searchText } = searchFilter;
          const key = searchFilter.key as keyof RepairLog;
          const stringVal = repairLog[key];
          if (
            searchText.trim().length &&
            key in repairLog &&
            typeof stringVal === 'string'
          ) {
            passesFilter =
              passesFilter &&
              stringVal.toLowerCase().includes(searchText.toLowerCase());
          }
        }

        if (passesFilter) {
          filtered.push(repairLog);
        }
      }

      console.log('filtered', filtered);

      setFilteredLogs(filtered);
    }
  }, [filterOptions, repairLogs]);

  const getRepairLogs = useCallback(async () => {
    try {
      if (!authContext) {
        throw new Error('No auth context');
      }

      setLoading(true);
      const fetchedRepairLogs = await RepairLogClient.getRepairLogs(
        authContext.userId,
        vehicleId
      );

      // Transform dates
      const repairLogsWithDates: RepairLog[] = fetchedRepairLogs.map((log) => {
        const { datePerformed } = log;
        return {
          ...log,
          datePerformed: new Date(datePerformed),
        };
      });

      const sorted = repairLogsWithDates.sort(
        (a, b) => b.datePerformed.getTime() - a.datePerformed.getTime()
      );

      setRepairLogs(sorted);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch repair logs');
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  const createRepairLog = useCallback(
    async (log: CreateRepairLogRequest, callback: () => void) => {
      try {
        if (!authContext) {
          throw new Error('No auth context');
        }

        setActionLoading(true);
        const createdLog: RepairLogRaw = await RepairLogClient.createRepairLog(
          authContext.userId,
          vehicleId,
          log
        );

        if (repairLogs) {
          const mutableRepairLogs = repairLogs.slice();
          mutableRepairLogs.push({
            ...createdLog,
            datePerformed: new Date(createdLog.datePerformed),
          });
          setRepairLogs(
            mutableRepairLogs.sort(
              (a, b) => b.datePerformed.getTime() - a.datePerformed.getTime()
            )
          );
        }

        callback();
      } catch (error) {
        console.error(error);
        setActionError('Failed to create repair log');
      } finally {
        setActionLoading(false);
      }
    },
    [vehicleId, repairLogs]
  );

  const saveRepairLogs = useCallback(
    async (
      editedLogIds: Set<string>,
      deletedLogIds: Set<string>,
      callback: (editComplete: boolean, deleteComplete: boolean) => void
    ) => {
      let editComplete = false;
      let deleteComplete = false;

      try {
        if (!repairLogs) {
          throw new Error('Repair logs not initialized');
        }

        if (!authContext) {
          throw new Error('No auth context');
        }

        setActionLoading(true);
        const mutableRepairLogs = repairLogs.slice();
        console.log('mutable scheduled logs', mutableRepairLogs);

        // Remove logs marked for deletion from the edited logs. We don't want to edit if it's marked for deletion
        deletedLogIds.forEach((logId) => {
          editedLogIds.delete(logId);
        });

        // Prepare the update request
        const editRepairLogsRequest: UpdateRepairLogRequest[] =
          mutableRepairLogs
            .filter((log) => editedLogIds.has(log.id))
            .map((log) => ({
              mileage: log.mileage,
              partsCost: log.partsCost,
              laborCost: log.laborCost,
              totalCost: log.totalCost,
              notes: log.notes,
              name: log.name,
              datePerformed: log.datePerformed.getTime(),
              id: log.id,
            }));

        // Make request to edit logs
        const updatedLogs: RepairLog[] = (
          await RepairLogClient.updateRepairLogs(
            authContext.userId,
            vehicleId,
            editRepairLogsRequest
          )
        ).map((log) => ({
          ...log,
          datePerformed: new Date(log.datePerformed),
        }));

        editComplete = updatedLogs.length > 0;

        // Make the request to delete logs
        const deletedLogs: string[] = await RepairLogClient.deleteRepairLogs(
          authContext.userId,
          vehicleId,
          Array.from(deletedLogIds)
        );

        deleteComplete = deletedLogs.length > 0;

        // Consolidate the updated logs and deleted logs
        const updatedLogsMap = new Map(updatedLogs.map((log) => [log.id, log]));
        const mutatedRepairLogs = mutableRepairLogs
          .map((log) => updatedLogsMap.get(log.id) ?? log)
          .filter((log) => !deletedLogs.includes(log.id));

        // Set the scheduled logs
        setRepairLogs(
          mutatedRepairLogs.sort(
            (a, b) => b.datePerformed.getTime() - a.datePerformed.getTime()
          )
        );
      } catch (error) {
        // TODO: Show toast message
        console.error(error);
        setActionError('Failed to save repair logs');
      } finally {
        setActionLoading(false);
        callback(editComplete, deleteComplete);
      }
    },
    [vehicleId, repairLogs]
  );

  useEffect(() => {
    void getRepairLogs();
  }, [vehicleId]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  return {
    repairLogs: filteredLogs ?? repairLogs,
    loading,
    actionLoading,
    error,
    actionError,
    setRepairLogs: filteredLogs ? setFilteredLogs : setRepairLogs,
    setError,
    setActionError,
    createRepairLog,
    saveRepairLogs,
    applyFilter,
    setFilterOptions,
  };
};

export default useRepairLog;
