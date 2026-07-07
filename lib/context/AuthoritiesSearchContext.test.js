import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import {
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  AuthoritiesSearchContext,
  AuthoritiesSearchContextProvider,
} from './AuthoritiesSearchContext';
import {
  navigationSegments,
  searchableIndexesValues,
  sortOrders,
} from '../constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({ search: '?segment=search' }),
}));

const TestingComponent = () => {
  const ctx = useContext(AuthoritiesSearchContext);

  return (
    <>
      <span data-testid="searchInputValue">{ctx.searchInputValue}</span>
      <span data-testid="searchQuery">{ctx.searchQuery}</span>
      <span data-testid="searchDropdownValue">{ctx.searchDropdownValue}</span>
      <span data-testid="searchIndex">{ctx.searchIndex}</span>
      <span data-testid="filters">{JSON.stringify(ctx.filters)}</span>
      <span data-testid="offset">{ctx.offset}</span>
      <span data-testid="browsePage">{ctx.browsePage}</span>
      <span data-testid="browsePageQuery">{ctx.browsePageQuery}</span>
      <span data-testid="sortOrder">{ctx.sortOrder}</span>
      <span data-testid="sortedColumn">{ctx.sortedColumn}</span>
      <span data-testid="navigationSegmentValue">{ctx.navigationSegmentValue}</span>
      <span data-testid="isGoingToBaseURL">{String(ctx.isGoingToBaseURL)}</span>

      <button
        type="button"
        onClick={() => ctx.setFilters({ filter1: ['filter1value'] })}
      >
        Set filters
      </button>
      <button
        type="button"
        onClick={() => ctx.setNavigationSegmentValue(navigationSegments.browse)}
      >
        Go to browse
      </button>
      <button
        type="button"
        onClick={() => ctx.setNavigationSegmentValue(navigationSegments.search)}
      >
        Go to search
      </button>
      <button
        type="button"
        onClick={() => ctx.resetAll()}
      >
        Reset all
      </button>
    </>
  );
};

const getComponent = ({
  contextInitialValues = {},
  readParamsFromUrl,
} = {}) => (
  <AuthoritiesSearchContextProvider
    initialValues={contextInitialValues}
    readParamsFromUrl={readParamsFromUrl}
  >
    <TestingComponent />
  </AuthoritiesSearchContextProvider>
);

