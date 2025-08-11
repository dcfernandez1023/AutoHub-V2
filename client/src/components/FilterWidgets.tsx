import { FormLabel, Row, Col, FormControl } from 'react-bootstrap';
import DatePickerWrapper from './DatePickerWrapper';

export type DateRangeFilterOption = {
  key: string;
  start: Date | null;
  end: Date | null;
};

export type NumberRangeFilterOption = {
  key: string;
  start: number;
  end: number;
};

export type SearchFilterOption = {
  key: string;
  searchText: string;
};

export type FilterOptions = {
  date: DateRangeFilterOption[];
  number: NumberRangeFilterOption[];
  search: SearchFilterOption[];
};

export type DateFilterProps = {
  label: string;
  startPlaceholder: string;
  endPlaceHolder: string;
  dateRangeFilterOption: DateRangeFilterOption;
  onChangeStart: (date: Date | null) => void;
  onChangeEnd: (date: Date | null) => void;
};

export type NumberFilterProps = {
  label: string;
  startPlaceholder: string;
  endPlaceHolder: string;
  numberRangeFilterOption: NumberRangeFilterOption;
  onChangeStart: (n: number) => void;
  onChangeEnd: (n: number) => void;
};

export type SearchFilterProps = {
  label: string;
  placeholder: string;
  searchFilterOption: SearchFilterOption;
  onChangeSearchText: (searchText: string) => void;
};

export const DateFilter: React.FC<DateFilterProps> = (
  props: DateFilterProps
) => {
  const {
    label,
    startPlaceholder,
    endPlaceHolder,
    dateRangeFilterOption,
    onChangeStart,
    onChangeEnd,
  } = props;

  return (
    <>
      <FormLabel>
        <strong>{label}</strong>
      </FormLabel>
      <Row className="g-3">
        <Col md={6}>
          <DatePickerWrapper
            pickerId="date-performed-start"
            initialDate={dateRangeFilterOption.start}
            placeholder={startPlaceholder}
            onChange={onChangeStart}
          />
        </Col>
        <Col md={6}>
          <DatePickerWrapper
            pickerId="date-performed-end"
            initialDate={dateRangeFilterOption.end}
            placeholder={endPlaceHolder}
            onChange={onChangeEnd}
          />
        </Col>
      </Row>
    </>
  );
};

export const NumberFilter: React.FC<NumberFilterProps> = (
  props: NumberFilterProps
) => {
  const {
    label,
    startPlaceholder,
    endPlaceHolder,
    numberRangeFilterOption,
    onChangeStart,
    onChangeEnd,
  } = props;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    handler: (val: number) => void
  ) => {
    const value = e.target.value;
    const intVal = value.length === 0 ? 0 : parseInt(value);
    if (!isNaN(intVal)) {
      handler(intVal);
    }
  };

  return (
    <>
      <FormLabel>
        <strong>{label}</strong>
      </FormLabel>
      <Row className="g-3">
        <Col md={6}>
          <FormControl
            value={numberRangeFilterOption.start}
            placeholder={startPlaceholder}
            onChange={(e) => handleChange(e, onChangeStart)}
          />
        </Col>
        <Col md={6}>
          <FormControl
            value={numberRangeFilterOption.end}
            placeholder={endPlaceHolder}
            onChange={(e) => handleChange(e, onChangeEnd)}
          />
        </Col>
      </Row>
    </>
  );
};

export const SearchTextFilter: React.FC<SearchFilterProps> = (
  props: SearchFilterProps
) => {
  const { label, placeholder, searchFilterOption, onChangeSearchText } = props;

  return (
    <>
      <FormLabel>
        <strong>{label}</strong>
      </FormLabel>
      <FormControl
        value={searchFilterOption.searchText}
        placeholder={placeholder}
        onChange={(e) => onChangeSearchText(e.target.value)}
      />
    </>
  );
};
