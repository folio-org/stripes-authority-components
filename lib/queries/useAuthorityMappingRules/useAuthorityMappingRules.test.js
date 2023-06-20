import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import useAuthorityMappingRules from './useAuthorityMappingRules';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Given useAuthorityMappingRules', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({
      authoritySourceFiles: [],
    }),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch source files', async () => {
    const { result, waitFor } = renderHook(() => useAuthorityMappingRules(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalled();
  });
});
