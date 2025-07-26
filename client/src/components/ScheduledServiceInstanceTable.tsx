import { Button, Spinner, Table } from 'react-bootstrap';
import { useScheduledServiceInstances } from '../hooks/useScheduledServiceInstances';
import { ScheduledServiceType } from '../types/scheduledService';

type ScheduledServiceInstanceTableProps = {
  vehicleId: string;
  scheduledServiceTypes: ScheduledServiceType[];
  onEdit: () => void;
  onDelete: () => void;
};

const ScheduledServiceInstanceTable: React.FC<
  ScheduledServiceInstanceTableProps
> = (props: ScheduledServiceInstanceTableProps) => {
  const { vehicleId, scheduledServiceTypes, onEdit, onDelete } = props;

  const { loading, scheduledServiceInstances, error } =
    useScheduledServiceInstances({ vehicleId });

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (!scheduledServiceInstances?.length) {
    return <div>No scheduled services have been applied to this vehicle</div>;
  }

  const getScheduledServiceTypeName = (scheduledServiceTypeId: string) => {
    return scheduledServiceTypes?.find(
      (scheduledServiceType) =>
        scheduledServiceType.id === scheduledServiceTypeId
    )?.name;
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>Scheduled Service Type</th>
          <th>Mile Interval</th>
          <th>Time Interval</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {scheduledServiceInstances.map((scheduledServiceInstance) => {
          const scheduledServiceTypeName = getScheduledServiceTypeName(
            scheduledServiceInstance.scheduledServiceTypeId
          );
          if (scheduledServiceTypeName) {
            return (
              <tr key={scheduledServiceInstance.id}>
                <td className="vertical-align">{scheduledServiceTypeName}</td>
                <td className="vertical-align">
                  {scheduledServiceInstance.mileInterval}
                </td>
                <td className="vertical-align">
                  {scheduledServiceInstance.timeInterval}{' '}
                  {scheduledServiceInstance.timeUnits}
                </td>
                <td className="align-right scheduled-service-type-table-actions">
                  <Button className="button-group-spacing" size="sm">
                    Edit
                  </Button>
                  <Button
                    className="button-group-spacing"
                    variant="danger"
                    size="sm"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          }

          return <></>;
        })}
      </tbody>
    </Table>
  );
};

export default ScheduledServiceInstanceTable;
