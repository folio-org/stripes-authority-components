import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { fireEvent, render } from '@testing-library/react';

import {
  SelectedAuthorityRecordContextProvider,
  SelectedAuthorityRecordContext,
} from './SelectedAuthorityRecordContextProvider';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({ search: '?segment=search' }),
}));

const TestingComponent = () => {
  const [selectedAuthority, setSelectedAuthority] = useContext(SelectedAuthorityRecordContext);
  const location = useLocation();
  const isSearchSegment = location.search.includes('segment=search');

  return (
    <>
      <div data-testid="search">{isSearchSegment ? selectedAuthority?.id : 'record of Search lookup is not selected' }</div>
      <div data-testid="browse">{isSearchSegment ? 'record of Browse lookup is not selected' : selectedAuthority?.id}</div>
      <button
        type="button"
        onClick={() => setSelectedAuthority({ id: `record of ${isSearchSegment ? 'Search' : 'Browse'} lookup is selected` })}
      />
    </>
  );
};

const customRender = () => {
  return render(
    <SelectedAuthorityRecordContextProvider>
      <TestingComponent />
    </SelectedAuthorityRecordContextProvider>,
  );
};

describe('Given Provider', () => {
  describe('when the segment is "search"', () => {
    it('should change the authority record', () => {
      const { getByTestId, getByRole } = customRender();

      fireEvent.click(getByRole('button'));

      expect(getByTestId('search')).toHaveTextContent('record of Search lookup is selected');
      expect(getByTestId('browse')).toHaveTextContent('record of Browse lookup is not selected');
    });
  });

  describe('when the segment is "browse"', () => {
    it('should change the authority record', () => {
      useLocation.mockReturnValue({ search: '?segment=browse' });

      const { getByTestId, getByRole } = customRender();

      fireEvent.click(getByRole('button'));

      expect(getByTestId('browse')).toHaveTextContent('record of Browse lookup is selected');
      expect(getByTestId('search')).toHaveTextContent('record of Search lookup is not selected');

      useLocation.mockRestore();
    });
  });
});
