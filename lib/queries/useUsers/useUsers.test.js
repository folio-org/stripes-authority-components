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
    jest.clearAllMocks();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch users with correct ids', async () => {
    const ids = ['id-1', 'id-2', 'id-3'];

    const { result } = renderHook(() => useUsers(ids), { wrapper });

    await act(async () => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith('users', { searchParams: { query: 'id=="id-1" or id=="id-2" or id=="id-3"' } });
  });

  describe('when passing a tenantId argument', () => {
    it('should pass it to useOkapiKy', async () => {
      const ids = ['id-1'];
      const tenantId = 'consortium';

      renderHook(() => useUsers(ids, tenantId), { wrapper });

      expect(useOkapiKy).toHaveBeenCalledWith(expect.objectContaining({ tenant: tenantId }));
    });
  });

  describe('when ids parameter contains new data', () => {
    it('should make a new request', async () => {
      const ids = ['id-1'];

      const hook = renderHook((props) => useUsers(props), { wrapper, initialProps: ids });

      await act(async () => !hook.result.current.isLoading);

      expect(mockGet).toHaveBeenCalledWith('users', { searchParams: { query: 'id=="id-1"' } });

      const newIds = ['id-1', 'id-2'];

      hook.rerender(newIds);

      await act(async () => !hook.result.current.isLoading);

      expect(mockGet).toHaveBeenCalledWith('users', { searchParams: { query: 'id=="id-1" or id=="id-2"' } });
    });
  });
});
