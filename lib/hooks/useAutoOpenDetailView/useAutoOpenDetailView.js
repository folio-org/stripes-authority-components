import {
  useContext,
  useEffect,
  useRef,
} from 'react';

import { navigationSegments } from '../../constants';
import { AuthoritiesSearchContext } from '../../context';

const useAutoOpenDetailView = (authorities, onOpenDetailView, isLoading, urlAuthorityId) => {
  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);
  const prevOpenedSingleAuthority = useRef(null);

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
      // Check the record id so that when the third pane has a single record open and the user creates a record
      // on a different route and then is redirected back to the third pane, then the third pane should contain
      // the newly created record instead of the previously opened one.
      if (urlAuthorityId) {
        // A single record can be opened in two ways: when reloading the page with opened single record and when all
        // the conditions for auto-opening a single record are met. So let's save the record for both cases. This will
        // be used to compare the previously opened record with the current one.
        prevOpenedSingleAuthority.current = authority;
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
  }, [authorities, navigationSegmentValue, onOpenDetailView, urlAuthorityId, isLoading]);
};

export default useAutoOpenDetailView;
