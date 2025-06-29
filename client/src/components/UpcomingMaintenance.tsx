import { Badge, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap';
import useUpcomingMaintenance from '../hooks/useUpcomingMaintenance';
import { UpcomingMaintenance as UpcomingMaintenanceType } from '../types/upcomingManitenance';

interface UpcomingMaintenanceProps {
  vehicleId?: string;
  shared?: boolean;
}

const UpcomingMaintenance: React.FC<UpcomingMaintenanceProps> = (
  props: UpcomingMaintenanceProps
) => {
  const { vehicleId, shared } = props;

  const { loading, upcomingMaintenance, sharedUpcomingMaintenance } =
    useUpcomingMaintenance({
      vehicleId,
      shared,
    });

  const upcomingMaintenanceToUse = shared
    ? sharedUpcomingMaintenance
    : upcomingMaintenance;

  const OverdueBadge = (upcomingMaintenance: UpcomingMaintenanceType) => {
    const { isOverdue, overdueReason } = upcomingMaintenance;

    if (!isOverdue) {
      return <></>;
    }

    switch (overdueReason) {
      case 'DATE_OVERDUE':
        return <Badge bg="danger">Overdue (date)</Badge>;
      case 'MILEAGE_OVERDUE':
        return <Badge bg="danger">Overdue (mileage)</Badge>;
      default:
        return <Badge bg="danger">Overdue</Badge>;
    }
  };

  const Due = (upcomingMaintenance: UpcomingMaintenanceType) => {
    const { dateDue, mileageDue } = upcomingMaintenance;

    return (
      <div>
        <span>Date Due: {dateDue.toLocaleDateString()}</span>
        {' | '}
        <span>Mileage Due: {mileageDue}</span>{' '}
        <span className="float-right">{OverdueBadge(upcomingMaintenance)}</span>
      </div>
    );
  };

  return (
    <div>
      <h2>Upcoming Maintenance</h2>
      <br />
      {loading ? (
        <Spinner animation="border" />
      ) : !upcomingMaintenanceToUse?.length ? (
        <p>Nothing to see here</p>
      ) : (
        <ListGroup>
          {upcomingMaintenanceToUse.map((d, index) => (
            <ListGroupItem key={`upcoming-maintenance-${index}`}>
              <div>
                {d.vehicleYear} {d.vehicleMake} {d.vehicleModel} -{' '}
                {d.scheduledServiceTypeName}
              </div>
              <div>{Due(d)}</div>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default UpcomingMaintenance;
