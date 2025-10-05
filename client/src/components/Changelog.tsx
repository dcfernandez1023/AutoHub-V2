import { Spinner, Table } from 'react-bootstrap';
import useChangelog from '../hooks/useChangelog';

type ChangelogProps = {
  vehicleId?: string;
};

const Changelog: React.FC<ChangelogProps> = (props: ChangelogProps) => {
  const { vehicleId } = props;

  const { loading, changelog } = useChangelog({ vehicleId });

  if (loading) {
    return (
      <div className="centered-div">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <h2>{vehicleId ? 'Vehicle Changelog' : 'Changelog'}</h2>
      <br />
      <Table responsive>
        <thead>
          <tr>
            <th style={{ minWidth: '100px' }}>Date</th>
            <th style={{ minWidth: '300px' }}>Log</th>
          </tr>
        </thead>
        <tbody>
          {changelog.map((cl) => {
            return (
              <tr key={cl.id}>
                <td>{`${cl.dateCreated.toLocaleDateString()} ${cl.dateCreated.toLocaleTimeString()}`}</td>
                <td>{cl.description}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default Changelog;
