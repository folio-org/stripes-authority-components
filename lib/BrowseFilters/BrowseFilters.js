import {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { AuthoritiesSearchContext } from '../';
import { ReferencesFilter } from '../ReferencesFilter';
import { MultiSelectionFacet } from '../MultiSelectionFacet';
import { AuthoritySourceFilter } from '../AuthoritySourceFilter';
import { useSectionToggle } from '../hooks';
import { useFacets } from '../queries';
import { FILTERS } from '../constants';
import {
  getSelectedFacets,
  onClearFilter,
  updateFilters,
} from '../utils';

const propTypes = {
  cqlQuery: PropTypes.string,
  excludedFilters: PropTypes.instanceOf(Set),
};

const BrowseFilters = ({
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
    [FILTERS.AUTHORITY_SOURCE]: true,
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
      {isVisible(FILTERS.HEADING_TYPE) &&
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
      }
    </>
  );
};

BrowseFilters.propTypes = propTypes;

BrowseFilters.defaultProps = {
  cqlQuery: '',
  excludedFilters: new Set(),
};

export default BrowseFilters;
