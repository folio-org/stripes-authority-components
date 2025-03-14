import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';

import { useOkapiKy } from '@folio/stripes/core';
import { ADVANCED_SEARCH_MATCH_OPTIONS } from '@folio/stripes/components';

import Harness from '../../../test/jest/helpers/harness';
import useAuthorities from './useAuthorities';
import {
  searchResultListColumns,
  sortOrders,
  searchableIndexesValues,
} from '../../constants';

const {
  EXACT_PHRASE,
  CONTAINS_ALL,
  STARTS_WITH,
  CONTAINS_ANY,
} = ADVANCED_SEARCH_MATCH_OPTIONS;

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

        expect(result.current.query).toEqual('(keyword all "test" or naturalId=="test" or identifiers.value=="test") sortBy authRefType/sort.descending');
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

        expect(result.current.query).toEqual('(keyword all "test" or naturalId=="test" or identifiers.value=="test") sortBy authRefType/sort.ascending');
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

  it('should have escaped query', async () => {
    let result_;

    await act(async () => {
      const { result } = renderHook(() => useAuthorities({
        searchQuery: 'Apple & "Honey" products',
        searchIndex: searchableIndexesValues.KEYWORD,
        isAdvancedSearch: false,
        advancedSearch: [],
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
      '(keyword all "Apple & \\"Honey\\" products" or naturalId=="Apple & \\"Honey\\" products" or identifiers.value=="Apple & \\"Honey\\" products")',
    );
  });

  describe('when the "Subject" search option is opted', () => {
    it('should build correct search query', async () => {
      let result_;

      await act(async () => {
        const { result } = renderHook(() => useAuthorities({
          searchQuery,
          searchIndex: searchableIndexesValues.SUBJECT,
          isAdvancedSearch: false,
          advancedSearch: [],
          filters: {},
          sortOrder: '',
          sortedColumn: '',
          offset: '0',
          setOffset: mockSetOffset,
          navigationSegmentValue: 'search',
        }), { wrapper });

        result_ = result;
      });

      expect(result_.current.query).toBe('(topicalTerm all "test" or sftTopicalTerm all "test"' +
        ' or saftTopicalTerm all "test" or namedEvent all "test" or sftNamedEvent all "test"' +
        ' or saftNamedEvent all "test" or generalSubdivision all "test" or sftGeneralSubdivision all "test"' +
        ' or saftGeneralSubdivision all "test" or chronTerm all "test" or sftChronTerm all "test"' +
        ' or saftChronTerm all "test" or mediumPerfTerm all "test" or sftMediumPerfTerm all "test"' +
        ' or saftMediumPerfTerm all "test" or geographicSubdivision all "test" or sftGeographicSubdivision all "test"' +
        ' or saftGeographicSubdivision all "test" or chronSubdivision all "test" or sftChronSubdivision all "test"' +
        ' or saftChronSubdivision all "test" or formSubdivision all "test" or sftFormSubdivision all "test"' +
        ' or saftFormSubdivision all "test")');
    });
  });

  describe('when the "Subject" search option is opted', () => {
    describe('and both filters "Exclude see from" and "Exclude see from also" are selected', () => {
      it('should build search query without sftTopicalTerm and saftTopicalTerm', async () => {
        let result_;

        await act(async () => {
          const { result } = renderHook(() => useAuthorities({
            searchQuery,
            searchIndex: searchableIndexesValues.SUBJECT,
            isAdvancedSearch: false,
            advancedSearch: [],
            filters: {
              references: ['excludeSeeFrom', 'excludeSeeFromAlso'],
            },
            sortOrder: '',
            sortedColumn: '',
            offset: '0',
            setOffset: mockSetOffset,
            navigationSegmentValue: 'search',
          }), { wrapper });

          result_ = result;
        });

        expect(result_.current.query).toBe('(topicalTerm all "test" or namedEvent all "test"' +
          ' or generalSubdivision all "test" or chronTerm all "test" or mediumPerfTerm all "test"' +
          ' or geographicSubdivision all "test" or chronSubdivision all "test" or formSubdivision all "test")' +
          ' and (authRefType==("Authorized"))');
      });
    });
  });

  describe('when isAdvancedSearch prop is true', () => {
    it('should have escaped query', async () => {
      let result_;

      await act(async () => {
        const { result } = renderHook(() => useAuthorities({
          searchQuery,
          searchIndex: searchableIndexesValues.ADVANCED_SEARCH,
          isAdvancedSearch: true,
          advancedSearch: [{
            bool: 'and',
            query: 'Apple & "Honey" products',
            searchOption: searchableIndexesValues.KEYWORD,
            match: 'containsAll',
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
        '(keyword all "Apple & \\"Honey\\" products" or naturalId=="*Apple & \\"Honey\\" products*" or identifiers.value=="*Apple & \\"Honey\\" products*")',
      );
    });

    it('should form an advanced search query', async () => {
      let result_;

      await act(async () => {
        const { result } = renderHook(() => useAuthorities({
          searchQuery,
          searchIndex: searchableIndexesValues.ADVANCED_SEARCH,
          isAdvancedSearch: true,
          advancedSearch: [{
            bool: 'and',
            query: 'advancedTest1',
            searchOption: searchableIndexesValues.KEYWORD,
            match: CONTAINS_ALL,
          }, {
            bool: 'not',
            query: 'advancedTest2',
            searchOption: searchableIndexesValues.IDENTIFIER,
            match: STARTS_WITH,
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
        '(keyword all "advancedTest1" or naturalId=="*advancedTest1*" or identifiers.value=="*advancedTest1*") not ((identifiers.value="advancedTest2*" or naturalId="advancedTest2*") and authRefType=="Authorized")',
      );
    });

    it('should have LCCN search query', async () => {
      let result_;

      await act(async () => {
        const { result } = renderHook(() => useAuthorities({
          searchQuery,
          searchIndex: searchableIndexesValues.ADVANCED_SEARCH,
          isAdvancedSearch: true,
          advancedSearch: [{
            bool: 'and',
            query: ' n  88173836 ',
            searchOption: searchableIndexesValues.LCCN,
            match: EXACT_PHRASE,
          }, {
            bool: 'not',
            query: 'advancedTest2',
            searchOption: searchableIndexesValues.IDENTIFIER,
            match: CONTAINS_ANY,
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

      expect(result_.current.query).toContain('lccn=="n  88173836" not ((identifiers.value any');
    });

    describe('when the "Identifier (all)" search option is opted', () => {
      it('should build correct search query', async () => {
        let result_;

        await act(async () => {
          const { result } = renderHook(() => useAuthorities({
            searchQuery,
            searchIndex: searchableIndexesValues.ADVANCED_SEARCH,
            isAdvancedSearch: true,
            advancedSearch: [{
              bool: 'and',
              query: 'test1',
              searchOption: searchableIndexesValues.IDENTIFIER,
              match: CONTAINS_ALL,
            }, {
              bool: 'or',
              query: 'test2',
              searchOption: searchableIndexesValues.IDENTIFIER,
              match: EXACT_PHRASE,
            }, {
              bool: 'not',
              query: ' test3 ',
              searchOption: searchableIndexesValues.IDENTIFIER,
              match: CONTAINS_ANY,
            }, {
              bool: 'and',
              query: 'test4',
              searchOption: searchableIndexesValues.IDENTIFIER,
              match: STARTS_WITH,
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
          '((identifiers.value="*test1*" or naturalId="*test1*") and authRefType=="Authorized") ' +
          'or ((identifiers.value=="test2" or naturalId="test2") and authRefType=="Authorized") ' +
          'not ((identifiers.value any "* test3 *" or naturalId any "* test3 *") and authRefType=="Authorized") ' +
          'and ((identifiers.value="test4*" or naturalId="test4*") and authRefType=="Authorized")',
        );
      });
    });

    describe('when the "Subject" search option is opted', () => {
      it('should build correct search query', async () => {
        let result_;

        await act(async () => {
          const { result } = renderHook(() => useAuthorities({
            searchQuery,
            searchIndex: searchableIndexesValues.ADVANCED_SEARCH,
            isAdvancedSearch: true,
            advancedSearch: [{
              bool: 'and',
              query: 'test1',
              searchOption: searchableIndexesValues.SUBJECT,
              match: CONTAINS_ALL,
            }, {
              bool: 'or',
              query: 'test2',
              searchOption: searchableIndexesValues.SUBJECT,
              match: EXACT_PHRASE,
            }, {
              bool: 'not',
              query: ' test3 ',
              searchOption: searchableIndexesValues.SUBJECT,
              match: CONTAINS_ANY,
            }, {
              bool: 'and',
              query: 'test4',
              searchOption: searchableIndexesValues.SUBJECT,
              match: STARTS_WITH,
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

        expect(result_.current.query).toBe('(topicalTerm all "test1" or sftTopicalTerm all "test1"' +
          ' or saftTopicalTerm all "test1" or namedEvent all "test1" or sftNamedEvent all "test1"' +
          ' or saftNamedEvent all "test1" or generalSubdivision all "test1" or sftGeneralSubdivision all "test1"' +
          ' or saftGeneralSubdivision all "test1" or chronTerm all "test1" or sftChronTerm all "test1"' +
          ' or saftChronTerm all "test1" or mediumPerfTerm all "test1" or sftMediumPerfTerm all "test1"' +
          ' or saftMediumPerfTerm all "test1" or geographicSubdivision all "test1"' +
          ' or sftGeographicSubdivision all "test1" or saftGeographicSubdivision all "test1"' +
          ' or chronSubdivision all "test1" or sftChronSubdivision all "test1" or saftChronSubdivision all "test1"' +
          ' or formSubdivision all "test1" or sftFormSubdivision all "test1" or saftFormSubdivision all "test1")' +
          ' or (topicalTerm=="test2" or sftTopicalTerm=="test2" or saftTopicalTerm=="test2" or namedEvent=="test2"' +
          ' or sftNamedEvent=="test2" or saftNamedEvent=="test2" or generalSubdivision=="test2"' +
          ' or sftGeneralSubdivision=="test2" or saftGeneralSubdivision=="test2" or chronTerm=="test2"' +
          ' or sftChronTerm=="test2" or saftChronTerm=="test2" or mediumPerfTerm=="test2"' +
          ' or sftMediumPerfTerm=="test2" or saftMediumPerfTerm=="test2" or geographicSubdivision=="test2"' +
          ' or sftGeographicSubdivision=="test2" or saftGeographicSubdivision=="test2" or chronSubdivision=="test2"' +
          ' or sftChronSubdivision=="test2" or saftChronSubdivision=="test2" or formSubdivision=="test2"' +
          ' or sftFormSubdivision=="test2" or saftFormSubdivision=="test2") not (topicalTerm any "test3"' +
          ' or sftTopicalTerm any "test3" or saftTopicalTerm any "test3" or namedEvent any "test3"' +
          ' or sftNamedEvent any "test3" or saftNamedEvent any "test3" or generalSubdivision any "test3"' +
          ' or sftGeneralSubdivision any "test3" or saftGeneralSubdivision any "test3" or chronTerm any "test3"' +
          ' or sftChronTerm any "test3" or saftChronTerm any "test3" or mediumPerfTerm any "test3"' +
          ' or sftMediumPerfTerm any "test3" or saftMediumPerfTerm any "test3" or geographicSubdivision any "test3"' +
          ' or sftGeographicSubdivision any "test3" or saftGeographicSubdivision any "test3"' +
          ' or chronSubdivision any "test3" or sftChronSubdivision any "test3" or saftChronSubdivision any "test3"' +
          ' or formSubdivision any "test3" or sftFormSubdivision any "test3" or saftFormSubdivision any "test3")' +
          ' and (topicalTerm all "test4*" or sftTopicalTerm all "test4*" or saftTopicalTerm all "test4*"' +
          ' or namedEvent all "test4*" or sftNamedEvent all "test4*" or saftNamedEvent all "test4*"' +
          ' or generalSubdivision all "test4*" or sftGeneralSubdivision all "test4*"' +
          ' or saftGeneralSubdivision all "test4*" or chronTerm all "test4*" or sftChronTerm all "test4*"' +
          ' or saftChronTerm all "test4*" or mediumPerfTerm all "test4*" or sftMediumPerfTerm all "test4*"' +
          ' or saftMediumPerfTerm all "test4*" or geographicSubdivision all "test4*"' +
          ' or sftGeographicSubdivision all "test4*" or saftGeographicSubdivision all "test4*"' +
          ' or chronSubdivision all "test4*" or sftChronSubdivision all "test4*" or saftChronSubdivision all "test4*"' +
          ' or formSubdivision all "test4*" or sftFormSubdivision all "test4*" or saftFormSubdivision all "test4*")');
      });
    });

    describe('when the "Subject" search option is opted', () => {
      describe('and both filters "Exclude see from" and "Exclude see from also" are selected', () => {
        it('should build search query without sftTopicalTerm and saftTopicalTerm', async () => {
          let result_;

          await act(async () => {
            const { result } = renderHook(() => useAuthorities({
              searchQuery,
              searchIndex: searchableIndexesValues.ADVANCED_SEARCH,
              isAdvancedSearch: true,
              advancedSearch: [{
                bool: 'and',
                query: 'test1',
                searchOption: searchableIndexesValues.SUBJECT,
                match: CONTAINS_ALL,
              }, {
                bool: 'or',
                query: 'test2',
                searchOption: searchableIndexesValues.SUBJECT,
                match: EXACT_PHRASE,
              }, {
                bool: 'not',
                query: ' test3 ',
                searchOption: searchableIndexesValues.SUBJECT,
                match: CONTAINS_ANY,
              }, {
                bool: 'and',
                query: 'test4',
                searchOption: searchableIndexesValues.SUBJECT,
                match: STARTS_WITH,
              }],
              filters: {
                references: ['excludeSeeFrom', 'excludeSeeFromAlso'],
              },
              sortOrder: '',
              sortedColumn: '',
              offset: '0',
              setOffset: mockSetOffset,
              navigationSegmentValue: 'search',
            }), { wrapper });

            result_ = result;
          });

          expect(result_.current.query).toBe('(topicalTerm all "test1" or namedEvent all "test1"' +
            ' or generalSubdivision all "test1" or chronTerm all "test1" or mediumPerfTerm all "test1"' +
            ' or geographicSubdivision all "test1" or chronSubdivision all "test1" or formSubdivision all "test1")' +
            ' or (topicalTerm=="test2" or namedEvent=="test2" or generalSubdivision=="test2" or chronTerm=="test2"' +
            ' or mediumPerfTerm=="test2" or geographicSubdivision=="test2" or chronSubdivision=="test2"' +
            ' or formSubdivision=="test2") not (topicalTerm any "test3" or namedEvent any "test3"' +
            ' or generalSubdivision any "test3" or chronTerm any "test3" or mediumPerfTerm any "test3"' +
            ' or geographicSubdivision any "test3" or chronSubdivision any "test3" or formSubdivision any "test3")' +
            ' and (topicalTerm all "test4*" or namedEvent all "test4*" or generalSubdivision all "test4*"' +
            ' or chronTerm all "test4*" or mediumPerfTerm all "test4*" or geographicSubdivision all "test4*"' +
            ' or chronSubdivision all "test4*" or formSubdivision all "test4*") and (authRefType==("Authorized"))');
        });
      });
    });
  });
});
