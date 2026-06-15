import { useContext } from 'react';

import {
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  AuthoritiesSearchContext,
  AuthoritiesSearchContextProvider,
} from './AuthoritiesSearchContext';
import { navigationSegments } from '../constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({ search: '?segment=search' }),
}));

const TestingComponent = () => {
  const { setFilters, searchQuery, searchIndex } = useContext(AuthoritiesSearchContext);

  return (
    <>
      <span data-testid="searchIndex">{searchIndex}</span>
      <span data-testid="searchQuery">{searchQuery}</span>
      <button
        type="button"
        onClick={() => setFilters({ filter1: ['filter1value'] })}
      >
        Set filters
      </button>
    </>
  );
};

const getComponent = ({
  contextInitialValues = {},
  ...props
} = {}) => (
  <AuthoritiesSearchContextProvider initialValues={contextInitialValues}>
    <TestingComponent {...props} />
  </AuthoritiesSearchContextProvider>
);

describe('Given AuthoritiesSearchContext', () => {
  describe('when setting filters via setFilters', () => {
    it('should also copy search index and search query to be applied in search', () => {
      const { getByTestId, getByRole, rerender } = render(getComponent({
        contextInitialValues: {
          [navigationSegments.search]: {
            dropdownValue: 'personalName',
            searchInputValue: 'test',
          },
        },
      }));

      fireEvent.click(getByRole('button', { name: 'Set filters' }));
      rerender(getComponent());

      expect(getByTestId('searchIndex')).toHaveTextContent('personalName');
      expect(getByTestId('searchQuery')).toHaveTextContent('test');
    });
  });
});
