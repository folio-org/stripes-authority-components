import {
  render,
  fireEvent,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import FilterNavigation from './FilterNavigation';
import {
  navigationSegments,
  searchableIndexesValues,
} from '../constants';
import Harness from '../../test/jest/helpers/harness';

const mockSetNavigationSegmentValue = jest.fn();
const mockSetSearchDropdownValue = jest.fn();
const mockSetSearchIndex = jest.fn();

const authoritiesCtxValueData = {
  setNavigationSegmentValue: mockSetNavigationSegmentValue,
  setSearchDropdownValue: mockSetSearchDropdownValue,
  setSearchIndex: mockSetSearchIndex,
  defaultDropdownValueBySegment: {
    [navigationSegments.search]: searchableIndexesValues.KEYWORD,
    [navigationSegments.browse]: '',
  },
};

const renderFilterNavigation = (authoritiesCtxValue) => render(
  <Harness authoritiesCtxValue={authoritiesCtxValue}>
    <FilterNavigation />
  </Harness>,
);

describe('Given FilterNavigation', () => {
  it('should display Search and Browse navigation toggle', () => {
    const { getByTestId } = renderFilterNavigation();

    expect(getByTestId('segment-navigation-search')).toBeDefined();
    expect(getByTestId('segment-navigation-browse')).toBeDefined();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderFilterNavigation(authoritiesCtxValueData);

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when toggle navigation segment', () => {
    describe('and defaultDropdownValueBySegment exists and segment is "search"', () => {
      it('should handle onClick', () => {
        const { getByTestId } = renderFilterNavigation(authoritiesCtxValueData);

        fireEvent.click(getByTestId('segment-navigation-search'));

        expect(mockSetNavigationSegmentValue).toHaveBeenCalledWith(navigationSegments.search);
        expect(mockSetSearchDropdownValue).toHaveBeenCalledWith('keyword');
        expect(mockSetSearchIndex).toHaveBeenCalledWith('keyword');
      });
    });

    describe('and defaultDropdownValueBySegment does not exist and segment is "search"', () => {
      it('should handle onClick', () => {
        const { getByTestId } = renderFilterNavigation({
          ...authoritiesCtxValueData,
          defaultDropdownValueBySegment: {},
        });

        fireEvent.click(getByTestId('segment-navigation-search'));

        expect(mockSetNavigationSegmentValue).toHaveBeenCalledWith(navigationSegments.search);
        expect(mockSetSearchDropdownValue).toHaveBeenCalledWith('');
        expect(mockSetSearchIndex).toHaveBeenCalledWith('');
      });
    });
  });
});
