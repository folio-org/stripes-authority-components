import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { fireEvent, render } from '@testing-library/react';

import {
  SelectedAuthorityRecordContextProvider,
  SelectedAuthorityRecordContext,
} from './SelectedAuthorityRecordContextProvider';
import { AuthoritiesSearchContext } from './AuthoritiesSearchContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({ search: '?segment=search' }),
}));

const TestingComponent = ({ readParamsFromUrl }) => {
  const [selectedAuthority, setSelectedAuthority] = useContext(SelectedAuthorityRecordContext);
  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);
  const location = useLocation();
  const isSearch = readParamsFromUrl
    ? location.search.includes('segment=search')
    : navigationSegmentValue === 'search';

  return (
    <>
      <div>{selectedAuthority?.id}</div>
      <button
        type="button"
        onClick={() => setSelectedAuthority({ id: `${isSearch ? 'search' : 'browse'}` })}
      />
    </>
  );
};

const getComponent = ({
  readParamsFromUrl,
  authoritiesCtxValue = {},
  ...props
} = {}) => (
  <AuthoritiesSearchContext.Provider value={authoritiesCtxValue}>
    <SelectedAuthorityRecordContextProvider readParamsFromUrl={readParamsFromUrl}>
      <TestingComponent
        {...props}
        readParamsFromUrl={readParamsFromUrl}
      />
    </SelectedAuthorityRecordContextProvider>
  </AuthoritiesSearchContext.Provider>
);

const customRender = (props) => render(getComponent(props));

describe('Given Provider', () => {
  describe('when the readParamsFromUrl is true', () => {
    it('should store selected authority record for Search and Browse searches separately', () => {
      const props = { readParamsFromUrl: true };

      const { getByText, getByRole, rerender } = customRender(props);

      fireEvent.click(getByRole('button'));

      useLocation.mockReturnValue({ search: '?segment=browse' });
      rerender(getComponent(props));
      fireEvent.click(getByRole('button'));

      useLocation.mockReturnValue({ search: '?segment=search' });
      rerender(getComponent(props));
      expect(getByText('search')).toBeDefined();

      useLocation.mockReturnValue({ search: '?segment=browse' });
      rerender(getComponent(props));
      expect(getByText('browse')).toBeDefined();

      useLocation.mockRestore();
    });
  });

  describe('when the readParamsFromUrl is false', () => {
    it('should store authority record for Search and Browse searches apart based on navigationSegmentValue', () => {
      const { getByText, getByRole, rerender } = customRender({
        authoritiesCtxValue: { navigationSegmentValue: 'search' },
      });

      fireEvent.click(getByRole('button'));
      expect(getByText('search')).toBeDefined();

      rerender(getComponent({
        authoritiesCtxValue: { navigationSegmentValue: 'browse' },
      }));
      fireEvent.click(getByRole('button'));
      expect(getByText('browse')).toBeDefined();

      rerender(getComponent({
        authoritiesCtxValue: { navigationSegmentValue: 'search' },
      }));
      expect(getByText('search')).toBeDefined();

      rerender(getComponent({
        authoritiesCtxValue: { navigationSegmentValue: 'browse' },
      }));
      expect(getByText('browse')).toBeDefined();
    });
  });
});
