import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import { SharedFilter } from './SharedFilter';

const defaultProps = {
  disabled: false,
  handleSectionToggle: jest.fn(),
  selectedValues: [],
  open: true,
  onClearFilter: jest.fn(),
  onFilterChange: jest.fn(),
  options: [{
    id: 'true',
    totalRecords: 1,
  }, {
    id: 'false',
    totalRecords: 2,
  }],
};

const renderSharedFilter = (props = {}) => render(
  <SharedFilter
    {...defaultProps}
    {...props}
  />,
);

describe('SharedFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render filter with specified options', () => {
    renderSharedFilter();

    expect(screen.getByText('stripes-authority-components.filter.true')).toBeInTheDocument();
    expect(screen.getByText('stripes-authority-components.filter.false')).toBeInTheDocument();
  });

  it('should call \'onFilterChange\' when filter was changed', async () => {
    renderSharedFilter();

    const yesOption = screen.getByText('stripes-authority-components.filter.true');

    await act(() => user.click(yesOption));

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      name: 'shared',
      values: ['true'],
    });
  });

  it('should clear the selected options by clicking on the clear button', async () => {
    renderSharedFilter({
      selectedValues: ['true'],
    });

    const clearButton = document.querySelector('button[data-test-clear-button]');

    await act(() => user.click(clearButton));

    expect(defaultProps.onClearFilter).toHaveBeenCalledWith('shared');
  });

  it('should render with no axe errors', async () => {
    const { container } = renderSharedFilter();

    await runAxeTest({
      rootNode: container,
    });
  });
});
