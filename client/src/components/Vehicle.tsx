import { useParams } from 'react-router-dom';
import useVehicles from '../hooks/useVehicles';
import NotFound from './NotFound';
import { Spinner } from 'react-bootstrap';

const Vehicle: React.FC = () => {
  const { vehicleId } = useParams();

  const { vehicle, loading } = useVehicles({ vehicleId });

  if (loading) {
    return (
      <div className="centered-div">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!vehicle) {
    return <NotFound />;
  }

  return <div>{vehicle.name}</div>;
};

export default Vehicle;
