import { render } from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import FacetOptionFormatter from './FacetOptionFormatter';

import Harness from '../../test/jest/helpers/harness';

const option = {
  label: 'Option label',
  totalRecords: 1000,
};

const renderFacetOptionFormatter = (props = {}) => render(
  <Harness>
    <FacetOptionFormatter option={option} {...props} />
  </Harness>,
);

describe('Given FacetOptionFormatter', () => {
  it('should render option label', () => {
    const { getByText } = renderFacetOptionFormatter();

    expect(getByText('Option label')).toBeDefined();
  });

  it('should render option facet count', () => {
    const { getByText } = renderFacetOptionFormatter();

    expect(getByText('(1000)')).toBeDefined();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderFacetOptionFormatter();

    await runAxeTest({
      rootNode: container,
    });
  });
});
