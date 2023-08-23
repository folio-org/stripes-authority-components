import PropTypes from 'prop-types';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

const propTypes = {
  activeFilters: PropTypes.array.isRequired,
  handleSectionToggle: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  name: PropTypes.string.isRequired,
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
  activeFilters,
  handleSectionToggle,
  name,
  options,
  onFilterChange,
  selectedValues,
}) => {
  const onClearFilter = () => {
    onFilterChange({ name, values: [] });
  };

  return (
    <Accordion
      label={label}
      id={id}
      displayClearButton={activeFilters?.length > 0}
      onClearFilter={onClearFilter}
      open={open}
      onToggle={handleSectionToggle}
      header={FilterAccordionHeader}
      headerProps={{
        label,
      }}
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

CheckboxFacet.defaultProps = {
  selectedValues: [],
  options: [],
};

CheckboxFacet.propTypes = propTypes;

export default CheckboxFacet;
