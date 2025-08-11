import { Button, Modal } from 'react-bootstrap';
import { ModalBaseProps } from '../types/modal';
import { useState } from 'react';
import {
  DateFilter,
  DateRangeFilterOption,
  FilterOptions,
  NumberFilter,
  NumberRangeFilterOption,
  SearchFilterOption,
  SearchTextFilter,
} from './FilterWidgets';

interface ScheduledLogFilterModalProps extends ModalBaseProps {
  onApply: (filterOptions: FilterOptions) => void;
}

const ScheduledLogFilterModal: React.FC<ScheduledLogFilterModalProps> = (
  props: ScheduledLogFilterModalProps
) => {
  const { show, title, onClose, onApply } = props;

  // State for Date Performed filter
  const [datePerformedFilterOption, setDatePerformedFilterOption] =
    useState<DateRangeFilterOption>({
      key: 'datePerformed',
      start: null,
      end: null,
    });
  // State for Mileage filter
  const [mileageFilterOption, setMileageFilterOption] =
    useState<NumberRangeFilterOption>({
      key: 'mileage',
      start: 0,
      end: 0,
    });
  // State for Scheduled Service filter
  const [scheduledServiceFilterOption, setScheduledServiceFilterOption] =
    useState<SearchFilterOption>({
      key: 'scheduledServiceInstanceId',
      searchText: '',
    });

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        <DateFilter
          label="Date"
          startPlaceholder="Start"
          dateRangeFilterOption={datePerformedFilterOption}
          endPlaceHolder="End"
          onChangeStart={(date: Date | null) => {
            const mutableFilterOption = Object.assign(
              {},
              datePerformedFilterOption
            );
            mutableFilterOption.start = date;
            setDatePerformedFilterOption(mutableFilterOption);
          }}
          onChangeEnd={(date: Date | null) => {
            const mutableFilterOption = Object.assign(
              {},
              datePerformedFilterOption
            );
            mutableFilterOption.end = date;
            setDatePerformedFilterOption(mutableFilterOption);
          }}
        />
        <br />
        <NumberFilter
          label="Mileage"
          startPlaceholder="Start"
          endPlaceHolder="End"
          numberRangeFilterOption={mileageFilterOption}
          onChangeStart={(val: number) => {
            const mutableFilterOption = Object.assign({}, mileageFilterOption);
            mutableFilterOption.start = val;
            setMileageFilterOption(mutableFilterOption);
          }}
          onChangeEnd={(val: number) => {
            const mutableFilterOption = Object.assign({}, mileageFilterOption);
            mutableFilterOption.end = val;
            setMileageFilterOption(mutableFilterOption);
          }}
        />
        <br />
        <SearchTextFilter
          label="Service Name"
          placeholder="e.g. Oil Change"
          searchFilterOption={scheduledServiceFilterOption}
          onChangeSearchText={(searchText: string) => {
            const mutableFilterOption = Object.assign(
              {},
              scheduledServiceFilterOption
            );
            mutableFilterOption.searchText = searchText;
            setScheduledServiceFilterOption(mutableFilterOption);
          }}
        />
        <br />
        <div className="d-flex gap-2" style={{ float: 'right' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setDatePerformedFilterOption({
                key: 'datePerformed',
                start: null,
                end: null,
              });
              setMileageFilterOption({
                key: 'mileage',
                start: 0,
                end: 0,
              });
              setScheduledServiceFilterOption({
                key: 'scheduledServiceInstanceId',
                searchText: '',
              });
            }}
          >
            Clear
          </Button>
          <Button
            variant="success"
            onClick={() => {
              const filterOptions: FilterOptions = {
                date: [datePerformedFilterOption],
                number: [mileageFilterOption],
                search: [scheduledServiceFilterOption],
              };
              onApply(filterOptions);
            }}
          >
            Apply
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ScheduledLogFilterModal;
