import {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { AcqDateRangeFilter } from '@folio/stripes-acq-components';

import { AuthoritiesSearchContext } from '../';
import { ReferencesFilter } from '../ReferencesFilter';
import { MultiSelectionFacet } from '../MultiSelectionFacet';
import { useSectionToggle } from '../hooks';
import { useFacets } from '../queries';
import {
  subjectHeadingsMap,
  FILTERS,
} from '../constants';
import {
  getSelectedFacets,
  onClearFilter,
  updateFilters,
} from '../utils';

const DATE_FORMAT = 'YYYY-MM-DD';

const propTypes = {
  cqlQuery: PropTypes.string,
  isSearching: PropTypes.bool.isRequired,
  onCloseDetailView: PropTypes.func,
};

const SearchFilters = ({
  isSearching,
  cqlQuery,
  onCloseDetailView,
}) => {
  const intl = useIntl();
  const {
    filters,
    setFilters,
    navigationSegmentValue,
  } = useContext(AuthoritiesSearchContext);

  const [filterAccordions, { handleSectionToggle }] = useSectionToggle({
    [FILTERS.HEADING_TYPE]: false,
    [FILTERS.SUBJECT_HEADINGS]: false,
  });

  const selectedFacets = getSelectedFacets(filterAccordions);

  const { isLoading, facets = {} } = useFacets({
    query: cqlQuery,
    selectedFacets,
  });

  const applyFilters = useCallback(({ name, values }) => {
    updateFilters({ name, values, setFilters });
    if (onCloseDetailView) onCloseDetailView();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSubjectHeadingsFacetOptions = () => {
    return facets[FILTERS.SUBJECT_HEADINGS]?.values.map(value => {
      const subjectHeadingsName = Object.keys(subjectHeadingsMap).find(key => {
        return subjectHeadingsMap[key] === value.id;
      });

      return {
        id: value.id,
        label: subjectHeadingsName,
        totalRecords: value.totalRecords,
      };
    });
  };

  return (
    <>
      <ReferencesFilter
        activeFilters={filters?.[FILTERS.REFERENCES]}
        closedByDefault
        disabled={isLoading}
        id={FILTERS.REFERENCES}
        onChange={applyFilters}
        name={FILTERS.REFERENCES}
        navigationSegment={navigationSegmentValue}
      />
      <MultiSelectionFacet
        id={FILTERS.SUBJECT_HEADINGS}
        label={intl.formatMessage({ id: `stripes-authority-components.search.${FILTERS.SUBJECT_HEADINGS}` })}
        name={FILTERS.SUBJECT_HEADINGS}
        open={filterAccordions[FILTERS.SUBJECT_HEADINGS]}
        options={getSubjectHeadingsFacetOptions()}
        selectedValues={filters[FILTERS.SUBJECT_HEADINGS]}
        onFilterChange={applyFilters}
        onClearFilter={filter => onClearFilter({ filter, setFilters })}
        displayClearButton={!!filters[FILTERS.SUBJECT_HEADINGS]?.length}
        handleSectionToggle={handleSectionToggle}
        isPending={isLoading}
      />
      <MultiSelectionFacet
        id={FILTERS.HEADING_TYPE}
        label={intl.formatMessage({ id: `stripes-authority-components.search.${FILTERS.HEADING_TYPE}` })}
        name={FILTERS.HEADING_TYPE}
        open={filterAccordions[FILTERS.HEADING_TYPE]}
        options={facets[FILTERS.HEADING_TYPE]?.values}
        selectedValues={filters[FILTERS.HEADING_TYPE]}
        onFilterChange={applyFilters}
        onClearFilter={filter => onClearFilter({ filter, setFilters })}
        displayClearButton={!!filters[FILTERS.HEADING_TYPE]?.length}
        handleSectionToggle={handleSectionToggle}
        isPending={isLoading}
      />
      <AcqDateRangeFilter
        activeFilters={filters?.createdDate || []}
        labelId="stripes-authority-components.search.createdDate"
        id={FILTERS.CREATED_DATE}
        name={FILTERS.CREATED_DATE}
        onChange={applyFilters}
        disabled={isLoading}
        closedByDefault
        dateFormat={DATE_FORMAT}
      />
      <AcqDateRangeFilter
        activeFilters={filters?.updatedDate || []}
        labelId="stripes-authority-components.search.updatedDate"
        id={FILTERS.UPDATED_DATE}
        name={FILTERS.UPDATED_DATE}
        onChange={applyFilters}
        disabled={isSearching}
        closedByDefault
        dateFormat={DATE_FORMAT}
      />
    </>
  );
};

SearchFilters.propTypes = propTypes;

SearchFilters.defaultProps = {
  cqlQuery: '',
  onCloseDetailView: null,
};

export default SearchFilters;
