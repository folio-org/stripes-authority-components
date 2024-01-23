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
import { useUsers } from './useUsers';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Given useUsers', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({
      users: [],
      totalRecords: 0,
    }),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch users with correct ids', async () => {
    const ids = ['id-1', 'id-2', 'id-3'];

    const { result } = renderHook(() => useUsers(ids), { wrapper });

    await act(async () => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith('users', { searchParams: { query: 'id-1 or id-2 or id-3' } });
  });
});
