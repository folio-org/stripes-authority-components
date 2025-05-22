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
import { useAuthority } from './useAuthority';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Given useAuthority', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({
      authorities: [],
      totalRecords: 100,
    }),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch authority file', async () => {
    const recordId = 'test-id';
    const { result } = renderHook(() => useAuthority({ recordId }), { wrapper });

    await act(async () => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith('search/authorities', {
      searchParams: { query: `(id==${recordId})`, limit: 0 },
    });
  });

  it('should fetch authority file in batches', async () => {
    const recordId = 'test-id';
    const { result } = renderHook(() => useAuthority({ recordId }), { wrapper });

    await act(async () => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith('search/authorities', {
      searchParams: { query: `(id==${recordId})`, limit: 500, offset: 0, expandAll: true },
    });
  });
});
