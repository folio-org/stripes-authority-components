import { fireEvent, render } from '@folio/jest-config-stripes/testing-library/react';
import noop from 'lodash/noop';

import { runAxeTest } from '@folio/stripes-testing';

import Harness from '../../test/jest/helpers/harness';
import SearchResultsList from './SearchResultsList';
import authorities from '../../mocks/authorities';
import { searchResultListColumns } from '../constants';

const mockToggleFilterPane = jest.fn();
const mockSetSelectedAuthorityRecordContext = jest.fn();
const mockHistoryPush = jest.fn();
const mockOnOpenRecord = jest.fn();
const mockRenderHeadingRef = jest.fn((authority, className) => (
  <a href="/" className={className}>
    {authority.headingRef}
  </a>
));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: jest.fn(),
  }),
  useLocation: jest.fn().mockReturnValue({
    search: '',
    state: { editSuccessful: true },
  }),
  useRouteMatch: jest.fn().mockReturnValue({ path: '' }),
}));

jest.mock('../queries', () => ({
  ...jest.requireActual('../queries'),
  useAuthoritySourceFiles: jest.fn().mockReturnValue({
    isLoading: false,
    sourceFiles: [{
      id: '4b531a84-d4fe-44e5-b75f-542ec71b2f62',
      name: 'LC Demographic Group Terms (LCFGT)',
    }, {
      id: 'af045f2f-e851-4613-984c-4bc13430333a',
      name: 'STAFF_source',
    }],
  }),
}));

const columnMapping = {
  [searchResultListColumns.AUTH_REF_TYPE]: 'stripes-authority-components.search-results-list.authRefType',
  [searchResultListColumns.HEADING_REF]: 'stripes-authority-components.search-results-list.headingRef',
  [searchResultListColumns.AUTHORITY_SOURCE]: 'stripes-authority-components.search-results-list.authoritySource',
  [searchResultListColumns.HEADING_TYPE]: 'stripes-authority-components.search-results-list.headingType',
};

const getSearchResultsList = (props = {}, selectedRecord = null) => (
  <Harness selectedRecordCtxValue={[selectedRecord, mockSetSelectedAuthorityRecordContext]}>
    <SearchResultsList
      authorities={authorities}
      visibleColumns={[
        searchResultListColumns.AUTH_REF_TYPE,
        searchResultListColumns.HEADING_REF,
        searchResultListColumns.HEADING_TYPE,
        searchResultListColumns.AUTHORITY_SOURCE,
      ]}
      columnMapping={columnMapping}
      totalResults={authorities.length}
      loading={false}
      loaded={false}
      query=""
      hasFilters={false}
      pageSize={15}
      onNeedMoreData={noop}
      toggleFilterPane={mockToggleFilterPane}
      isFilterPaneVisible
      sortOrder=""
      sortedColumn=""
      onHeaderClick={jest.fn()}
      onOpenRecord={mockOnOpenRecord}
      renderHeadingRef={mockRenderHeadingRef}
      {...props}
    />
  </Harness>
);

const renderSearchResultsList = (...params) => render(getSearchResultsList(...params));

