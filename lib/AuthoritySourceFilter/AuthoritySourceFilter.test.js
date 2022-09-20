import { render } from '@testing-library/react';

import AuthoritySourceFilter from './AuthoritySourceFilter';
import Harness from '../../test/jest/helpers/harness';

const mockOnFilterChange = jest.fn();
const mockHandleSectionToggle = jest.fn();
const mockOnClearFilter = jest.fn();

const values = [{
  id: '1',
  totalRecords: 0,
}, {
  id: '2',
  totalRecords: 3,
}, {
  id: '3',
  totalRecords: 2,
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
    const { getByText } = renderAuthoritySourceFilter();

    expect(getByText('MultiSelection')).toBeDefined();
  });
});
