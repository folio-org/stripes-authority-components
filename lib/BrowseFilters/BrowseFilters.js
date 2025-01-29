import {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import template from 'lodash/template';

import { escapeCqlValue } from '@folio/stripes/util';

import { AuthoritiesSearchContext } from '../';
import { ReferencesFilter } from '../ReferencesFilter';
import { MultiSelectionFacet } from '../MultiSelectionFacet';
import { AuthoritySourceFilter } from '../AuthoritySourceFilter';
import { SharedFilter } from '../SharedFilter';
import { useSectionToggle } from '../hooks';
import { useFacets } from '../queries';
import {
  searchableIndexesValues,
  FILTERS,
  filterConfig,
} from '../constants';
import {
  getSelectedFacets,
  onClearFilter,
  updateFilters,
} from '../utils';
import { buildQuery } from '../queries/utils';

const propTypes = {
  excludedFilters: PropTypes.arrayOf(PropTypes.string),
  tenantId: PropTypes.string,
};

const getProcessedQuery = (query, searchIndex) => {
  const queryParam = searchIndex === searchableIndexesValues.IDENTIFIER
    ? query
    : query.trim();

  return escapeCqlValue(queryParam);
};

const BrowseFilters = ({
  excludedFilters = [],
  tenantId = null,
}) => {
  const intl = useIntl();
  const {
    searchIndex,
    filters,
    setFilters,
    navigationSegmentValue,
  } = useContext(AuthoritiesSearchContext);

  const ALL_QUERY = '*';

  const buildRegularSearch = useCallback(() => {
    const compileQuery = template(
      buildQuery({
        searchIndex,
        filters,
        query: ALL_QUERY,
      }),
      { interpolate: /%{([\s\S]+?)}/g },
    );

    const cqlSearch = [];

    const queryParam = getProcessedQuery(ALL_QUERY, searchIndex);
    const compiledQuery = compileQuery({ query: queryParam });

    cqlSearch.push(compiledQuery);

    return cqlSearch;
  }, [filters, searchIndex]);

  const cqlSearch = buildRegularSearch();

  const cqlFilters = Object.entries(filters)
    .filter(([, filterValues]) => filterValues.length)
    .map(([filterName, filterValues]) => {
      const filterData = filterConfig.find(filter => filter.name === filterName);

      return filterData.parse(filterValues);
    });

  const cqlQuery = [...cqlSearch, ...cqlFilters].join(' and ');

  const [filterAccordions, { handleSectionToggle }] = useSectionToggle({
    [FILTERS.SHARED]: false,
    [FILTERS.HEADING_TYPE]: false,
    [FILTERS.AUTHORITY_SOURCE]: true,
  });

  const selectedFacets = getSelectedFacets(filterAccordions);

  const { isLoading, facets = {} } = useFacets({
    query: cqlQuery,
    selectedFacets,
    tenantId,
  });

  const applyFilters = useCallback(({ name, values }) => {
    updateFilters({ name, values, setFilters });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isVisible = filter => !excludedFilters.includes(filter);

  return (
    <>
      {isVisible(FILTERS.SHARED) &&
        <SharedFilter
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
          tenantId={tenantId}
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

export default BrowseFilters;
