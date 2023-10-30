import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';

import { useOkapiKy } from '@folio/stripes/core';

import Harness from '../../../test/jest/helpers/harness';
import useAuthorities from './useAuthorities';
import {
  searchResultListColumns,
  sortOrders,
  searchableIndexesValues,
} from '../../constants';

const history = createMemoryHistory();

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <Harness history={history}>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </Harness>
);

describe('Given useAuthorities', () => {
  const searchQuery = 'test';
  const searchIndex = searchableIndexesValues.KEYWORD;

  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({
      authorities: [],
      totalRecords: 0,
    }),
  }));
  const mockSetOffset = jest.fn();

  beforeEach(() => {
    queryClient.clear();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('fetches authorities records', async () => {
    const filters = {
      updatedDate: ['2021-01-01:2021-12-31'],
      subjectHeadings: ['Other'],
    };
    const pageSize = 20;

    const { result } = renderHook(() => useAuthorities({
      searchQuery,
      searchIndex,
      filters,
      pageSize,
      sortOrder: '',
      sortedColumn: '',
      offset: '100',
      setOffset: mockSetOffset,
      navigationSegmentValue: 'search',
    }), { wrapper });

    await act(async () => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalled();
  });

  describe('when sort options are presented', () => {
    describe('when sort order is "descending"', () => {
      it('should add "sortBy authRefType/sort.descending" to query', async () => {
        const { result } = renderHook(() => useAuthorities({
          searchQuery,
          searchIndex,
          filters: {},
          sortOrder: sortOrders.DES,
          sortedColumn: searchResultListColumns.AUTH_REF_TYPE,
          offset: '100',
          setOffset: mockSetOffset,
          navigationSegmentValue: 'search',
        }), { wrapper });

        await act(async () => !result.current.isLoading);

        expect(result.current.query).toEqual('(keyword=="test") sortBy authRefType/sort.descending');
      });
    });

    describe('when sort order is "descending"', () => {
      it('should add "sortBy authRefType/sort.ascending" to query', async () => {
        const { result } = renderHook(() => useAuthorities({
          searchQuery,
          searchIndex,
          filters: {},
          sortOrder: sortOrders.ASC,
          sortedColumn: searchResultListColumns.AUTH_REF_TYPE,
          offset: '100',
          setOffset: mockSetOffset,
          navigationSegmentValue: 'search',
        }), { wrapper });

        await act(async () => !result.current.isLoading);

        expect(result.current.query).toEqual('(keyword=="test") sortBy authRefType/sort.ascending');
      });
    });
  });

  describe('when query is not provided', () => {
    it('should return an empty string', async () => {
      const { result } = renderHook(() => useAuthorities({
        searchIndex,
        filters: {},
        sortOrder: '',
        sortedColumn: '',
        offset: '100',
        setOffset: mockSetOffset,
        navigationSegmentValue: 'search',
      }), { wrapper });

      await act(async () => !result.current.isLoading);

      expect(result.current.query).toEqual('');
    });
  });

  describe('when search by identifier', () => {
    it('should return correct query string', async () => {
      const { result } = renderHook(() => useAuthorities({
        searchQuery: 'n  00000001 ',
        searchIndex: searchableIndexesValues.IDENTIFIER,
        filters: {},
        sortOrder: '',
        sortedColumn: '',
        offset: '100',
        setOffset: mockSetOffset,
        navigationSegmentValue: 'search',
      }), { wrapper });

      await act(async () => !result.current.isLoading);

      expect(result.current.query).toBe(
        '((identifiers.value=="n  00000001 " or naturalId="n  00000001 ") and authRefType=="Authorized")',
      );
    });
  });

  describe('when isAdvancedSearch prop is true', () => {
    it('should form an advanced search query', async () => {
      let result_;

      await act(async () => {
        const { result } = renderHook(() => useAuthorities({
          searchQuery,
          searchIndex,
          isAdvancedSearch: true,
          advancedSearch: [{
            bool: 'and',
            query: 'advancedTest1',
            searchOption: searchableIndexesValues.KEYWORD,
          }, {
            bool: 'not',
            query: 'advancedTest2',
            searchOption: searchableIndexesValues.IDENTIFIER,
          }],
          filters: {},
          sortOrder: '',
          sortedColumn: '',
          offset: '0',
          setOffset: mockSetOffset,
          navigationSegmentValue: 'search',
        }), { wrapper });

        result_ = result;
      });

      expect(result_.current.query).toBe(
        '(keyword=="advancedTest1") not ((identifiers.value=="advancedTest2" or naturalId="advancedTest2") and authRefType=="Authorized")',
      );
    });

    it('should have LCCN search query', async () => {
      let result_;

      await act(async () => {
        const { result } = renderHook(() => useAuthorities({
          searchQuery,
          searchIndex,
          isAdvancedSearch: true,
          advancedSearch: [{
            bool: 'and',
            query: ' n  88173836 ',
            searchOption: searchableIndexesValues.LCCN,
          }, {
            bool: 'not',
            query: 'advancedTest2',
            searchOption: searchableIndexesValues.IDENTIFIER,
          }],
          filters: {},
          sortOrder: '',
          sortedColumn: '',
          offset: '0',
          setOffset: mockSetOffset,
          navigationSegmentValue: 'search',
        }), { wrapper });

        result_ = result;
      });

      expect(result_.current.query).toContain('lccn="n  88173836" not ((identifiers.value==');
    });
  });
});
