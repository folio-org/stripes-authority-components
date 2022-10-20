import { render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import SubjectHeadingsFilter from './SubjectHeadingsFilter';
import Harness from '../../test/jest/helpers/harness';

const mockOnFilterChange = jest.fn();
const mockHandleSectionToggle = jest.fn();
const mockOnClearFilter = jest.fn();

const options = [{
  id: 'a',
  totalRecords: 0,
}, {
  id: 'b',
  totalRecords: 3,
}, {
  id: 'c',
  totalRecords: 2,
}, {
  id: 'm',
  totalRecords: 0,
}];

const renderSubjectHeadingsFilter = (props = {}) => render(
  <Harness>
    <SubjectHeadingsFilter
      open
      options={options}
      selectedValues={[]}
      onClearFilter={mockOnClearFilter}
      handleSectionToggle={mockHandleSectionToggle}
      onFilterChange={mockOnFilterChange}
      isLoading={false}
      {...props}
    />
  </Harness>,
);

describe('Given SubjectHeadingsFilter', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render filter', () => {
    const { getAllByText } = renderSubjectHeadingsFilter();

    expect(getAllByText('stripes-authority-components.search.subjectHeadings')).toBeDefined();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderSubjectHeadingsFilter();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when subject heading code is mapped to a label', () => {
    it('should display label', () => {
      const { getByText } = renderSubjectHeadingsFilter();

      expect(getByText('Library of Congress Subject Headings')).toBeDefined();
      expect(getByText('LC subject headings for children\'s literature')).toBeDefined();
      expect(getByText('Medical Subject Headings')).toBeDefined();
    });
  });

  describe('when subject heading code is not mapped to a label', () => {
    it('should display code', () => {
      const { getByText } = renderSubjectHeadingsFilter();

      expect(getByText('m')).toBeDefined();
    });
  });
});
