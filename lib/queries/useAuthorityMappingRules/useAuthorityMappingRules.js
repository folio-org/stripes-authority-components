import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from '../../temp/hooks/useTenantKy';

const defaultArgs = {
  enabled: true,
};

const useAuthorityMappingRules = ({ tenantId, enabled = true } = defaultArgs) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'authority-mapping-rules' });

  const { isFetching, data } = useQuery(
    [namespace],
    async () => {
      return ky.get('mapping-rules/marc-authority').json();
    }, {
      enabled,
    },
  );

  return ({
    authorityMappingRules: data || {},
    isLoading: isFetching,
  });
};

export default useAuthorityMappingRules;
