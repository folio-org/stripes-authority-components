import {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import template from 'lodash/template';

import { AuthoritiesSearchContext } from '../';
import { ReferencesFilter } from '../ReferencesFilter';
import { MultiSelectionFacet } from '../MultiSelectionFacet';
import { AuthoritySourceFilter } from '../AuthoritySourceFilter';
import { SharedFilter } from '../SharedFilter';
import { useSectionToggle } from '../hooks';
import { useFacets } from '../queries';
import {
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

  // for search we would take whatever value user has entered in the search box and build facets query with that
  // but for browse we can use '*' as an entered value since we're browsing across all the records
  // and instead of using `headingRef>=query or headingRef<query` we can use `personalName all "*" or or sftPersonalName all "*"...`
  // this allows us to get correct facets values that depend on which heading type we're browsing

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

    const compiledQuery = compileQuery({ query: ALL_QUERY });

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
