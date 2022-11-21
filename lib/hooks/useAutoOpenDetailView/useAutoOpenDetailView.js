import {
  useContext,
  useEffect,
} from 'react';

import { navigationSegments } from '../../constants';
import { AuthoritiesSearchContext } from '../../context';

const useAutoOpenDetailView = (authorities, onOpenDetailView) => {
  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);

  useEffect(() => {
    if (authorities.length !== 1) {
      return;
    }

    const firstAuthority = authorities[0];

    const isDetailViewNeedsToBeOpen = navigationSegmentValue === navigationSegments.browse
      ? firstAuthority?.isAnchor && firstAuthority?.isExactMatch
      : !firstAuthority?.isAnchor;

    if (isDetailViewNeedsToBeOpen) {
      onOpenDetailView(firstAuthority);
    }
  }, [authorities, navigationSegmentValue, onOpenDetailView]);
};

export default useAutoOpenDetailView;
