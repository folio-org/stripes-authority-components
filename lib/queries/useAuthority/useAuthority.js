import { useQuery } from 'react-query';
import filter from 'lodash/filter';
import find from 'lodash/find';
import matches from 'lodash/matches';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { AUTH_REF_TYPES } from '../../constants';

const AUTHORITIES_API = 'search/authorities';
const AUTHORITY_CHUNK_SIZE = 500;

export const useAuthority = ({ recordId, tenantId, authRefType = null, headingRef = null }, { onError } = {}) => {
  const [namespace] = useNamespace();
  const ky = useOkapiKy({ tenant: tenantId });

  const searchParams = {
    query: `(id==${recordId})`,
  };

  const { isFetching, data = [], refetch } = useQuery(
    [namespace, 'authority', recordId],
    async () => {
      const { totalRecords } = await ky.get(AUTHORITIES_API, { searchParams: { ...searchParams, limit: 0 } }).json()
        .catch(onError);

      const authorityBatchesPromises = (Array(Math.ceil(totalRecords / AUTHORITY_CHUNK_SIZE)))
        .fill(null)
        .map((a, index) => {
          return ky.get(
            AUTHORITIES_API,
            { searchParams: { ...searchParams, limit: AUTHORITY_CHUNK_SIZE, offset: index * AUTHORITY_CHUNK_SIZE, expandAll: true } },
          ).json();
        });
      const authorityBatches = await Promise.all(authorityBatchesPromises);

      return authorityBatches.reduce((acc, { authorities = [] }) => {
        return [...acc, ...authorities];
      }, []);
    },
    {
      cacheTime:0,
    },
  );

  const retrieveSingeRecordFromResults = results => {
    let authorityByAuthRefType = null;

    // can only be one Authorized record - can ignore headingRef
    if (authRefType === AUTH_REF_TYPES.AUTHORIZED) {
      authorityByAuthRefType = find(results, matches({ authRefType }));
    } else {
      authorityByAuthRefType = filter(results, matches({ authRefType, headingRef }))[0];
    }

    return authorityByAuthRefType || results[0];
  };

  const refetchAndReturnSingleRecord = async () => {
    const { data: _data } = await refetch();

    return retrieveSingeRecordFromResults(_data);
  };

  return ({
    data: retrieveSingeRecordFromResults(data),
    isLoading: isFetching,
    allData: data,
    fetchAuthority: refetchAndReturnSingleRecord,
  });
};
