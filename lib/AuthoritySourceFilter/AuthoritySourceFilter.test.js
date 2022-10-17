import { render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import AuthoritySourceFilter from './AuthoritySourceFilter';
import Harness from '../../test/jest/helpers/harness';

const mockOnFilterChange = jest.fn();
const mockHandleSectionToggle = jest.fn();
const mockOnClearFilter = jest.fn();

jest.mock('../queries', () => ({
  useAuthoritySourceFiles: jest.fn().mockReturnValue({
    sourceFiles: [{
      id: '1',
      name: 'Option 1',
    }, {
      id: '2',
      name: 'Option 2',
    }],
    isLoading: false,
  }),
}));

const values = [{
  id: '1',
  totalRecords: 0,
}, {
  id: '2',
  totalRecords: 3,
}, {
  id: '3',
  totalRecords: 2,
}, {
  id: 'NULL',
  totalRecords: 1,
}];

const renderAuthoritySourceFilter = (props = {}) => render(
  <Harness>
    <AuthoritySourceFilter
      open
      values={values}
      selectedValues={[]}
      onClearFilter={mockOnClearFilter}
      handleSectionToggle={mockHandleSectionToggle}
      onFilterChange={mockOnFilterChange}
      isLoading={false}
      {...props}
    />
  </Harness>,
);

describe('Given AuthoritySourceFilter', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render filter', () => {
    const { getAllByText } = renderAuthoritySourceFilter();

    expect(getAllByText('stripes-authority-components.search.sourceFileId')).toBeDefined();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderAuthoritySourceFilter();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when source file id is mapped to a label', () => {
    it('should display label', () => {
      const { getByText } = renderAuthoritySourceFilter();

      expect(getByText('Option 1')).toBeDefined();
      expect(getByText('Option 2')).toBeDefined();
    });
  });

  describe('when source file id is not mapped to a label', () => {
    it('should display id', () => {
      const {
        getByText,
        queryByText,
      } = renderAuthoritySourceFilter();

      expect(queryByText('Option 3')).toBeNull();
      expect(getByText('3')).toBeDefined();
    });
  });

  describe('when source filter option id is NULL', () => {
    it('should display "Not specified"', () => {
      const {
        getByText,
        queryByText,
      } = renderAuthoritySourceFilter();

      expect(queryByText('NULL')).toBeNull();
      expect(getByText('stripes-authority-components.search.sourceFileId.nullOption')).toBeDefined();
    });
  });
});
