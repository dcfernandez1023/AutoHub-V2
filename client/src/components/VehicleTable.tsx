import { Button, Table, Image } from 'react-bootstrap';
import { Vehicle } from '../types/vehicle';

interface VehiceTableProps {
  vehicle: Vehicle;
  onEditNotes: () => void;
  onRemoveImage: () => void;
}

const VehicleTable: React.FC<VehiceTableProps> = (props: VehiceTableProps) => {
  const { vehicle, onEditNotes, onRemoveImage } = props;

  const NotesPreview = ({ notes }: { notes: string }) => {
    const previewLength = 50;
    let preview = '';
    if (notes) {
      const ellipsis = notes.length > previewLength;
      preview = ellipsis ? `${notes.slice(0, previewLength)}...` : notes;
    }

    return <span>{preview}</span>;
  };

  return (
    <Table>
      <tbody>
        <tr>
          <td>
            <strong>Name</strong>
          </td>
          <td>{vehicle.name}</td>
        </tr>
        <tr>
          <td>
            <strong>Mileage</strong>
          </td>
          <td>{vehicle.mileage}</td>
        </tr>
        <tr>
          <td>
            <strong>Year</strong>
          </td>
          <td>{vehicle.year}</td>
        </tr>
        <tr>
          <td>
            <strong>Make</strong>
          </td>
          <td>{vehicle.make}</td>
        </tr>
        <tr>
          <td>
            <strong>Model</strong>
          </td>
          <td>{vehicle.model}</td>
        </tr>
        <tr>
          <td>
            <strong>License Plate</strong>
          </td>
          <td>{vehicle.licensePlate}</td>
        </tr>
        <tr>
          <td>
            <strong>VIN</strong>
          </td>
          <td>{vehicle.vin}</td>
        </tr>
        <tr>
          <td>
            <strong>Notes</strong>
          </td>
          <td>
            <div>
              <NotesPreview notes={vehicle.notes} />
              <div className="button-link">
                <Button variant="link" onClick={() => onEditNotes()}>
                  Edit
                </Button>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <strong>Image</strong>
          </td>
          <td>
            <div>
              <Image
                src={vehicle.base64Image ?? ''}
                width={400}
                height={400}
                fluid
                alt={`${vehicle.name} image`}
              />
              <div className="button-link">
                <Button
                  variant="link"
                  disabled={!vehicle.base64Image}
                  onClick={() => onRemoveImage()}
                >
                  Remove
                </Button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default VehicleTable;
