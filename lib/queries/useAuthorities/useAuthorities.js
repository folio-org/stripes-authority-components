import {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useQuery } from 'react-query';
import queryString from 'query-string';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { QUERY_KEY_AUTHORITIES } from '../../constants';
import { getCqlQueryForSearchLookup } from '../../utils';

const AUTHORITIES_API = 'search/authorities';

const useAuthorities = ({
  searchQuery,
  searchIndex,
  advancedSearch,
  isAdvancedSearch,
  filters,
  pageSize,
  sortOrder,
  sortedColumn,
  enabled,
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(0);
  }, [
    searchQuery,
    searchIndex,
    advancedSearch,
    filters,
    sortOrder,
    sortedColumn,
  ]);

  const cqlQuery = getCqlQueryForSearchLookup({
    isAdvancedSearch,
    advancedSearch,
    filters,
    searchIndex,
    searchQuery,
    sortOrder,
    sortedColumn,
  });

  const searchParams = {
    query: cqlQuery,
    limit: pageSize,
    offset,
  };

  const {
    isFetching,
    isFetched,
    data,
  } = useQuery(
    [namespace, searchParams],
    async () => {
      if (!searchQuery && !Object.values(filters).find(value => value.length > 0)) {
        return { authorities: [], totalRecords: 0 };
      }

      const path = `${AUTHORITIES_API}?${queryString.stringify(searchParams)}`.replace(/\+/g, '%20');

      return ky.get(path).json();
    }, {
      keepPreviousData: true,
      enabled,
    },
  );

  const authoritiesWithNull = useMemo(() => {
    const authoritiesArray = new Array(offset);

    authoritiesArray.splice(offset, 0, ...data?.authorities || []);

    return authoritiesArray;
    // eslint-disable-next-line
  }, [data?.authorities]);

  return ({
    totalRecords: data?.totalRecords || 0,
    authorities: authoritiesWithNull,
    isLoading: isFetching,
    isLoaded: isFetched,
    query: cqlQuery,
    setOffset,
  });
};

export default useAuthorities;