describe('Given AuthoritiesSearchContext', () => {
  beforeEach(() => {
    useLocation.mockReturnValue({ search: '?segment=search' });
  });

  describe('when setting filters via setFilters', () => {
    it('should also copy search index and search query to be applied in search', () => {
      const { getByTestId, getByRole, rerender } = render(getComponent({
        contextInitialValues: {
          [navigationSegments.search]: {
            dropdownValue: 'personalName',
            searchInputValue: 'test',
          },
        },
      }));

      fireEvent.click(getByRole('button', { name: 'Set filters' }));
      rerender(getComponent());

      expect(getByTestId('searchIndex')).toHaveTextContent('personalName');
      expect(getByTestId('searchQuery')).toHaveTextContent('test');
    });
  });

  describe('when the provider is initialized', () => {
    describe('and the URL has search params', () => {
      it('should initialize state from the URL', () => {
        useLocation.mockReturnValue({
          search: '?segment=search&qindex=personalNameTitle&query=abc&offset=20&sort=-headingRef',
        });

        const { getByTestId } = render(getComponent());

        expect(getByTestId('navigationSegmentValue')).toHaveTextContent(navigationSegments.search);
        expect(getByTestId('searchIndex')).toHaveTextContent('personalNameTitle');
        expect(getByTestId('searchDropdownValue')).toHaveTextContent('personalNameTitle');
        expect(getByTestId('searchQuery')).toHaveTextContent('abc');
        expect(getByTestId('searchInputValue')).toHaveTextContent('abc');
        expect(getByTestId('offset')).toHaveTextContent('20');
        expect(getByTestId('sortOrder')).toHaveTextContent(sortOrders.DES);
        expect(getByTestId('sortedColumn')).toHaveTextContent('headingRef');
      });
    });

    describe('and readParamsFromUrl is false', () => {
      it('should ignore URL params and fall back to defaults', () => {
        useLocation.mockReturnValue({
          search: '?segment=search&qindex=personalNameTitle&query=abc',
        });

        const { getByTestId } = render(getComponent({ readParamsFromUrl: false }));

        expect(getByTestId('searchIndex')).toHaveTextContent(searchableIndexesValues.KEYWORD);
        expect(getByTestId('searchQuery').textContent).toBe('');
      });
    });

    describe('and the URL is empty but initialValues are provided', () => {
      it('should initialize state from initialValues', () => {
        useLocation.mockReturnValue({ search: '' });

        const { getByTestId } = render(getComponent({
          contextInitialValues: {
            segment: navigationSegments.browse,
            [navigationSegments.browse]: {
              dropdownValue: 'childrenSubjectHeading',
              searchIndex: 'childrenSubjectHeading',
              searchInputValue: 'foo',
              searchQuery: 'foo',
            },
          },
        }));

        expect(getByTestId('navigationSegmentValue')).toHaveTextContent(navigationSegments.browse);
        expect(getByTestId('searchDropdownValue')).toHaveTextContent('childrenSubjectHeading');
        expect(getByTestId('searchIndex')).toHaveTextContent('childrenSubjectHeading');
        expect(getByTestId('searchQuery')).toHaveTextContent('foo');
      });
    });
  });

  describe('when switching between segments', () => {
    describe('and no params were stored for the target segment', () => {
      it('should apply default values for the target segment', () => {
        const { getByTestId, getByRole } = render(getComponent());

        fireEvent.click(getByRole('button', { name: 'Go to browse' }));

        expect(getByTestId('navigationSegmentValue')).toHaveTextContent(navigationSegments.browse);
        expect(getByTestId('searchDropdownValue').textContent).toBe('');
        expect(getByTestId('searchIndex').textContent).toBe('');
        expect(getByTestId('searchQuery').textContent).toBe('');
        expect(getByTestId('offset')).toHaveTextContent('0');
        expect(getByTestId('sortOrder')).toHaveTextContent(sortOrders.ASC);
        expect(getByTestId('isGoingToBaseURL')).toHaveTextContent('true');
      });
    });

    describe('and initialValues are provided for the target segment', () => {
      it('should apply initialValues for the target segment', () => {
        const { getByTestId, getByRole } = render(getComponent({
          contextInitialValues: {
            [navigationSegments.browse]: {
              dropdownValue: 'childrenSubjectHeading',
              searchIndex: 'childrenSubjectHeading',
              filters: { headingType: ['foo'] },
            },
          },
        }));

        fireEvent.click(getByRole('button', { name: 'Go to browse' }));

        expect(getByTestId('navigationSegmentValue')).toHaveTextContent(navigationSegments.browse);
        expect(getByTestId('searchDropdownValue')).toHaveTextContent('childrenSubjectHeading');
        expect(getByTestId('searchIndex')).toHaveTextContent('childrenSubjectHeading');
        expect(getByTestId('filters')).toHaveTextContent(JSON.stringify({ headingType: ['foo'] }));
      });
    });

    describe('and switching back to a segment that has stored params', () => {
      it('should restore the previously stored params', () => {
        const { getByTestId, getByRole } = render(getComponent({
          contextInitialValues: {
            [navigationSegments.search]: {
              dropdownValue: searchableIndexesValues.GENRE,
              searchIndex: searchableIndexesValues.GENRE,
              searchInputValue: 'search-query',
              searchQuery: 'search-query',
            },
          },
        }));

        fireEvent.click(getByRole('button', { name: 'Go to browse' }));
        fireEvent.click(getByRole('button', { name: 'Go to search' }));

        expect(getByTestId('navigationSegmentValue')).toHaveTextContent(navigationSegments.search);
        expect(getByTestId('searchQuery')).toHaveTextContent('search-query');
        expect(getByTestId('searchIndex')).toHaveTextContent(searchableIndexesValues.GENRE);
      });
    });
  });

  describe('when resetAll is called', () => {
    it('should reset search, filters, sort and mark going to base URL', () => {
      const { getByTestId, getByRole } = render(getComponent({
        contextInitialValues: {
          [navigationSegments.search]: {
            dropdownValue: searchableIndexesValues.GENRE,
            searchIndex: searchableIndexesValues.GENRE,
            searchInputValue: 'query',
            searchQuery: 'query',
          },
        },
      }));

      fireEvent.click(getByRole('button', { name: 'Reset all' }));

      expect(getByTestId('searchInputValue').textContent).toBe('');
      expect(getByTestId('searchQuery').textContent).toBe('');
      expect(getByTestId('searchDropdownValue')).toHaveTextContent(searchableIndexesValues.KEYWORD);
      expect(getByTestId('searchIndex')).toHaveTextContent(searchableIndexesValues.KEYWORD);
      expect(getByTestId('sortOrder')).toHaveTextContent(sortOrders.ASC);
      expect(getByTestId('sortedColumn').textContent).toBe('');
      expect(getByTestId('filters')).toHaveTextContent('{}');
      expect(getByTestId('isGoingToBaseURL')).toHaveTextContent('true');
    });
  });
});
