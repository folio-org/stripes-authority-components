import PropTypes from 'prop-types';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

const propTypes = {
  disabled: PropTypes.bool.isRequired,
  handleSectionToggle: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  name: PropTypes.string.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    labelInfo: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
  })),
  selectedValues: PropTypes.arrayOf(PropTypes.string),
};

const CheckboxFacet = ({
  id,
  label,
  open,
  handleSectionToggle,
  name,
  onFilterChange,
  disabled,
  onClearFilter,
  selectedValues = [],
  options = [],
}) => {
  return (
    <Accordion
      label={label}
      id={id}
      open={open}
      onToggle={handleSectionToggle}
      header={FilterAccordionHeader}
      headerProps={{
        label,
      }}
      displayClearButton={!disabled && selectedValues?.length > 0}
      onClearFilter={() => onClearFilter(name)}
    >
      <CheckboxFilter
        dataOptions={options}
        name={name}
        onChange={onFilterChange}
        selectedValues={selectedValues}
      />
    </Accordion>
  );
};

CheckboxFacet.propTypes = propTypes;

export default CheckboxFacet;
