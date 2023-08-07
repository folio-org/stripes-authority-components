import {
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import SearchFilters from './SearchFilters';
import Harness from '../../test/jest/helpers/harness';
import { FILTERS, navigationSegments } from '../constants';

jest.mock('../queries', () => ({
  ...jest.requireActual('../queries'),
  useFacets: jest.fn().mockReturnValue({
    isLoading: false,
    facets: {
      subjectHeadings: {
        values: [{
          id: 'a',
          totalRecords: 10,
        }],
      },
    },
  }),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqDateRangeFilter: ({ name }) => <div>{name}</div>,
}));

jest.mock('../MultiSelectionFacet', () => ({
  MultiSelectionFacet: ({ name, onClearFilter }) => (
    <div>
      {name}
      <button type="button" onClick={() => onClearFilter(name)}>Clear {name}</button>
    </div>
  ),
}));

const mockSetFilters = jest.fn();

const defaultCtxValue = {
  setFilters: mockSetFilters,
  filters: {
    headingType: ['val-a', 'val-b'],
    subjectHeadings: ['Other'],
    sourceFileId: [],
  },
  navigationSegmentValue: navigationSegments.search,
};

const renderSearchFilters = (props = {}, ctxValue = defaultCtxValue) => render(
  <Harness authoritiesCtxValue={ctxValue}>
    <SearchFilters
      isSearching={false}
      cqlQquery=""
      {...props}
    />
  </Harness>,
);

describe('Given SearchFilters', () => {
  afterEach(() => jest.clearAllMocks());

  it('should display all filters', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('sourceFileId')).toBeDefined();
    expect(getByText('stripes-authority-components.search.references')).toBeDefined();
    expect(getByText('stripes-authority-components.search.excludeSeeFrom')).toBeDefined();
    expect(getByText('stripes-authority-components.search.excludeSeeFromAlso')).toBeDefined();
  });

  it('should render Authority source', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('sourceFileId')).toBeDefined();
  });

  it('should render Thesaurus filter', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('subjectHeadings')).toBeDefined();
  });

  it('should render Type of heading filter', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('headingType')).toBeDefined();
  });

  it('should render created date filter', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('createdDate')).toBeDefined();
  });

  it('should render updated date filter', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('updatedDate')).toBeDefined();
  });

  describe('when there are excluded filters', () => {
    it('should display only non-excluded filters', () => {
      const { queryByText, getByText } = renderSearchFilters({
        excludedFilters: new Set([FILTERS.REFERENCES]),
      });

      expect(queryByText('stripes-authority-components.search.references')).not.toBeInTheDocument();
      expect(getByText('subjectHeadings')).toBeVisible();
      expect(getByText('headingType')).toBeVisible();
      expect(getByText('createdDate')).toBeVisible();
      expect(getByText('updatedDate')).toBeVisible();
    });
  });

  describe('when clearing a filter', () => {
    it('should call setFilters with correct filters', () => {
      mockSetFilters.mockImplementation(setter => setter(defaultCtxValue.filters));

      const { getByText } = renderSearchFilters();

      fireEvent.click(getByText('Clear headingType'));

      expect(mockSetFilters.mock.results[0].value).toMatchObject({});
    });
  });

  describe('when expanding all filters', () => {
    it('should render with no axe errors', async () => {
      const {
        container,
        getByText,
      } = renderSearchFilters();

      fireEvent.click(getByText('stripes-authority-components.search.references'));
      fireEvent.click(getByText('headingType'));
      fireEvent.click(getByText('createdDate'));
      fireEvent.click(getByText('updatedDate'));

      await runAxeTest({
        rootNode: container,
      });
    });
  });
});
