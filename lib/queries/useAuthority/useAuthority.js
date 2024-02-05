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

  const { isFetching, data = [] } = useQuery(
    [namespace, 'authority', recordId],
    async () => {
      const { totalRecords } = await ky.get(AUTHORITIES_API, { searchParams: { ...searchParams, limit: 0 } }).json()
        .catch(onError);

      const authorityBatchesPromises = (Array(Math.ceil(totalRecords / AUTHORITY_CHUNK_SIZE)))
        .fill(null)
        .map((a, index) => {
          return ky.get(
            AUTHORITIES_API,
            { searchParams: { ...searchParams, limit: AUTHORITY_CHUNK_SIZE, offset: index * AUTHORITY_CHUNK_SIZE } },
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

  let authorityByAuthRefType = null;

  // can only be one Authorized record - can ignore headingRef
  if (authRefType === AUTH_REF_TYPES.AUTHORIZED) {
    authorityByAuthRefType = find(data, matches({ authRefType }));
  } else {
    authorityByAuthRefType = filter(data, matches({ authRefType, headingRef }))[0];
  }

  return ({
    data: authorityByAuthRefType || data[0],
    isLoading: isFetching,
    allData: data,
  });
};
