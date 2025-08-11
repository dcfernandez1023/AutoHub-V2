import { useCallback, useEffect, useState } from 'react';
import { Changelog, VehicleChangelog } from '../types/changelog';
import ChangelogClient from '../api/ChangelogClient';
import { useAuthContext } from '../context/AuthContext';

type UseChangelogProps = {
  vehicleId?: string;
};

const useChangelog = (props: UseChangelogProps) => {
  const { vehicleId } = props;

  const [changelog, setChangelog] = useState<(Changelog | VehicleChangelog)[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { authContext } = useAuthContext();

  const getChangelog = useCallback(async () => {
    try {
      if (!authContext || !authContext.userId) {
        throw new Error('No auth context');
      }

      setLoading(true);

      const userId = authContext.userId;
      if (vehicleId) {
        const rawVehicleChangelog = await ChangelogClient.getVehicleChangelog(
          userId,
          vehicleId
        );
        setChangelog(
          rawVehicleChangelog
            .map((vcl) => {
              return {
                ...vcl,
                dateCreated: new Date(vcl.dateCreated),
              };
            })
            .sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime())
        );
      } else {
        const {
          changelog: rawChangelog,
          vehicleChangelog: rawVehicleChangelog,
        } = await ChangelogClient.getChangelog(userId);

        const consolidated: (Changelog | VehicleChangelog)[] = [];

        for (const cl of rawChangelog) {
          consolidated.push({
            ...cl,
            dateCreated: new Date(cl.dateCreated),
          });
        }

        for (const vcl of rawVehicleChangelog) {
          consolidated.push({
            ...vcl,
            dateCreated: new Date(vcl.dateCreated),
          });
        }

        setChangelog(
          consolidated.sort(
            (a, b) => b.dateCreated.getTime() - a.dateCreated.getTime()
          )
        );
      }
    } catch (error) {
      // TODO: Log this
      setError('Failed to fetch changelog');
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    void getChangelog();
  }, [getChangelog]);

  return {
    changelog,
    loading,
    error,
    setError,
  };
};

export default useChangelog;
