import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useUsers = ids => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'users' });

  const { isFetching, data } = useQuery(
    [namespace],
    async () => {
      return ky.get('users', {
        searchParams: {
          query: ids.join(' or '),
        },
      }).json();
    }, {
      enabled: Boolean(ids.length),
    },
  );

  return ({
    users: data?.users || [],
    isLoading: isFetching,
  });
};
