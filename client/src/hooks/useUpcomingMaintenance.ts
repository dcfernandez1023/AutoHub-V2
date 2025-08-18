import { useCallback, useEffect, useRef, useState } from 'react';
import VehicleClient from '../api/VehicleClient';
import { useAuthContext } from '../context/AuthContext';
import { UpcomingMaintenance } from '../types/upcomingManitenance';

interface UseUpcoingMaintenanceProps {
  vehicleId?: string;
  shared?: boolean;
}

const useUpcomingMaintenance = (props: UseUpcoingMaintenanceProps) => {
  const [upcomingMaintenance, setUpcomingMaintenance] =
    useState<UpcomingMaintenance[]>();
  const [sharedUpcomingMaintenance, setSharedUpcomingMaintenance] =
    useState<UpcomingMaintenance[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const { vehicleId, shared } = props;

  const authContextData = useAuthContext();

  useEffect(() => {
    const getUpcomingMaintenance = async () => {
      try {
        if (!authContextData?.authContext) {
          throw new Error('No auth context provided');
        }

        if (shared && sharedUpcomingMaintenance) {
          return;
        }

        if (!shared && upcomingMaintenance) {
          return;
        }

        setLoading(true);
        const upcomingMaintenanceResults =
          await VehicleClient.getUpcomingMaintenance(
            authContextData.authContext.userId,
            vehicleId,
            shared
          );

        if (!upcomingMaintenanceResults) {
          throw new Error('No upcoming maintenance returned');
        }

        const transformed = upcomingMaintenanceResults
          .map((d) => ({
            ...d,
            dateDue: new Date(d.dateDue),
            scheduledLogLastDatePerformed: new Date(
              d.scheduledLogLastDatePerformed
            ),
          }))
          .sort((a, b) => {
            if (a.isOverdue && b.isOverdue) {
              if (
                a.scheduledLogLastDatePerformed.getTime() >
                b.scheduledLogLastDatePerformed.getTime()
              ) {
                return -1;
              }
              return 1;
            }
            if (a.isOverdue) {
              return -1;
            }
            return 1;
          });

        if (shared) {
          setSharedUpcomingMaintenance(transformed);
        } else {
          setUpcomingMaintenance(transformed);
        }
      } catch (error) {
        console.error('Failed to get upcoming maintenance', error);
      } finally {
        setLoading(false);
      }
    };

    getUpcomingMaintenance();
  }, [vehicleId, shared]);

  return {
    loading,
    upcomingMaintenance,
    sharedUpcomingMaintenance,
  };
};

export default useUpcomingMaintenance;
