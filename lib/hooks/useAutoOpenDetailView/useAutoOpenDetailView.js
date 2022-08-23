import {
  useContext,
  useEffect,
} from 'react';

import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
  navigationSegments,
} from '@folio/stripes-authority-components';

const useAutoOpenDetailView = ({ authorities, totalRecords, redirectToAuthorityRecord, setShowDetailView }) => {
  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);
  const [, setSelectedAuthorityRecord] = useContext(SelectedAuthorityRecordContext);

  useEffect(() => {
    if (totalRecords !== 1) {
      return;
    }

    const firstAuthority = authorities[0];

    const isDetailViewNeedsToBeOpened = navigationSegmentValue === navigationSegments.browse
      ? firstAuthority?.isAnchor && firstAuthority?.isExactMatch
      : true;

    if (isDetailViewNeedsToBeOpened) {
      if (redirectToAuthorityRecord) {
        redirectToAuthorityRecord(firstAuthority);
      } else {
        setSelectedAuthorityRecord(firstAuthority);
        setShowDetailView(true);
      }
    }
    // eslint-disable-next-line
  }, [totalRecords, authorities, navigationSegmentValue]);
};

export default useAutoOpenDetailView;
