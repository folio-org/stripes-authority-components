import user from '@testing-library/user-event';
import {
  act,
  render,
  screen,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import { SharedFilter } from './SharedFilter';
import { navigationSegments } from '../constants';

const defaultProps = {
  activeFilters: [],
  disabled: false,
  onChange: jest.fn(),
  name: 'references-filter',
  id: 'references-filter',
  navigationSegment: navigationSegments.search,
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

    expect(screen.getByText('stripes-authority-components.search.excludeSeeFrom')).toBeInTheDocument();
    expect(screen.getByText('stripes-authority-components.search.excludeSeeFromAlso')).toBeInTheDocument();
  });

  it('should call \'onChange\' when filter was changed', async () => {
    renderSharedFilter();

    const excludeSeeFromOption = screen.getByText('stripes-authority-components.search.excludeSeeFrom');

    await act(() => user.click(excludeSeeFromOption));

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderSharedFilter();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when navigation segment is Browse', () => {
    it('should not show exclude see from also option', () => {
      renderSharedFilter({
        navigationSegment: navigationSegments.browse,
      });

      expect(screen.queryByText('stripes-authority-components.search.excludeSeeFromAlso')).not.toBeInTheDocument();
    });
  });
});