describe('Given SearchResultsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render MCL component', async () => {
    const { getAllByText } = renderSearchResultsList();

    expect(getAllByText('Twain, Mark')).toHaveLength(15);
  });

  it('should render with no axe errors', async () => {
    const { container } = renderSearchResultsList();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should display columns', () => {
    const { getByRole } = renderSearchResultsList();

    expect(getByRole('columnheader', { name: 'stripes-authority-components.search-results-list.authRefType' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'stripes-authority-components.search-results-list.headingRef' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'stripes-authority-components.search-results-list.headingType' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'stripes-authority-components.search-results-list.authoritySource' })).toBeVisible();
  });

  it('should display empty message', () => {
    const { getByText } = renderSearchResultsList({
      authorities: [],
      totalResults: 0,
    });

    expect(getByText('stripes-smart-components.sas.noResults.noTerms')).toBeDefined();
  });

  it('should render the passed HeadingRef component for each row', () => {
    renderSearchResultsList({ authorities: authorities.slice(0, 2) });
    expect(mockRenderHeadingRef).toHaveBeenNthCalledWith(1, expect.objectContaining(authorities[0]), undefined);
    expect(mockRenderHeadingRef).toHaveBeenNthCalledWith(2, expect.objectContaining(authorities[1]), undefined);
  });

  describe('when search is pending', () => {
    it('should display pending message', () => {
      const { getByText } = renderSearchResultsList({
        authorities: [],
        totalResults: 0,
        loading: true,
      });

      expect(getByText('stripes-smart-components.sas.noResults.loading')).toBeDefined();
    });
  });

  describe('when search is finished and no results were returned', () => {
    it('should display pending message', () => {
      const { getByText } = renderSearchResultsList({
        authorities: [],
        totalResults: 0,
        query: 'test=abc',
        loaded: true,
      });

      expect(getByText('stripes-smart-components.sas.noResults.default')).toBeDefined();
    });
  });

  describe('when show columns checkbox for "Type of Heading" is not checked', () => {
    it('should display 2 columns', () => {
      const { queryByText } = renderSearchResultsList({
        visibleColumns: [
          searchResultListColumns.AUTH_REF_TYPE,
          searchResultListColumns.HEADING_REF,
        ],
      });

      expect(queryByText('stripes-authority-components.search-results-list.authRefType')).toBeDefined();
      expect(queryByText('stripes-authority-components.search-results-list.headingRef')).toBeDefined();
      expect(queryByText('stripes-authority-components.search-results-list.headingType')).toBeNull();
    });
  });

  describe('when show columns checkbox for "Select" is checked', () => {
    it('should display 4 columns', () => {
      const { queryByText } = renderSearchResultsList({
        visibleColumns: [
          searchResultListColumns.SELECT,
          searchResultListColumns.AUTH_REF_TYPE,
          searchResultListColumns.HEADING_REF,
          searchResultListColumns.HEADING_TYPE,
        ],
      });

      expect(queryByText('stripes-authority-components.search-results-list.select')).toBeDefined();
      expect(queryByText('stripes-authority-components.search-results-list.authRefType')).toBeDefined();
      expect(queryByText('stripes-authority-components.search-results-list.headingRef')).toBeDefined();
      expect(queryByText('stripes-authority-components.search-results-list.headingType')).toBeDefined();
    });
  });

  describe('when record is an anchor', () => {
    it('should display an exclamation-circle icon', () => {
      const { container } = renderSearchResultsList({
        authorities: [{
          id: '43f76f93-cfc4-4b6a-a2d4-9b04c8ed7a46',
          headingType: 'Personal name',
          authRefType: 'Authorized',
          headingRef: 'Twain, Mark',
          isAnchor: true,
          isExactMatch: false,
        }],
        totalResults: 1,
        query: 'test=abc',
        loaded: true,
      });

      expect(container.querySelector('.icon-exclamation-circle')).toBeDefined();
    });

    it('should display "would be here" message', () => {
      const { getByText } = renderSearchResultsList({
        authorities: [{
          id: '43f76f93-cfc4-4b6a-a2d4-9b04c8ed7a46',
          headingType: 'Personal name',
          authRefType: 'Authorized',
          headingRef: 'Twain, Mark',
          isAnchor: true,
          isExactMatch: false,
        }],
        totalResults: 1,
        query: 'test=abc',
        loaded: true,
      });

      expect(getByText('stripes-authority-components.browse.noMatch.wouldBeHereLabel')).toBeDefined();
    });
  });

  describe('when a user clicks on the row', () => {
    it('should set the row data', () => {
      const { getByText } = renderSearchResultsList({ authorities: authorities.slice(0, 2) });

      fireEvent.click(getByText('Auth/Ref'));

      expect(mockSetSelectedAuthorityRecordContext).toHaveBeenCalledWith(authorities[0]);
    });
  });

  describe('when a user clicks the row container', () => {
    it('should not break the page and set undefined to setSelectedAuthorityRecord', () => {
      const { container } = renderSearchResultsList({ authorities: authorities.slice(0, 2) });
      const rowContainer = container.querySelector('[data-row-index]');

      fireEvent.click(rowContainer);

      expect(mockSetSelectedAuthorityRecordContext).not.toHaveBeenCalled();
    });
  });

  it('should display authority sources in the list', () => {
    const { getByText } = renderSearchResultsList({ authorities: authorities.slice(0, 3) });

    expect(getByText('LC Demographic Group Terms (LCFGT)')).toBeDefined();
    expect(getByText('STAFF_source')).toBeDefined();
    expect(getByText('stripes-authority-components.search.sourceFileId.nullOption')).toBeDefined();
  });

  describe('when both isAnchor and isExactMatch flags are true and sourceField is not NULL', () => {
    it('should display authority source in the row', () => {
      const authority = {
        id: '58392ede-fff5-4197-938f-399883126bbd',
        headingRef: 'Canady, Robert Lynn',
        sourceFileId: '4b531a84-d4fe-44e5-b75f-542ec71b2f62',
        isAnchor: true,
        isExactMatch: true,
      };

      const { getByText } = renderSearchResultsList({
        authorities: [authority],
      });

      expect(getByText('LC Demographic Group Terms (LCFGT)')).toBeDefined();
    });
  });

  describe('when isAnchor is true and isExactMatch is false', () => {
    it('should not display nullOption in the authority source column', () => {
      const anchor = {
        headingRef: 'test',
        isAnchor: true,
        isExactMatch: false,
      };

      const { queryByText } = renderSearchResultsList({
        authorities: [anchor],
      });

      expect(queryByText('stripes-authority-components.search.sourceFileId.nullOption')).toBeNull();
    });
  });
});
