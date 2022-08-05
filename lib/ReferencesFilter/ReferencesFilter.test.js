import user from '@testing-library/user-event';
import {
  act,
  render,
  screen,
} from '@testing-library/react';

import { ReferencesFilter } from './ReferencesFilter';

const defaultProps = {
  activeFilters: [],
  disabled: false,
  onChange: jest.fn(),
  name: 'references-filter',
  id: 'references-filter',
};

const renderReferencesFilter = (props = {}) => render(
  <ReferencesFilter
    {...defaultProps}
    {...props}
  />,
);

describe('ReferencesFilter', () => {
  beforeEach(() => {
    defaultProps.onChange.mockClear();
  });

  it('should render filter with specified options', () => {
    renderReferencesFilter();

    expect(screen.getByText('stripes-authority-components.search.excludeSeeFrom')).toBeInTheDocument();
    expect(screen.getByText('stripes-authority-components.search.excludeSeeFromAlso')).toBeInTheDocument();
  });

  it('should call \'onChange\' when filter was changed', () => {
    renderReferencesFilter();

    const excludeSeeFromOption = screen.getByText('stripes-authority-components.search.excludeSeeFrom');

    act(() => user.click(excludeSeeFromOption));

    expect(defaultProps.onChange).toHaveBeenCalled();
  });
});