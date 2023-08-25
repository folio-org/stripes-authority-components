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
import { AuthoritySourceFilter } from '../AuthoritySourceFilter';
import { SubjectHeadingsFilter } from '../SubjectHeadingsFilter';
import { SharedFilter } from '../SharedFilter';
import { useSectionToggle } from '../hooks';
import { useFacets } from '../queries';
import { FILTERS } from '../constants';
import {
  getSelectedFacets,
  onClearFilter,
  updateFilters,
} from '../utils';

const DATE_FORMAT = 'YYYY-MM-DD';

const propTypes = {
  cqlQuery: PropTypes.string,
  excludedFilters: PropTypes.instanceOf(Set),
  isSearching: PropTypes.bool.isRequired,
};

const SearchFilters = ({
  isSearching,
  cqlQuery,
  excludedFilters,
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
    [FILTERS.AUTHORITY_SOURCE]: true,
    [FILTERS.SHARED]: false,
  });

  const selectedFacets = getSelectedFacets(filterAccordions);

  const { isLoading, facets = {} } = useFacets({
    query: cqlQuery,
    selectedFacets,
  });

  const applyFilters = useCallback(({ name, values }) => {
    updateFilters({ name, values, setFilters });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isVisible = filter => !excludedFilters.has(filter);

  return (
    <>
      {isVisible(FILTERS.SHARED) &&
        <SharedFilter
          activeFilters={filters?.[FILTERS.SHARED]}
          open={filterAccordions[FILTERS.SHARED]}
          options={facets[FILTERS.SHARED]?.values || []}
          selectedValues={filters[FILTERS.SHARED]}
          onFilterChange={applyFilters}
          handleSectionToggle={handleSectionToggle}
          onClearFilter={filter => onClearFilter({ filter, setFilters })}
          disabled={isLoading}
        />
      }
      {isVisible(FILTERS.AUTHORITY_SOURCE) &&
        <AuthoritySourceFilter
          open={filterAccordions[FILTERS.AUTHORITY_SOURCE]}
          options={facets[FILTERS.AUTHORITY_SOURCE]?.values || []}
          selectedValues={filters[FILTERS.AUTHORITY_SOURCE]}
          onClearFilter={filter => onClearFilter({ filter, setFilters })}
          onFilterChange={applyFilters}
          handleSectionToggle={handleSectionToggle}
          isLoading={isLoading}
        />
      }
      {isVisible(FILTERS.REFERENCES) &&
        <ReferencesFilter
          activeFilters={filters?.[FILTERS.REFERENCES]}
          closedByDefault
          disabled={isLoading}
          id={FILTERS.REFERENCES}
          onChange={applyFilters}
          name={FILTERS.REFERENCES}
          navigationSegment={navigationSegmentValue}
        />
      }
      {isVisible(FILTERS.SUBJECT_HEADINGS) &&
        <SubjectHeadingsFilter
          open={filterAccordions[FILTERS.SUBJECT_HEADINGS]}
          options={facets[FILTERS.SUBJECT_HEADINGS]?.values || []}
          selectedValues={filters[FILTERS.SUBJECT_HEADINGS]}
          onClearFilter={filter => onClearFilter({ filter, setFilters })}
          onFilterChange={applyFilters}
          handleSectionToggle={handleSectionToggle}
          isLoading={isLoading}
        />
      }
      {isVisible(FILTERS.HEADING_TYPE) &&
        <MultiSelectionFacet
          id={FILTERS.HEADING_TYPE}
          label={intl.formatMessage({ id: `stripes-authority-components.search.${FILTERS.HEADING_TYPE}` })}
          name={FILTERS.HEADING_TYPE}
          open={filterAccordions[FILTERS.HEADING_TYPE]}
          options={facets[FILTERS.HEADING_TYPE]?.values || []}
          selectedValues={filters[FILTERS.HEADING_TYPE]}
          onFilterChange={applyFilters}
          onClearFilter={filter => onClearFilter({ filter, setFilters })}
          displayClearButton={!!filters[FILTERS.HEADING_TYPE]?.length}
          handleSectionToggle={handleSectionToggle}
          isPending={isLoading}
        />
      }
      {isVisible(FILTERS.CREATED_DATE) &&
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
      }
      {isVisible(FILTERS.UPDATED_DATE) &&
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
      }
    </>
  );
};

SearchFilters.propTypes = propTypes;

SearchFilters.defaultProps = {
  cqlQuery: '',
  excludedFilters: new Set(),
};

export default SearchFilters;
