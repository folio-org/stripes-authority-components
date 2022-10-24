import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { MultiSelectionFacet } from '../MultiSelectionFacet';
import {
  FILTERS,
  subjectHeadingsMap,
} from '../constants';

const propTypes = {
  handleSectionToggle: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  selectedValues: PropTypes.array,
};

const SubjectHeadingsFilter = ({
  open,
  selectedValues,
  onClearFilter,
  options,
  onFilterChange,
  handleSectionToggle,
  isLoading,
}) => {
  const intl = useIntl();

  const formatMissingOption = value => ({
    value,
    label: subjectHeadingsMap[value] || value,
    totalRecords: 0,
  });

  const facetOptions = useMemo(() => {
    return options.map(value => {
      return {
        id: value.id,
        label: subjectHeadingsMap[value.id],
        totalRecords: value.totalRecords,
      };
    });
  }, [options]);

  return (
    <MultiSelectionFacet
      id={FILTERS.SUBJECT_HEADINGS}
      label={intl.formatMessage({ id: `stripes-authority-components.search.${FILTERS.SUBJECT_HEADINGS}` })}
      name={FILTERS.SUBJECT_HEADINGS}
      open={open}
      options={facetOptions}
      selectedValues={selectedValues}
      onFilterChange={onFilterChange}
      onClearFilter={onClearFilter}
      formatMissingOption={formatMissingOption}
      displayClearButton={!!selectedValues.length}
      handleSectionToggle={handleSectionToggle}
      isPending={isLoading}
    />
  );
};

SubjectHeadingsFilter.defaultProps = {
  selectedValues: [],
};
SubjectHeadingsFilter.propTypes = propTypes;

export default SubjectHeadingsFilter;
