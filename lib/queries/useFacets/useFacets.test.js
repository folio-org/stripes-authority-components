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
import useFacets from './useFacets';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Given useFacets', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({
      facets: {},
      totalRecords: 0,
    }),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch facets', async () => {
    const { result } = renderHook(() => useFacets({
      query: 'test=abc',
      selectedFacets: ['filterA', 'filterB'],
    }), { wrapper });

    await act(async () => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith('search/authorities/facets?facet=filterA%2CfilterB&query=test%3Dabc');
  });

  describe('when filters change', () => {
    it('should re-fetch facets', async () => {
      const { result, rerender } = renderHook(() => useFacets({
        query: 'test=abc',
        selectedFacets: ['filterA'],
      }), { wrapper });

      await act(async () => !result.current.isLoading);

      expect(mockGet).toHaveBeenCalledWith('search/authorities/facets?facet=filterA&query=test%3Dabc');

      rerender({ selectedFacets: ['filterB'] });

      expect(mockGet).toHaveBeenCalledWith('search/authorities/facets?facet=filterA%2CfilterB&query=test%3Dabc');
    });
  });
});
