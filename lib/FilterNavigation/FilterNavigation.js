import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ButtonGroup,
} from '@folio/stripes/components';

import { AuthoritiesSearchContext } from '../context';
import { navigationSegments } from '../constants';

const FilterNavigation = () => {
  const {
    navigationSegmentValue,
    setNavigationSegmentValue,
  } = useContext(AuthoritiesSearchContext);

  return (
    <ButtonGroup
      fullWidth
      role="tablist"
    >
      {
        Object.keys(navigationSegments).map(name => (
          <Button
            key={`${name}`}
            buttonStyle={`${navigationSegmentValue === name ? 'primary' : 'default'}`}
            aria-selected={navigationSegmentValue === name}
            role="tab"
            id={`segment-navigation-${name}`}
            data-testid={`segment-navigation-${name}`}
            onClick={() => setNavigationSegmentValue(name)}
          >
            <FormattedMessage id={`stripes-authority-components.label.${name}`} />
          </Button>
        ))
      }
    </ButtonGroup>
  );
};

export default FilterNavigation;
