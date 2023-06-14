import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

const useAuthorityMappingRules = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'authority-mapping-rules' });

  const { isFetching, data } = useQuery(
    [namespace],
    async () => {
      return ky.get('mapping-rules/marc-authority').json();
    },
  );

  return ({
    authorityMappingRules: data || {},
    isLoading: isFetching,
  });
};

export default useAuthorityMappingRules;
