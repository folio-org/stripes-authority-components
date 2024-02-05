import {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useQuery } from 'react-query';
import queryString from 'query-string';
import remove from 'lodash/remove';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { buildHeadingTypeQuery } from '../utils';
import {
  filterConfig,
  navigationSegments,
  QUERY_KEY_AUTHORITIES,
  searchableIndexesValues,
} from '../../constants';
import { useDidUpdate } from '../../hooks';

const AUTHORITIES_BROWSE_API = 'browse/authorities';

const buildQuery = (searchString, searchIndex, filters) => {
  const cqlSearch = searchString ? [searchString] : [];

  cqlSearch.push(`isTitleHeadingRef==${searchIndex === searchableIndexesValues.NAME_TITLE}`);

  const cqlFilters = Object.entries(filters)
    .filter(([, filterValues]) => filterValues.length)
    .map(([filterName, filterValues]) => {
      const filterData = filterConfig.find(filter => filter.name === filterName);

      return filterData ? filterData.parse(filterValues) : null;
    });

  const headingTypeQuery = buildHeadingTypeQuery(searchIndex);

  const query = [...cqlSearch, ...cqlFilters, headingTypeQuery].filter(Boolean).join(' and ');

  return query;
};

const useBrowseRequest = ({
  filters,
  searchQuery,
  searchIndex,
  startingSearch,
  pageSize,
  precedingRecordsCount,
  tenantId,
}) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });

  const query = buildQuery(startingSearch, searchIndex, filters);

  const searchParams = {
    query,
    limit: pageSize,
    precedingRecordsCount,
  };

  const {
    isFetching,
    isFetched,
    data,
  } = useQuery(
    [namespace, 'authorities', searchParams],
    () => {
      if (!searchQuery && !Object.values(filters).find(value => value.length > 0)) {
        return { authorities: [], totalRecords: 0 };
      }

      const path = `${AUTHORITIES_BROWSE_API}?${queryString.stringify(searchParams)}`.replace(/\+/g, '%20');

      return ky.get(path).json();
    }, {
      keepPreviousData: true,
      // cacheTime: 0 should not be applied. Previous data is used in the useHighlightEditedRecord.
    },
  );

  return ({
    isFetched,
    isFetching,
    data,
    query,
  });
};

const useBrowserPaging = ({
  searchQuery,
  searchIndex,
  browsePageQuery,
  setBrowsePageQuery,
  navigationSegmentValue,
  browsePage,
  setBrowsePage,
}) => {
  const _searchQuery = searchQuery.replaceAll('"', '\\"');

  const buildPageQuery = (newQuery, newPage) => {
    const _newQuery = newQuery.replaceAll('"', '\\"');
    let pageQuery = '';

    if (newPage < browsePage) { // requested prev page
      pageQuery = `headingRef<"${_newQuery}"`;
    } else if (newPage > browsePage) { // requested next page
      pageQuery = `headingRef>"${_newQuery}"`;
    }

    if (newPage === 0) {
      pageQuery = `(headingRef>="${_searchQuery}" or headingRef<"${_searchQuery}")`;
    }

    return pageQuery;
  };

  const [pageQuery, setPageQuery] = useState(browsePageQuery || buildPageQuery(_searchQuery, 0));

  useDidUpdate(() => {
    // to save browsePageQuery for initial pageQuery we need to forbid resetting it after switching to another tab,
    // because history.push fires not right away.
    if (navigationSegmentValue !== navigationSegments.browse) {
      return;
    }

    setBrowsePage(0);
    setBrowsePageQuery('');
    setPageQuery(buildPageQuery(_searchQuery, 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_searchQuery, searchIndex, navigationSegmentValue]);

  return {
    buildPageQuery,
    pageQuery,
    setPageQuery,
  };
};

const useAuthoritiesBrowse = ({
  filters,
  searchQuery,
  searchIndex,
  pageSize,
  precedingRecordsCount,
  setBrowsePageQuery,
  browsePageQuery,
  browsePage,
  setBrowsePage,
  navigationSegmentValue,
  tenantId,
}) => {
  const [currentQuery, setCurrentQuery] = useState(searchQuery);
  const [currentIndex, setCurrentIndex] = useState(searchIndex);

  const {
    pageQuery,
    setPageQuery,
    buildPageQuery,
  } = useBrowserPaging({
    searchQuery,
    searchIndex,
    browsePageQuery,
    setBrowsePageQuery,
    navigationSegmentValue,
    browsePage,
    setBrowsePage,
  });

  useEffect(() => {
    setCurrentQuery(searchQuery);
    setCurrentIndex(searchIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchIndex]);

  const {
    data,
    isFetched,
    isFetching,
    query,
  } = useBrowseRequest({
    filters,
    searchQuery: currentQuery,
    startingSearch: pageQuery,
    searchIndex: currentIndex,
    pageSize,
    precedingRecordsCount,
    tenantId,
  });

  const hasEmptyAnchor = useMemo(() => {
    return (browsePage === 0 && data?.totalRecords !== 0 && !!data?.items.find(item => !item.authority));
  }, [data, browsePage]);

  const itemsWithoutEmptyHeadingRef = useMemo(() => {
    const authorities = [...(data?.items || [])];

    // remove item with an empty headingRef which appears
    // when apply Type of heading facet without search query
    remove(authorities, item => !item.authority && !item.headingRef);

    return authorities;
  }, [data]);

  const handleLoadMore = (_askAmount, _index, _firstIndex, direction) => {
    if (direction === 'prev') { // clicked Prev
      const newPageQuery = buildPageQuery(data?.prev, browsePage - 1);

      setBrowsePageQuery(newPageQuery);
      setPageQuery(newPageQuery);
      setBrowsePage(browsePage - 1);
    } else { // clicked Next
      const newPageQuery = buildPageQuery(data?.next, browsePage + 1);

      setBrowsePageQuery(newPageQuery);
      setPageQuery(newPageQuery);
      setBrowsePage(browsePage + 1);
    }
  };

  // totalRecords doesn't include empty anchor item and it will cause issues with MCL pagination
  // we need to manually add 1 to totalRecords to account for this
  const totalRecords = data?.totalRecords + (hasEmptyAnchor ? 1 : 0);

  return ({
    totalRecords,
    authorities: itemsWithoutEmptyHeadingRef,
    hasPrevPage: !!data?.prev,
    hasNextPage: !!data?.next,
    isLoading: isFetching,
    isLoaded: isFetched,
    handleLoadMore,
    query,
    firstPageQuery: buildQuery(buildPageQuery(searchQuery, 0), searchIndex, filters),
  });
};

export default useAuthoritiesBrowse;
