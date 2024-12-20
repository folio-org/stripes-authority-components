import PropTypes from 'prop-types';

import { AcqCheckboxFilter } from '@folio/stripes-acq-components';

import { REFERENCES_OPTIONS_BY_SEGMENT } from '../constants';

const propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  navigationSegment: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const ReferencesFilter = ({
  closedByDefault = true,
  id,
  onChange,
  name,
  navigationSegment,
  activeFilters = [],
  disabled = false,
}) => (
  <AcqCheckboxFilter
    activeFilters={activeFilters}
    closedByDefault={closedByDefault}
    disabled={disabled}
    id={id}
    labelId="stripes-authority-components.search.references"
    name={name}
    onChange={onChange}
    options={REFERENCES_OPTIONS_BY_SEGMENT[navigationSegment]}
  />
);

ReferencesFilter.propTypes = propTypes;

export { ReferencesFilter };
