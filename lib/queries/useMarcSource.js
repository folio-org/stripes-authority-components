import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from '../temp/hooks/useTenantKy';
import { QUERY_KEY_AUTHORITY_SOURCE } from '../constants';

const MARC_SOURCE_API = id => `source-storage/records/${id}/formatted?idType=AUTHORITY`;

export const useMarcSource = ({ recordId, tenantId, enabled = true }, { onError }) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITY_SOURCE });

  const { isFetching, data } = useQuery(
    [namespace, recordId],
    async () => {
      return ky.get(MARC_SOURCE_API(recordId)).json()
        .catch(onError);
    }, {
      enabled,
    },
  );

  return ({
    data,
    isLoading: isFetching,
  });
};
