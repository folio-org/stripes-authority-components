import {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useQuery } from 'react-query';
import queryString from 'query-string';
import remove from 'lodash/remove';

import {
  useOkapiKy,
  useNamespace,
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

const useBrowseRequest = ({
  filters,
  searchQuery,
  searchIndex,
  startingSearch,
  pageSize,
  precedingRecordsCount,
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });

  const cqlSearch = startingSearch ? [startingSearch] : [];

  cqlSearch.push(`isTitleHeadingRef==${searchIndex === searchableIndexesValues.NAME_TITLE}`);

  const cqlFilters = Object.entries(filters)
    .filter(([, filterValues]) => filterValues.length)
    .map(([filterName, filterValues]) => {
      const filterData = filterConfig.find(filter => filter.name === filterName);

      return filterData ? filterData.parse(filterValues) : null;
    });

  const headingTypeQuery = buildHeadingTypeQuery(searchIndex);

  const query = [...cqlSearch, ...cqlFilters, headingTypeQuery].filter(Boolean).join(' and ');

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
      const path = `${AUTHORITIES_BROWSE_API}?${queryString.stringify(searchParams)}`.replace(/\+/g, '%20');

      return ky.get(path).json();
    }, {
      enabled: !(!searchQuery && !Object.values(filters).find(value => value.length > 0)),
      keepPreviousData: false,
      staleTime: 0,
      cacheTime: 0,
    },
  );

  return ({
    isFetched,
    isFetching,
    data,
    query,
  });
};

const useBrowserPaging = (searchQuery, searchIndex, browsePageQuery, setBrowsePageQuery, navigationSegmentValue) => {
  const _searchQuery = searchQuery.replaceAll('"', '\\"');

  const buildPageQuery = (newQuery, direction) => {
    const _newQuery = newQuery.replaceAll('"', '\\"');

    switch (direction) {
      case 'prev':
        return `headingRef<"${_newQuery}"`;
      case 'next':
        return `headingRef>"${_newQuery}"`;
      default:
        return `(headingRef>="${_searchQuery}" or headingRef<"${_searchQuery}")`;
    }
  };

  const [pageQuery, setPageQuery] = useState(browsePageQuery || buildPageQuery(_searchQuery));

  useDidUpdate(() => {
    // to save browsePageQuery for initial pageQuery we need to forbid resetting it after switching to another tab,
    // because history.push fires not right away.
    if (navigationSegmentValue !== navigationSegments.browse) {
      return;
    }

    setBrowsePageQuery('');
    setPageQuery(buildPageQuery(_searchQuery));
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
  navigationSegmentValue,
}) => {
  const [currentQuery, setCurrentQuery] = useState(searchQuery);
  const [currentIndex, setCurrentIndex] = useState(searchIndex);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!searchQuery && !searchIndex) {
      setOffset(0);
    }
  }, [searchQuery, searchIndex]);

  const {
    pageQuery,
    setPageQuery,
    buildPageQuery,
  } = useBrowserPaging(searchQuery, searchIndex, browsePageQuery, setBrowsePageQuery, navigationSegmentValue);

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
  });

  const itemsWithoutEmptyHeadingRef = useMemo(() => {
    const authorities = [...(data?.items || [])];

    // remove item with an empty headingRef which appears
    // when apply Type of heading facet without search query
    remove(authorities, item => !item.authority && !item.headingRef);

    return authorities;
  }, [data]);

  const authoritiesWithNull = useMemo(() => {
    const authoritiesArray = new Array(offset);

    authoritiesArray.splice(offset, 0, ...itemsWithoutEmptyHeadingRef);

    return authoritiesArray;
    // eslint-disable-next-line
  }, [itemsWithoutEmptyHeadingRef]);

  const handleLoadMore = (_askAmount, _index, _firstIndex, direction) => {
    if (direction === 'prev') { // clicked Prev
      const newPageQuery = buildPageQuery(data?.prev, direction);

      setOffset(prev => (prev < pageSize ? 0 : prev - pageSize));
      setBrowsePageQuery(newPageQuery);
      setPageQuery(newPageQuery);
    } else { // clicked Next
      const newPageQuery = buildPageQuery(data?.next, direction);

      setOffset(prev => prev + pageSize);
      setBrowsePageQuery(newPageQuery);
      setPageQuery(newPageQuery);
    }
  };

  return ({
    totalRecords: data?.totalRecords,
    authorities: isFetching ? [] : authoritiesWithNull, // to hide pagination buttons during loading
    hasPrevPage: !!data?.prev,
    hasNextPage: !!data?.next,
    isLoading: isFetching,
    isLoaded: isFetched,
    handleLoadMore,
    query,
  });
};

export default useAuthoritiesBrowse;
