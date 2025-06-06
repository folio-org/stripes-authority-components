import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useUsers = (ids, tenantId) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'users' });

  const userIdSearchParams = ids.map(id => `id=="${id}"`);

  const { isFetching, data } = useQuery(
    [namespace, userIdSearchParams, tenantId],
    async () => {
      return ky.get('users', {
        searchParams: {
          query: userIdSearchParams.join(' or '),
        },
      }).json();
    }, {
      enabled: Boolean(userIdSearchParams.length),
    },
  );

  return ({
    users: data?.users || [],
    isLoading: isFetching,
  });
};
