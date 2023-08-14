import { render } from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import MultiSelectionFacet from './MultiSelectionFacet';
import Harness from '../../test/jest/helpers/harness';

const mockOnFilterChange = jest.fn();
const mockHandleSectionToggle = jest.fn();
const mockOnClearFilter = jest.fn();

const renderMultiSelectionFacet = (props = {}) => render(
  <Harness>
    <MultiSelectionFacet
      id="filter-name"
      name="filter-name"
      label="filter-label"
      open
      handleSectionToggle={mockHandleSectionToggle}
      onClearFilter={mockOnClearFilter}
      onFilterChange={mockOnFilterChange}
      displayClearButton
      options={[{
        id: 'option-1',
        totalRecords: 10,
      }, {
        id: 'option-2',
        totalRecords: 30,
      }, {
        id: 'option-3',
        totalRecords: 20,
      }]}
      selectedValues={[]}
      formatMissingOption={(value) => ({
        label: value.toUpperCase(),
        value,
        totalRecords: 0,
      })}
      {...props}
    />
  </Harness>,
);

describe('Given MultiSelectionFacet', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render multiselect', () => {
    const { getAllByText } = renderMultiSelectionFacet();

    expect(getAllByText('filter-label')).toBeDefined();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderMultiSelectionFacet();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when there are values that are missing in options', () => {
    it('should format the labels accordingly', () => {
      const { getAllByText } = renderMultiSelectionFacet({
        options: [],
        selectedValues: ['missing-value'],
      });

      expect(getAllByText('MISSING-VALUE')).toBeDefined();
    });
  });
});
