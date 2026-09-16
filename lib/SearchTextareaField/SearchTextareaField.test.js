import { fireEvent, render } from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import SearchTextareaField from './SearchTextareaField';
import Harness from '../../test/jest/helpers/harness';

const searchableIndexes = [{
  label: 'test-label-1',
  value: 'test-value-1',
}, {
  label: 'test-label-2',
  value: 'test-value-2',
}];

const testRef = {
  current: {
    style: {
      height: '100px',
    },
  },
};

const mockOnSubmitSearch = jest.fn();

const renderSearchTextareaField = (props = {}) => render(
  <Harness>
    <SearchTextareaField
      id="test-search-textarea-field"
      searchableIndexes={searchableIndexes}
      onSubmitSearch={mockOnSubmitSearch}
      textAreaRef={testRef}
      {...props}
    />
  </Harness>,
);

describe('Given SearchTextareaField', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderSearchTextareaField();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when isSearchDisabled is true', () => {
    it('should disable submit on enter', () => {
      const { getByRole } = renderSearchTextareaField({
        isSearchDisabled: true,
      });

      fireEvent.keyDown(getByRole('textbox'), { keyCode: 13 });

      expect(mockOnSubmitSearch).not.toHaveBeenCalled();
    });
  });
});
