import { renderHook } from '@testing-library/react-hooks';

import useAutoOpenDetailView from './useAutoOpenDetailView';
import Harness from '../../../test/jest/helpers/harness';

const wrapper = ({ children, authoritiesCtxValue }) => (
  <Harness authoritiesCtxValue={authoritiesCtxValue}>
    {children}
  </Harness>
);

const openDetailView = jest.fn();

describe('useAutoOpenDetailView hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when the records is not equal to one', () => {
    it('should not open detail view', () => {
      const records = [];
      const initialProps = {
        authoritiesCtxValue: {
          navigationSegmentValue: 'search',
        },
      };

      renderHook(() => useAutoOpenDetailView(records, openDetailView), { wrapper, initialProps });
      expect(openDetailView).not.toHaveBeenCalled();
    });
  });

  describe('when doNotShowRecord is true', () => {
    it('should not open detail view', () => {
      const records = [{}];
      const doNotShowRecord = true;
      const initialProps = {
        authoritiesCtxValue: {
          navigationSegmentValue: 'search',
        },
      };

      renderHook(() => useAutoOpenDetailView(records, openDetailView, doNotShowRecord), { wrapper, initialProps });
      expect(openDetailView).not.toHaveBeenCalled();
    });
  });

  describe('when there is only one record', () => {
    describe('and navigation segment is `search`', () => {
      it('should open detail view', () => {
        const records = [{}];
        const initialProps = {
          authoritiesCtxValue: {
            navigationSegmentValue: 'search',
          },
        };

        renderHook(() => useAutoOpenDetailView(records, openDetailView), { wrapper, initialProps });
        expect(openDetailView).toHaveBeenCalledWith(records[0]);
      });
    });

    describe('navigation segment is `search` and isAnchor is set to true', () => {
      it('should not open detail view', () => {
        const records = [{ isAnchor: true }];
        const initialProps = {
          authoritiesCtxValue: {
            navigationSegmentValue: 'search',
          },
        };

        renderHook(() => useAutoOpenDetailView(records, openDetailView), { wrapper, initialProps });
        expect(openDetailView).not.toHaveBeenCalledWith(records[0]);
      });
    });

    describe('navigation segment is `browse` and isAnchor and isExactMatch are set to true', () => {
      it('should open detail view', () => {
        const records = [{ isAnchor: true, isExactMatch: true }];
        const initialProps = {
          authoritiesCtxValue: {
            navigationSegmentValue: 'browse',
          },
        };

        renderHook(() => useAutoOpenDetailView(records, openDetailView), { wrapper, initialProps });
        expect(openDetailView).toHaveBeenCalledWith(records[0]);
      });
    });
  });
});
