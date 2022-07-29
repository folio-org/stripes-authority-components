import { render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import AuthoritiesSearchPane from './AuthoritiesSearchPane';
import Harness from '../../test/jest/helpers/harness';

const mockHistoryReplace = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
  useLocation: jest.fn().mockImplementation(() => ({
    pathname: '',
  })),
}));

const mockOnChangeSortOption = jest.fn();
const mockOnSubmitSearch = jest.fn();
const mockSetSelectedAuthorityRecordContext = jest.fn();
const mockToggleFilterPane = jest.fn();

const renderAuthoritiesSearchPane = (props = {}) => render(
  <Harness selectedRecordCtxValue={[null, mockSetSelectedAuthorityRecordContext]}>
    <AuthoritiesSearchPane
      isFilterPaneVisible
      isLoading={false}
      onChangeSortOption={mockOnChangeSortOption}
      onSubmitSearch={mockOnSubmitSearch}
      hasAdvancedSearch
      query=""
      toggleFilterPane={mockToggleFilterPane}
      {...props}
    />
  </Harness>,
);

describe('Given AuthoritiesSearchPane', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderAuthoritiesSearchPane();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when filter pane is collapsed', () => {
    it('should not render anything', () => {
      const { queryByTestId } = renderAuthoritiesSearchPane({
        isFilterPaneVisible: false,
      });

      expect(queryByTestId('pane-authorities-filters')).toBeNull();
    });
  });
});
