import { useMemo } from 'react';
import { useQuery } from 'react-query';
import queryString from 'query-string';
import template from 'lodash/template';

import { escapeCqlValue } from '@folio/stripes/util';
import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  buildAdvancedSearchQuery,
  buildQuery,
} from '../utils';
import {
  filterConfig,
  searchableIndexesValues,
  QUERY_KEY_AUTHORITIES,
  navigationSegments,
} from '../../constants';
import { useDidUpdate } from '../../hooks';

const AUTHORITIES_API = 'search/authorities';

const getProcessedQuery = (query, searchIndex) => {
  const queryParam = searchIndex === searchableIndexesValues.IDENTIFIER
    ? query
    : query.trim();

  return escapeCqlValue(queryParam);
};

const buildAdvancedSearch = (advancedSearch, filters) => {
  const query = advancedSearch.reduce((acc, row, index) => {
    const rowTemplate = buildAdvancedSearchQuery({ ...row, filters });

    if (!rowTemplate) {
      return acc;
    }

    const queryParam = getProcessedQuery(row.query, row.searchOption);
    const rowQuery = rowTemplate.replaceAll('%{query}', queryParam);

    if (index === 0) {
      return rowQuery;
    }

    const formattedRow = `${row.bool} ${rowQuery}`.trim();

    return `${acc} ${formattedRow}`;
  }, '').trim();

  return [query];
};

const buildRegularSearch = (searchIndex, query, filters) => {
  const compileQuery = template(
    buildQuery({
      searchIndex,
      filters,
      query,
    }),
    { interpolate: /%{([\s\S]+?)}/g },
  );

  const cqlSearch = [];

  if (query) {
    const queryParam = getProcessedQuery(query, searchIndex);
    const compiledQuery = compileQuery({ query: queryParam });

    cqlSearch.push(compiledQuery);
  }

  return cqlSearch;
};

const useAuthorities = ({
  searchQuery,
  searchIndex,
  advancedSearch,
  isAdvancedSearch,
  filters,
  pageSize,
  sortOrder,
  sortedColumn,
  offset,
  setOffset,
  navigationSegmentValue,
  tenantId,
}) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });

  useDidUpdate(() => {
    // to save offset for initial offset we need to forbid resetting it after switching to another tab,
    // because history.push fires not right away.
    if (navigationSegmentValue !== navigationSegments.search) {
      return;
    }

    setOffset(0);
  }, [
    searchQuery,
    searchIndex,
    advancedSearch,
    filters,
    sortOrder,
    sortedColumn,
    navigationSegmentValue,
  ]);

  let cqlSearch = [];

  if (isAdvancedSearch) {
    cqlSearch = buildAdvancedSearch(advancedSearch, filters);
  } else {
    cqlSearch = buildRegularSearch(searchIndex, searchQuery, filters);
  }

  const cqlFilters = Object.entries(filters)
    .filter(([, filterValues]) => filterValues.length)
    .map(([filterName, filterValues]) => {
      const filterData = filterConfig.find(filter => filter.name === filterName);

      return filterData.parse(filterValues);
    });

  let cqlQuery = [...cqlSearch, ...cqlFilters].join(' and ');

  if (sortOrder && sortedColumn) {
    cqlQuery += ` sortBy ${sortedColumn}/sort.${sortOrder}`;
  } else if (cqlQuery) {
    cqlQuery += ' sortBy headingRef/sort.ascending';
  }

  const searchParams = {
    query: cqlQuery,
    limit: pageSize,
    offset,
  };

  const {
    isFetching,
    isFetched,
    data,
    error,
  } = useQuery(
    [namespace, searchParams],
    () => {
      if (!searchQuery && !Object.values(filters).find(value => value.length > 0)) {
        return { authorities: [], totalRecords: 0 };
      }

      const path = `${AUTHORITIES_API}?${queryString.stringify(searchParams)}`.replace(/\+/g, '%20');

      return ky.get(path).json();
    }, {
      keepPreviousData: true,
      // cacheTime: 0 should not be applied. Previous data is used in the useHighlightEditedRecord.
    },
  );

  const authoritiesWithNull = useMemo(() => {
    const authoritiesArray = new Array(offset);

    authoritiesArray.splice(offset, 0, ...data?.authorities || []);

    return authoritiesArray;
    // Don't add `offset` to deps, it is added to the `authoritiesArray` after the data is loaded
    // and allows us to focus on the NEW first row rather than the old one.
    // eslint-disable-next-line
  }, [data?.authorities]);

  return ({
    totalRecords: data?.totalRecords || 0,
    authorities: authoritiesWithNull,
    isLoading: isFetching,
    isLoaded: isFetched,
    query: cqlQuery,
    error,
  });
};

export default useAuthorities;
