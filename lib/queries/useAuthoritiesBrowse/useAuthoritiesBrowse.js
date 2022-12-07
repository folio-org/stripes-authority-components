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

import { QUERY_KEY_AUTHORITIES } from '../../constants';
import {
  getCqlQueryForBrowseLookup,
  startingSearchForBrowseLookup,
} from '../../utils';

const AUTHORITIES_BROWSE_API = 'browse/authorities';

const useBrowseRequest = ({
  filters,
  searchQuery,
  searchIndex,
  startingSearch,
  pageSize,
  precedingRecordsCount,
  enabled,
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });


  const query = getCqlQueryForBrowseLookup({
    startingSearch,
    searchIndex,
    filters,
  });

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
    async () => {
      if (!searchQuery && !Object.values(filters).find(value => value.length > 0)) {
        return { items: [], totalRecords: 0 };
      }

      const path = `${AUTHORITIES_BROWSE_API}?${queryString.stringify(searchParams)}`.replace(/\+/g, '%20');

      return ky.get(path).json();
    }, {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
      enabled,
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
    startingSearch,
    query,
  });
};

const useBrowserPaging = (initialQuery, initialIndex) => {
  const [page, setPage] = useState(0);
  const [pageSearchCache, setPageSearchCache] = useState({});

  const getMainRequestSearch = (newQuery, newPage) => {
    if (pageSearchCache[newPage]) {
      return pageSearchCache[newPage];
    }

    let newMainRequestSearch = [];

    if (newPage < page) { // requested prev page
      newMainRequestSearch = [`headingRef<"${newQuery}"`];
    } else if (newPage > page) { // requested next page
      newMainRequestSearch = [`headingRef>"${newQuery}"`];
    }

    if (newPage === 0) {
      newMainRequestSearch = startingSearchForBrowseLookup(initialQuery);
    }

    return newMainRequestSearch;
  };

  const [mainRequestSearch, setMainRequestSearch] = useState(getMainRequestSearch(initialQuery, 0));

  const updatePage = (newPage, newQuery) => {
    if (!newQuery) {
      return;
    }

    setPage(newPage);
    setMainRequestSearch(getMainRequestSearch(newQuery, newPage));
    setPageSearchCache(currentPageSearchCache => ({
      ...currentPageSearchCache,
      [newPage]: currentPageSearchCache[newPage] || getMainRequestSearch(newQuery, newPage),
    }));
  };

  const resetPageCache = () => {
    setPageSearchCache({});
  };

  useEffect(() => {
    updatePage(0, initialQuery);
    setMainRequestSearch(getMainRequestSearch(initialQuery, 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, initialIndex]);

  return {
    page,
    setPage: updatePage,
    getMainRequestSearch,
    mainRequestSearch,
    resetPageCache,
  };
};

const useAuthoritiesBrowse = ({
  filters,
  searchQuery,
  searchIndex,
  pageSize,
  precedingRecordsCount,
  enabled,
}) => {
  const [currentQuery, setCurrentQuery] = useState(searchQuery);
  const [currentIndex, setCurrentIndex] = useState(searchIndex);
  const {
    page,
    setPage,
    mainRequestSearch,
    getMainRequestSearch,
    resetPageCache,
  } = useBrowserPaging(searchQuery, searchIndex);

  useEffect(() => {
    setCurrentQuery(searchQuery);
    setCurrentIndex(searchIndex);
    resetPageCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchIndex]);

  const mainRequest = useBrowseRequest({
    filters,
    searchQuery: currentQuery,
    startingSearch: mainRequestSearch,
    searchIndex: currentIndex,
    pageSize,
    precedingRecordsCount,
    enabled,
  });

  const prevPageRequest = useBrowseRequest({
    filters,
    searchQuery: mainRequest.firstResult,
    startingSearch: getMainRequestSearch(mainRequest.firstResult, page - 1),
    searchIndex: currentIndex,
    pageSize,
    precedingRecordsCount,
    enabled,
  });

  const nextPageRequest = useBrowseRequest({
    filters,
    searchQuery: mainRequest.lastResult,
    startingSearch: getMainRequestSearch(mainRequest.lastResult, page + 1),
    searchIndex: currentIndex,
    pageSize,
    precedingRecordsCount,
    enabled,
  });

  const allRequestsFetched = mainRequest.isFetched && prevPageRequest.isFetched && nextPageRequest.isFetched;
  const allRequestsFetching = mainRequest.isFetching || prevPageRequest.isFetching || nextPageRequest.isFetching;

  const hasEmptyAnchor = useMemo(() => {
    return (page === 0 && mainRequest.data?.totalRecords !== 0 && !!mainRequest.data?.items.find(item => !item.authority));
  }, [mainRequest.data, page]);

  const itemsWithoutEmptyHeadingRef = useMemo(() => {
    const authorities = [...(mainRequest.data?.items || [])];

    // remove item with an empty headingRef which appears
    // when apply Type of heading facet without search query
    remove(authorities, item => !item.authority && !item.headingRef);

    return authorities;
  }, [mainRequest.data]);

  const handleLoadMore = (_askAmount, _index, _firstIndex, direction) => {
    if (direction === 'prev') { // clicked Prev
      setPage(page - 1, mainRequest.firstResult);
    } else { // clicked Next
      setPage(page + 1, mainRequest.lastResult);
    }
  };

  // totalRecords doesn't include empty anchor item and it will cause issues with MCL pagination
  // we need to manually add 1 to totalRecords to account for this
  const totalRecords = mainRequest.data?.totalRecords + (hasEmptyAnchor ? 1 : 0);

  return ({
    totalRecords,
    authorities: itemsWithoutEmptyHeadingRef,
    hasPrevPage: !!prevPageRequest.data?.items?.length,
    hasNextPage: !!nextPageRequest.data?.items?.length,
    isLoading: allRequestsFetching,
    isLoaded: allRequestsFetched,
    handleLoadMore,
    query: mainRequest.query,
  });
};

export default useAuthoritiesBrowse;
