import { render } from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import CheckboxFacet from './CheckboxFacet';
import Harness from '../../test/jest/helpers/harness';

const mockOnFilterChange = jest.fn();
const mockHandleSectionToggle = jest.fn();

const renderCheckboxFacet = (props = {}) => render(
  <Harness>
    <CheckboxFacet
      id="filter-name"
      name="filter-name"
      label="filter-label"
      open
      handleSectionToggle={mockHandleSectionToggle}
      onFilterChange={mockOnFilterChange}
      selectedValues={['option-1']}
      options={[{
        value: 'option-1',
        label: 'option 1',
        totalRecords: 10,
      }, {
        value: 'option-2',
        label: 'option 2',
        totalRecords: 30,
      }, {
        value: 'option-3',
        label: 'option 3',
        totalRecords: 20,
      }]}
      {...props}
    />
  </Harness>,
);

describe('Given CheckboxFacet', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render checkbox', () => {
    const { getAllByText } = renderCheckboxFacet();

    expect(getAllByText('filter-label')).toBeDefined();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderCheckboxFacet();

    await runAxeTest({
      rootNode: container,
    });
  });
});
