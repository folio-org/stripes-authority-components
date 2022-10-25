import user from '@testing-library/user-event';
import {
  act,
  render,
  screen,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import { ReferencesFilter } from './ReferencesFilter';
import { navigationSegments } from '../constants';

const defaultProps = {
  activeFilters: [],
  disabled: false,
  onChange: jest.fn(),
  name: 'references-filter',
  id: 'references-filter',
  navigationSegment: navigationSegments.search,
};

const renderReferencesFilter = (props = {}) => render(
  <ReferencesFilter
    {...defaultProps}
    {...props}
  />,
);

describe('ReferencesFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render filter with specified options', () => {
    renderReferencesFilter();

    expect(screen.getByText('stripes-authority-components.search.excludeSeeFrom')).toBeInTheDocument();
    expect(screen.getByText('stripes-authority-components.search.excludeSeeFromAlso')).toBeInTheDocument();
  });

  it('should call \'onChange\' when filter was changed', async () => {
    renderReferencesFilter();

    const excludeSeeFromOption = screen.getByText('stripes-authority-components.search.excludeSeeFrom');

    await act(() => user.click(excludeSeeFromOption));

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderReferencesFilter();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when navigation segment is Browse', () => {
    it('should not show exclude see from also option', () => {
      renderReferencesFilter({
        navigationSegment: navigationSegments.browse,
      });

      expect(screen.queryByText('stripes-authority-components.search.excludeSeeFromAlso')).not.toBeInTheDocument();
    });
  });
});
