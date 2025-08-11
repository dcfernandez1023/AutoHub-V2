import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerWrapperProps {
  pickerId: string;
  onChange: (val: Date | null) => void;
  label?: string;
  placeholder?: string;
  initialDate?: Date | null;
}

const DatePickerWrapper: React.FC<DatePickerWrapperProps> = (
  props: DatePickerWrapperProps
) => {
  const { pickerId, label, initialDate, placeholder, onChange } = props;

  const [startDate, setStartDate] = useState<Date>();

  useEffect(() => {
    setStartDate(initialDate ?? new Date());
    console.log('running');
  }, [initialDate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label ? <Form.Label>{label}</Form.Label> : <></>}
      <DatePicker
        id={pickerId}
        selected={startDate}
        placeholderText={placeholder}
        className="form-control"
        onChange={(date) => {
          if (date) {
            setStartDate(date);
            onChange(date);
          }
        }}
      />
    </div>
  );
};

export default DatePickerWrapper;
