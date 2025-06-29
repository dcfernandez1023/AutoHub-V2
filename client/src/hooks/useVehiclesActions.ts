import { useState } from 'react';
import { CreateOrUpdateVehicle, Vehicle } from '../types/vehicle';
import VehicleClient from '../api/VehicleClient';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export enum VehicleModalState {
  Create = 'CREATE',
  Edit = 'EDIT',
  Delete = 'DELETE',
  Notes = 'NOTES',
  DeleteImage = 'DELETE_IMAGE',
  Share = 'SHARE',
  Hidden = 'HIDDEN',
}

const useVehiclesActions = () => {
  const [shared, setShared] = useState<boolean>(false);
  const [vehicleModalState, setVehicleModalState] = useState<VehicleModalState>(
    VehicleModalState.Hidden
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>();

  const navigate = useNavigate();
  const authContextData = useAuthContext();

  const handleCreateVehicle = async (vehicle: CreateOrUpdateVehicle) => {
    try {
      if (!authContextData || !authContextData.authContext) {
        throw new Error('No auth context found');
      }

      // Validate vehicle properties
      if (!vehicle.name?.trim().length) {
        setValidationError('Please provide a name for the vehicle');
        return;
      }

      setLoading(true);

      const createdVehicle = await VehicleClient.createVehicle(
        authContextData.authContext.userId,
        vehicle
      );
      if (!createdVehicle) {
        throw new Error('Vehicle not created');
      }
      navigate(`/vehicles/${createdVehicle.id}`);
    } catch (error) {
      console.error('Failed to create vehicle', error);
      setValidationError('Failed to create vehicle. Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVehicle = async (
    vehicleId: string,
    vehicle: CreateOrUpdateVehicle,
    callback: (vehicle: Vehicle) => void
  ) => {
    try {
      // Validate vehicle properties
      if (!vehicle.name?.trim().length) {
        setValidationError('Please provide a name for the vehicle');
        return;
      }

      if (!authContextData || !authContextData.authContext) {
        throw new Error('No auth context found');
      }

      setLoading(true);

      const updatedVehicle = await VehicleClient.updateVehicle(
        authContextData.authContext.userId,
        vehicleId,
        vehicle
      );
      if (!updatedVehicle) {
        throw new Error('Vehicle not updated');
      }
      callback(updatedVehicle);
    } catch (error) {
      console.error('Failed to edit vehice', error);
      setValidationError('Failed to edit vehicle. Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehice = async (vehicleId: string) => {
    try {
      if (!authContextData || !authContextData.authContext) {
        throw new Error('No auth context found');
      }

      setLoading(true);

      const deletedVehicle = await VehicleClient.deleteVehicle(
        authContextData.authContext.userId,
        vehicleId
      );
      if (!deletedVehicle) {
        throw new Error('Vehicle not deleted');
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to delete vehice', error);
      setValidationError('Failed to delete vehicle. Please try again');
    } finally {
      setLoading(false);
    }
  };

  return {
    shared,
    vehicleModalState,
    loading,
    validationError,
    setValidationError,
    setShared,
    setVehicleModalState,
    handleCreateVehicle,
    handleEditVehicle,
    handleDeleteVehice,
  };
};

export default useVehiclesActions;
