import { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import { Icon } from '@folio/stripes/components';

import { SelectedAuthorityRecordContext } from '../context';

import css from './SharedIcon.css';

const propTypes = {
  authority: PropTypes.shape({
    headingRef: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    shared: PropTypes.bool,
  }).isRequired,
};

const SharedIcon = ({ authority }) => {
  const [selectedAuthorityRecord] = useContext(SelectedAuthorityRecordContext);
  const isSelectedRecord = selectedAuthorityRecord?.id === authority.id
    && selectedAuthorityRecord?.headingRef === authority.headingRef;

  return (
    <Icon
      size="medium"
      icon="graph"
      iconRootClass={css.sharedIconRoot}
      iconClassName={classnames(
        css.sharedIcon,
        { [css.sharedIconLight]: isSelectedRecord },
      )}
    >
      <span
        data-testid={`shared-icon-${authority.id}`}
        className="sr-only"
      >
        <FormattedMessage id="stripes-authority-components.search.shared" />
      </span>
    </Icon>
  );
};

SharedIcon.propTypes = propTypes;

export { SharedIcon };
