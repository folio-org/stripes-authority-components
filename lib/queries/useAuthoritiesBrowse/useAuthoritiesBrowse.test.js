import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, act } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';

import { useOkapiKy } from '@folio/stripes/core';

import useAuthoritiesBrowse from './useAuthoritiesBrowse';
import Harness from '../../../test/jest/helpers/harness';
import {
  FILTERS,
  REFERENCES_VALUES_MAP,
  searchableIndexesValues,
} from '../../constants';

const mockSetBrowsePageQuery = jest.fn();
const mockSetBrowsePage = jest.fn();

const history = createMemoryHistory();

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <Harness history={history}>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </Harness>
);

const decodeURIWithEquals = (string) => {
  return decodeURI(string).replace(/%3D/g, '=');
};

describe('Given useAuthoritiesBrowse', () => {
  const filters = {};
  const searchQuery = 'test';
  const searchIndex = searchableIndexesValues.PERSONAL_NAME;
  const precedingRecordsCount = 5;
  const navigationSegmentValue = 'browse';
  const setBrowsePageQuery = mockSetBrowsePageQuery;
  const setBrowsePage = mockSetBrowsePage;
  const browsePage = 0;

  const generateTestAuthorities = (count, headingRef = 'authority') => new Array(count).fill({})
    .map((_, index) => ({
      headingRef: `${headingRef}_${index}`,
    }));

  const mockGet = jest.fn();

  beforeEach(() => {
    let callCount = 0;

    queryClient.clear();
    mockGet.mockClear();
    mockSetBrowsePageQuery.mockClear();
    mockSetBrowsePage.mockClear();
    useOkapiKy.mockClear();
    mockGet.mockImplementation(() => ({
      json: () => Promise.resolve({
        items: generateTestAuthorities(50, `authority_${callCount++}`),
        totalRecords: 100,
        next: '"next-query"',
        prev: '"prev-query"',
      }),
    }));

    useOkapiKy.mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch main page', async () => {
    const pageSize = 20;

    const { result, waitFor } = renderHook(() => useAuthoritiesBrowse({
      filters,
      searchQuery: '"test"',
      searchIndex,
      pageSize,
      precedingRecordsCount,
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(decodeURIWithEquals(mockGet.mock.calls[0][0]))
      .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=(headingRef>="\\"test\\"" or headingRef<"\\"test\\"") and isTitleHeadingRef==false and headingType==("Personal Name")');
  });

  describe('when search query changes', () => {
    it('should request new data', async () => {
      const pageSize = 20;
      const initialProps = {
        filters,
        searchQuery,
        searchIndex,
        pageSize,
        precedingRecordsCount,
        navigationSegmentValue,
        setBrowsePageQuery,
        browsePage,
        setBrowsePage,
      };

      const { result, waitFor, rerender } = renderHook(useAuthoritiesBrowse, {
        initialProps,
        wrapper,
      });

      await waitFor(() => !result.current.isLoading);

      expect(mockGet).toHaveBeenCalledTimes(1);

      rerender({
        ...initialProps,
        searchQuery: 'test2',
      }, { wrapper });

      await waitFor(() => !result.current.isLoading);

      expect(mockGet).toHaveBeenCalledTimes(2);
      expect(decodeURIWithEquals(mockGet.mock.calls.at(-1)[0]))
        .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=(headingRef>="test2" or headingRef<"test2") and isTitleHeadingRef==false and headingType==("Personal Name")');
    });
  });

  describe('when filters are applied', () => {
    it('should request data based on the filters', async () => {
      const pageSize = 20;

      const { result, waitFor } = renderHook(() => useAuthoritiesBrowse({
        filters: {
          [FILTERS.REFERENCES]: [
            REFERENCES_VALUES_MAP.excludeSeeFrom,
            REFERENCES_VALUES_MAP.excludeSeeFromAlso,
          ],
        },
        searchQuery,
        searchIndex,
        pageSize,
        precedingRecordsCount,
      }), { wrapper });

      await waitFor(() => !result.current.isLoading);

      expect(mockGet).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('%28authRefType%3D%3D%28%22Authorized%22%29'), // (authRefType==("Authorized"))
      );
    });
  });

  it('should fetch the next page', async () => {
    const { result, waitFor, rerender } = renderHook(() => useAuthoritiesBrowse({
      filters,
      searchQuery,
      searchIndex,
      pageSize: 20,
      precedingRecordsCount,
      navigationSegmentValue,
      setBrowsePageQuery,
      browsePage,
      setBrowsePage,
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);
    await act(async () => { result.current.handleLoadMore(100, 95, 0, 'next'); });

    rerender();

    expect(mockSetBrowsePageQuery).toHaveBeenCalledWith('headingRef>"\\"next-query\\""');
    expect(decodeURIWithEquals(mockGet.mock.calls[1][0]))
      .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef>"\\"next-query\\"" and isTitleHeadingRef==false and headingType==("Personal Name")');
  });

  it('should fetch the previous page', async () => {
    const { result, waitFor, rerender } = renderHook(() => useAuthoritiesBrowse({
      filters,
      searchQuery,
      searchIndex,
      pageSize: 20,
      precedingRecordsCount,
      navigationSegmentValue,
      setBrowsePageQuery,
      browsePage,
      setBrowsePage,
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);
    await act(async () => { result.current.handleLoadMore(100, 95, 0, 'prev'); });

    rerender();

    expect(mockSetBrowsePageQuery).toHaveBeenCalledWith('headingRef<"\\"prev-query\\""');
    expect(decodeURIWithEquals(mockGet.mock.calls[1][0]))
      .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef<"\\"prev-query\\"" and isTitleHeadingRef==false and headingType==("Personal Name")');
  });

  describe('when the user navigates to another route', () => {
    it('should not reset browsePageQuery', async () => {
      const initialProps = {
        filters,
        searchQuery,
        searchIndex,
        pageSize: 20,
        precedingRecordsCount,
        navigationSegmentValue,
        setBrowsePageQuery,
        browsePage,
        setBrowsePage,
      };

      const { result, waitFor, rerender } = renderHook(useAuthoritiesBrowse, { initialProps, wrapper });

      await waitFor(() => !result.current.isLoading);

      expect(mockSetBrowsePageQuery).not.toHaveBeenCalled();

      await act(async () => { result.current.handleLoadMore(100, 95, 0, 'next'); });

      rerender({
        ...initialProps,
        navigationSegmentValue: 'search',
      });

      expect(mockSetBrowsePageQuery).not.toHaveBeenCalledWith('');
    });
  });
});
