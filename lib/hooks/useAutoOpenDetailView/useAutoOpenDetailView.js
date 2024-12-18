import {
  useContext,
  useEffect,
  useRef,
} from 'react';

import { navigationSegments } from '../../constants';
import { AuthoritiesSearchContext } from '../../context';

/**
 * @function useAutoOpenDetailView
 * @param {array} authorities Array of authorities.
 * @param {function} onOpenDetailView Callback function to be executed on detail view open.
 * @param {boolean} [isLoading = false] Flag indicating whether the detail view is currently loading. Default is false.
 * @param {string} [urlAuthorityId = ''] The ID of the authority from the URL. Default is an empty string.
 * */
const useAutoOpenDetailView = (authorities, onOpenDetailView, isLoading = false, urlAuthorityId = '') => {
  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);
  const prevOpenedSingleAuthority = useRef(null);
  const isBlockOnMount = useRef(false);

  useEffect(() => {
    // block auto-opening on page reload and redirection from quick marc.
    if (urlAuthorityId) {
      isBlockOnMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // do nothing during loading, to be able to correctly compare the previously opened record with the current one.
    if (isLoading || authorities.length !== 1) {
      prevOpenedSingleAuthority.current = null;
      return;
    }

    const authority = authorities[0];

    let isDetailViewNeedsToBeOpen = false;

    if (navigationSegmentValue === navigationSegments.browse) {
      isDetailViewNeedsToBeOpen = authority?.isAnchor && authority?.isExactMatch;
    } else {
      if (isBlockOnMount.current) {
        // record should be stored to avoid auto-opening after closing the third pane.
        prevOpenedSingleAuthority.current = authority;
        isBlockOnMount.current = false;
        return;
      }

      // when closing a record it shouldn't be reopened, so compare the previously opened record with the current one.
      if (!authority?.isAnchor && prevOpenedSingleAuthority.current !== authorities[0]) {
        isDetailViewNeedsToBeOpen = true;
      }
    }

    if (isDetailViewNeedsToBeOpen) {
      prevOpenedSingleAuthority.current = authority;
      onOpenDetailView(authority);
    }
  }, [authorities, navigationSegmentValue, onOpenDetailView, isLoading]);
};

export default useAutoOpenDetailView;
