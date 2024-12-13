import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import useAutoOpenDetailView from './useAutoOpenDetailView';
import Harness from '../../../test/jest/helpers/harness';

const Wrapper = ({ children, authoritiesCtxValue }) => (
  <Harness authoritiesCtxValue={{
    navigationSegmentValue: 'search',
    ...authoritiesCtxValue,
  }}
  >
    {children}
  </Harness>
);

const openDetailView = jest.fn();

const authorities = [
  { id: '1' },
  { id: '2' },
];

describe('useAutoOpenDetailView hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Given Search lookup', () => {
    describe('when records are loading', () => {
      it('should not open record`s detail view', () => {
        const isLoading = true;

        renderHook(() => useAutoOpenDetailView([authorities[0]], openDetailView, isLoading), {
          wrapper: Wrapper,
        });

        expect(openDetailView).not.toHaveBeenCalled();
      });
    });

    describe('when there is more than one record', () => {
      it('should not open record`s detail view', () => {
        renderHook(() => useAutoOpenDetailView(authorities, openDetailView), {
          wrapper: Wrapper,
        });

        expect(openDetailView).not.toHaveBeenCalled();
      });
    });

    describe('when there is a record ID in URL', () => {
      describe('and it is mount (page reload or redirection from quick marc)', () => {
        it('should not open record`s detail view', async () => {
          const isLoading = true;
          const urlAuthorityId = 'fake-id';

          const initialProps = [[], openDetailView, isLoading, urlAuthorityId];

          const { rerender } = renderHook(_initialProps => useAutoOpenDetailView(..._initialProps), {
            wrapper: Wrapper,
            initialProps,
          });

          rerender([
            [authorities[0]],
            openDetailView,
            false,
            urlAuthorityId,
          ]);

          expect(openDetailView).not.toHaveBeenCalled();
        });
      });

      describe('and closing the opened single record', () => {
        it('should not reopen record`s detail view', () => {
          const isLoading = true;
          const urlAuthorityId = 'fake-id';

          const initialProps = [
            [],
            openDetailView,
            isLoading,
            urlAuthorityId,
          ];

          const { rerender } = renderHook(_initialProps => useAutoOpenDetailView(..._initialProps), {
            initialProps,
            wrapper: Wrapper,
          });

          rerender([
            [authorities[0]],
            openDetailView,
            false,
            urlAuthorityId,
          ]);

          const _urlAuthorityId = null;

          rerender([
            [authorities[0]],
            openDetailView,
            false,
            _urlAuthorityId,
          ]);

          expect(openDetailView).not.toHaveBeenCalled();
        });
      });

      it('should not open record`s detail view', () => {
        const isLoading = false;
        const urlAuthorityId = 'fake-id';

        renderHook(() => useAutoOpenDetailView([authorities[0]], openDetailView, isLoading, urlAuthorityId), {
          wrapper: Wrapper,
        });

        expect(openDetailView).not.toHaveBeenCalled();
      });
    });

    describe('when closing an open single record', () => {
      it('should not reopen record`s detail view', () => {
        const isLoading = false;
        const urlAuthorityId = 'fake-id';

        const initialProps = [
          [authorities[0]],
          openDetailView,
          isLoading,
          urlAuthorityId,
        ];

        const { rerender } = renderHook(_initialProps => useAutoOpenDetailView(..._initialProps), {
          initialProps,
          wrapper: Wrapper,
        });

        const _urlAuthorityId = null;

        rerender([
          [authorities[0]],
          openDetailView,
          isLoading,
          _urlAuthorityId,
        ]);

        expect(openDetailView).not.toHaveBeenCalled();
      });
    });

    describe('when there is an auto-opened record, and then multiple records are requested', () => {
      describe('and then a previously auto-opened record is requested again', () => {
        it('should be auto-opened', () => {
          const isLoading = false;
          const urlAuthorityId = undefined;

          const initialProps = [
            [authorities[0]],
            openDetailView,
            isLoading,
            urlAuthorityId,
          ];

          const { rerender } = renderHook(_initialProps => useAutoOpenDetailView(..._initialProps), {
            initialProps,
            wrapper: Wrapper,
          });

          rerender([
            authorities,
            openDetailView,
            isLoading,
            urlAuthorityId,
          ]);

          rerender(initialProps);

          expect(openDetailView).toHaveBeenNthCalledWith(2, authorities[0]);
        });
      });
    });

    describe('when the single record is anchor', () => {
      it('should not be open', () => {
        const authority = {
          ...authorities[0],
          isAnchor: true,
        };

        renderHook(() => useAutoOpenDetailView([authority], openDetailView), {
          wrapper: Wrapper,
        });

        expect(openDetailView).not.toHaveBeenCalled();
      });
    });

    describe('when there is a single record', () => {
      it('should be opened automatically', () => {
        const authority = authorities[0];

        renderHook(() => useAutoOpenDetailView([authority], openDetailView), {
          wrapper: Wrapper,
        });

        expect(openDetailView).toHaveBeenCalledWith(authority);
      });
    });
  });

  describe('Given Browse lookup', () => {
    const authoritiesCtxValue = {
      navigationSegmentValue: 'browse',
    };
    const BrowseWrapper = ({ children }) => Wrapper({ children, authoritiesCtxValue });

    describe('when there is a single record', () => {
      it('should be opened automatically', () => {
        const authority = {
          ...authorities[0],
          isAnchor: true,
          isExactMatch: true,
        };

        renderHook(() => useAutoOpenDetailView([authority], openDetailView), {
          wrapper: BrowseWrapper,
        });

        expect(openDetailView).toHaveBeenCalledWith(authority);
      });
    });

    describe('when there is a single record and it is not anchor', () => {
      it('should not be open', () => {
        const authority = {
          ...authorities[0],
          isAnchor: false,
          isExactMatch: true,
        };

        renderHook(() => useAutoOpenDetailView([authority], openDetailView), {
          wrapper: BrowseWrapper,
        });

        expect(openDetailView).not.toHaveBeenCalled();
      });
    });

    describe('when there is a single record and isExactMatch is false', () => {
      it('should not be open', () => {
        const authority = {
          ...authorities[0],
          isAnchor: true,
          isExactMatch: false,
        };

        renderHook(() => useAutoOpenDetailView([authority], openDetailView), {
          wrapper: BrowseWrapper,
        });

        expect(openDetailView).not.toHaveBeenCalled();
      });
    });
  });
});
