import { useState, useEffect } from 'react';
import { UserSharedWithVehicle } from '../types/vehicle';
import { useAuthContext } from '../context/AuthContext';
import VehicleClient from '../api/VehicleClient';
import { User } from '../types/user';
import UserClient from '../api/UserClient';

interface UseVehicleShareModalProps {
  vehicleId: string;
  defer?: boolean;
}

const useVehicleShareModal = (props: UseVehicleShareModalProps) => {
  const { vehicleId, defer } = props;

  const authContextData = useAuthContext();

  const [usersSharedWithVehicle, setUsersSharedWithVehicle] =
    useState<UserSharedWithVehicle[]>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [userToShare, setUserToShare] = useState<User | undefined>();
  const [searchText, setSearchText] = useState<string>('');

  const handeSearch = async (text: string): Promise<User[]> => {
    try {
      if (defer) {
        return [];
      }
      if (!vehicleId) {
        throw new Error('No vehicle id');
      }
      if (!authContextData?.authContext) {
        throw new Error('No auth context');
      }

      const users = await UserClient.searchUsers(
        authContextData.authContext.userId,
        vehicleId,
        text
      );

      if (!users) {
        throw new Error('Failed to search users');
      }

      return users;
    } catch (error) {
      console.error('Failed to search users', error);
      setError('Failed to search for users');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (userIdToShare: string) => {
    try {
      if (defer) {
        return null;
      }
      if (!vehicleId) {
        throw new Error('No vehicle id');
      }
      if (!authContextData?.authContext) {
        throw new Error('No auth context');
      }

      setLoading(true);
      const vehicleShare = await VehicleClient.shareVehicle(
        authContextData.authContext.userId,
        vehicleId,
        userIdToShare
      );
      if (!vehicleShare) {
        throw new Error('Failed to share vehicle');
      }
      return vehicleShare;
    } catch (error) {
      console.error('Failed to share vehicle', error);
      setError('Failed to share vehicle. Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShare = async (userIdToShare: string) => {
    try {
      if (defer) {
        return null;
      }
      if (!vehicleId) {
        throw new Error('No vehicle id');
      }
      if (!authContextData?.authContext) {
        throw new Error('No auth context');
      }

      const unshareResult = await VehicleClient.unshareVehicle(
        authContextData.authContext.userId,
        vehicleId,
        userIdToShare
      );

      if (!unshareResult) {
        throw new Error('Failed to unshare vehicle');
      }

      if (usersSharedWithVehicle) {
        const updatedList = usersSharedWithVehicle.filter(
          (d) => d.userId !== unshareResult.userId
        );
        setUsersSharedWithVehicle(updatedList);
      }
    } catch (error) {
      console.error('Failed to share vehicle', error);
      setError('Failed to share vehicle. Please try again');
    }
  };

  useEffect(() => {
    const getUsersSharedWithVehicle = async () => {
      try {
        if (defer) {
          return;
        }

        if (!vehicleId) {
          throw new Error('No vehicle id');
        }
        if (!authContextData?.authContext) {
          throw new Error('No auth context');
        }

        setLoading(true);
        const vehicleShares = await VehicleClient.getVehicleShares(
          authContextData.authContext.userId,
          vehicleId
        );

        if (!vehicleShares) {
          throw new Error('Failed to get users shared with vehicle');
        }

        setUsersSharedWithVehicle(vehicleShares);
      } catch (error) {
        console.error('Failed to get users shared with vehicle', error);
        setError('Failed to get users');
      } finally {
        setLoading(false);
      }
    };

    getUsersSharedWithVehicle();
  }, [vehicleId, defer]);

  return {
    usersSharedWithVehicle,
    error,
    loading,
    userToShare,
    searchText,
    setError,
    setUserToShare,
    setSearchText,
    handeSearch,
    handleShare,
    setUsersSharedWithVehicle,
    handleDeleteShare,
  };
};

export default useVehicleShareModal;
