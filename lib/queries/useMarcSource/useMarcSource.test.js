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
import { useMarcSource } from './useMarcSource';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Given useMarcSource', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch source file', async () => {
    const recordId = 'test-id';
    const { result } = renderHook(() => useMarcSource({ recordId }), { wrapper });

    await act(async () => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith(`source-storage/records/${recordId}/formatted?idType=AUTHORITY`);
  });

  describe('when `enabled` param is false', () => {
    it('should not send a request', async () => {
      const recordId = 'test-id';
      const { result } = renderHook(() => useMarcSource({ recordId, enabled: false }), { wrapper });

      await act(async () => !result.current.isLoading);

      expect(mockGet).not.toHaveBeenCalled();
    });
  });
});
