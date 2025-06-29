import { Row, Col, ButtonGroup, ToggleButton, Button } from 'react-bootstrap';
import VehicleList from './VehicleList';
import VehicleModal from './VehicleModal';
import useVehiclesActions, {
  VehicleModalState,
} from '../hooks/useVehiclesActions';
import { CreateOrUpdateVehicle } from '../types/vehicle';
import UpcomingMaintenance from './UpcomingMaintenance';

const Vehicles: React.FC = () => {
  const {
    shared,
    setShared,
    vehicleModalState,
    loading,
    validationError,
    setValidationError,
    setVehicleModalState,
    handleCreateVehicle,
  } = useVehiclesActions();

  return (
    <Row>
      <Col lg={8}>
        <Row className="div-spacing-bottom">
          <Col xs={6} className="align-left">
            <ButtonGroup>
              <ToggleButton
                id="vehicles-owned"
                variant="light"
                type="radio"
                value="owned"
                checked={!shared}
                onChange={() => setShared(false)}
              >
                Owned by me
              </ToggleButton>
              <ToggleButton
                id="vehicles-shared"
                variant="light"
                type="radio"
                value="shared"
                checked={shared}
                onChange={() => setShared(true)}
              >
                Shared with me
              </ToggleButton>
            </ButtonGroup>
          </Col>
          <Col xs={6} className="align-right">
            <Button
              disabled={loading}
              onClick={() => setVehicleModalState(VehicleModalState.Create)}
            >
              Create Vehicle
            </Button>
          </Col>
        </Row>
        <VehicleList shared={shared} />
        <VehicleModal
          show={vehicleModalState === VehicleModalState.Create}
          title="Create Vehicle"
          validationError={validationError}
          loading={loading}
          onSave={(vehicle: CreateOrUpdateVehicle) =>
            void handleCreateVehicle(vehicle)
          }
          onClose={() => {
            setValidationError(undefined);
            setVehicleModalState(VehicleModalState.Hidden);
          }}
        />
      </Col>
      <Col lg={4}>
        <UpcomingMaintenance shared={shared} />
      </Col>
    </Row>
  );
};

export default Vehicles;
