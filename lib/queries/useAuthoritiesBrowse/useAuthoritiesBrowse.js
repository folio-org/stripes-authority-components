import {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useQuery } from 'react-query';
import queryString from 'query-string';
import get from 'lodash/get';
import remove from 'lodash/remove';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { buildHeadingTypeQuery } from '../utils';
import {
  filterConfig,
  QUERY_KEY_AUTHORITIES,
  searchableIndexesValues,
} from '../../constants';

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

  const firstResult = isFetching ? null : get(data, 'items[0].headingRef');
  const lastResult = isFetching ? null : get(data, `items[${data?.items?.length - 1}].headingRef`);

  return ({
    isFetched,
    isFetching,
    data,
    firstResult,
    lastResult,
    query,
  });
};

const useBrowserPaging = (initialQuery, initialIndex) => {
  const _initialQuery = initialQuery.replaceAll('"', '\\"');
  const [page, setPage] = useState(0);

  const getMainRequestSearch = (newQuery, newPage) => {
    let newMainRequestSearch = [];
    const _newQuery = newQuery.replaceAll('"', '\\"');

    if (newPage < page) { // requested prev page
      newMainRequestSearch = [`headingRef<"${_newQuery}"`];
    } else if (newPage > page) { // requested next page
      newMainRequestSearch = [`headingRef>"${_newQuery}"`];
    }

    if (newPage === 0) {
      newMainRequestSearch = [`(headingRef>="${_initialQuery}" or headingRef<"${_initialQuery}")`];
    }

    return newMainRequestSearch;
  };

  const [mainRequestSearch, setMainRequestSearch] = useState(getMainRequestSearch(_initialQuery, 0));

  const updatePage = (newPage, newQuery) => {
    if (!newQuery) {
      return;
    }

    setPage(newPage);
    setMainRequestSearch(getMainRequestSearch(newQuery, newPage));
  };

  useEffect(() => {
    updatePage(0, _initialQuery);
    setMainRequestSearch(getMainRequestSearch(_initialQuery, 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_initialQuery, initialIndex]);

  return {
    page,
    setPage: updatePage,
    getMainRequestSearch,
    mainRequestSearch,
  };
};

const useAuthoritiesBrowse = ({
  filters,
  searchQuery,
  searchIndex,
  pageSize,
  precedingRecordsCount,
}) => {
  const [currentQuery, setCurrentQuery] = useState(searchQuery);
  const [currentIndex, setCurrentIndex] = useState(searchIndex);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(0);
  }, [
    searchQuery,
    searchIndex,
    filters,
  ]);

  const {
    page,
    setPage,
    mainRequestSearch,
  } = useBrowserPaging(searchQuery, searchIndex);

  useEffect(() => {
    setCurrentQuery(searchQuery);
    setCurrentIndex(searchIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchIndex]);

  const {
    data,
    firstResult,
    isFetched,
    isFetching,
    lastResult,
    query,
  } = useBrowseRequest({
    filters,
    searchQuery: currentQuery,
    startingSearch: mainRequestSearch,
    searchIndex: currentIndex,
    pageSize,
    precedingRecordsCount,
  });

  const hasEmptyAnchor = useMemo(() => {
    return (page === 0 && data?.totalRecords !== 0 && !!data?.items.find(item => !item.authority));
  }, [data, page]);

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
      setOffset(prev => (prev < 100 ? 0 : prev - 100));
      setPage(page - 1, firstResult);
    } else { // clicked Next
      setOffset(prev => prev + 100);
      setPage(page + 1, lastResult);
    }
  };

  // totalRecords doesn't include empty anchor item and it will cause issues with MCL pagination
  // we need to manually add 1 to totalRecords to account for this
  const totalRecords = data?.totalRecords + (hasEmptyAnchor ? 1 : 0);

  return ({
    totalRecords,
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
