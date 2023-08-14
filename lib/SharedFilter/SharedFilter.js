import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  useStripes,
  checkIfUserInMemberTenant,
} from '@folio/stripes/core';

import { CheckboxFacet } from '../CheckboxFacet';
import { FILTERS } from '../constants';

const propTypes = {
  handleSectionToggle: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  selectedValues: PropTypes.array.isRequired,
};

const SharedFilter = ({
  onFilterChange,
  options,
  handleSectionToggle,
  open,
  selectedValues,
}) => {
  const stripes = useStripes();
  const intl = useIntl();

  if (!checkIfUserInMemberTenant(stripes)) {
    return null;
  }

  const formattedOptions = options.map(({ id: optionId, totalRecords, ...rest }) => ({
    ...rest,
    value: optionId,
    label: intl.formatMessage({ id: `stripes-authority-components.filter.${optionId}` }),
    labelInfo: totalRecords,
  }));

  return (
    <CheckboxFacet
      id={FILTERS.SHARED}
      name={FILTERS.SHARED}
      open={open}
      labelId="stripes-authority-components.search.shared"
      label={intl.formatMessage({ id: `stripes-authority-components.search.${FILTERS.SHARED}` })}
      options={formattedOptions}
      selectedValues={selectedValues}
      onFilterChange={onFilterChange}
      handleSectionToggle={handleSectionToggle}
    />
  );
};

SharedFilter.propTypes = propTypes;

export { SharedFilter };
