import { renderHook } from '@testing-library/react-hooks';

import useBrowseResultFocus from './useBrowseResultFocus';

describe('Given useBrowseResultFocus', () => {
  describe('when isLoading is false and isPaginationClicked is true', () => {
    it('should focus the list row', () => {
      const { result, rerender } = renderHook(useBrowseResultFocus, { initialProps: true });
      const { resultsContainerRef, isPaginationClicked } = result.current;

      const mockContainer = document.createElement('div');

      mockContainer.setAttribute('data-row-inner', true);

      const mockContainerSpy = jest.spyOn(mockContainer, 'focus');

      resultsContainerRef.current = {
        querySelector: () => mockContainer,
      };
      isPaginationClicked.current = true;

      expect(result.current.isPaginationClicked.current).toBeTruthy();

      rerender(false);

      expect(result.current.isPaginationClicked.current).toBeFalsy();
      expect(mockContainerSpy).toHaveBeenCalled();
    });
  });

  describe('when isLoading is true', () => {
    it('shouldn`t focus the list row', () => {
      const { result, rerender } = renderHook(useBrowseResultFocus, { initialProps: true });
      const { resultsContainerRef, isPaginationClicked } = result.current;

      const mockContainer = document.createElement('div');

      mockContainer.setAttribute('data-row-inner', true);

      const mockContainerSpy = jest.spyOn(mockContainer, 'focus');

      resultsContainerRef.current = {
        querySelector: () => mockContainer,
      };
      isPaginationClicked.current = true;

      expect(result.current.isPaginationClicked.current).toBeTruthy();

      rerender(true);

      expect(result.current.isPaginationClicked.current).toBeTruthy();
      expect(mockContainerSpy).not.toHaveBeenCalled();
    });
  });

  describe('when isPaginationClicked is false', () => {
    it('shouldn`t focus the list row', () => {
      const { result, rerender } = renderHook(useBrowseResultFocus, { initialProps: true });
      const { resultsContainerRef, isPaginationClicked } = result.current;

      const mockContainer = document.createElement('div');

      mockContainer.setAttribute('data-row-inner', true);

      const mockContainerSpy = jest.spyOn(mockContainer, 'focus');

      resultsContainerRef.current = {
        querySelector: () => mockContainer,
      };
      isPaginationClicked.current = false;

      rerender(false);

      expect(mockContainerSpy).not.toHaveBeenCalled();
    });
  });
});
