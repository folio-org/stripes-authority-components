import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';
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
    const { result } = renderHook(() => useAuthorityMappingRules(), { wrapper });

    await act(async () => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalled();
  });
});
