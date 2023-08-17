import { render } from '@folio/jest-config-stripes/testing-library/react';

import { SharedIcon } from './SharedIcon';
import Harness from '../../test/jest/helpers/harness';

const authority = {
  id: 'test-id',
  headingRef: 'Twain, Mark',
  shared: true,
};

const renderSharedIcon = (props = {}) => render(
  <Harness>
    <SharedIcon
      authority={authority}
      {...props}
    />
  </Harness>,
);

describe('SharedIcon', () => {
  it('should render shared icon', () => {
    const { getByText } = renderSharedIcon({ authority });

    expect(getByText('stripes-authority-components.search.shared')).toBeInTheDocument();
  });
});
