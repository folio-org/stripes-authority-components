import { useContext } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import {
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import { CollapseFilterPaneButton } from '@folio/stripes/smart-components';

import {
  AuthoritiesSearchForm,
  AuthoritiesSearchContext,
  SearchFilters,
  BrowseFilters,
  navigationSegments,
} from '../';

const propTypes = {
  excludedBrowseFilters: PropTypes.instanceOf(Set),
  excludedSearchFilters: PropTypes.instanceOf(Set),
  hasAdvancedSearch: PropTypes.bool,
  height: PropTypes.string,
  isFilterPaneVisible: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onShowDetailView: PropTypes.func,
  onSubmitSearch: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  resetSelectedRows: PropTypes.func,
  toggleFilterPane: PropTypes.func.isRequired,
};

const AuthoritiesSearchPane = ({
  isFilterPaneVisible,
  toggleFilterPane,
  isLoading,
  onSubmitSearch,
  resetSelectedRows,
  query,
  hasAdvancedSearch,
  height,
  excludedBrowseFilters,
  excludedSearchFilters,
  onShowDetailView,
}) => {
  const intl = useIntl();
  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);

  if (!isFilterPaneVisible) {
    return null;
  }

  return (
    <Pane
      defaultWidth="320px"
      height={height}
      id="pane-authorities-filters"
      data-testid="pane-authorities-filters"
      fluidContentWidth
      paneTitle={intl.formatMessage({ id: 'stripes-authority-components.search.searchAndFilter' })}
      lastMenu={(
        <PaneMenu>
          <CollapseFilterPaneButton onClick={toggleFilterPane} />
        </PaneMenu>
      )}
    >
      <AuthoritiesSearchForm
        isAuthoritiesLoading={isLoading}
        onSubmitSearch={onSubmitSearch}
        onShowDetailView={onShowDetailView}
        resetSelectedRows={resetSelectedRows}
        hasAdvancedSearch={hasAdvancedSearch}
      />
      {
        navigationSegmentValue === navigationSegments.browse
          ? (
            <BrowseFilters
              cqlQuery={query}
              excludedFilters={excludedBrowseFilters}
            />
          )
          : (
            <SearchFilters
              isSearching={isLoading}
              cqlQuery={query}
              excludedFilters={excludedSearchFilters}
            />
          )
      }
    </Pane>
  );
};

AuthoritiesSearchPane.propTypes = propTypes;
AuthoritiesSearchPane.defaultProps = {
  excludedBrowseFilters: new Set(),
  excludedSearchFilters: new Set(),
  resetSelectedRows: noop,
  hasAdvancedSearch: false,
  height: null,
  onShowDetailView: noop,
};

export default AuthoritiesSearchPane;
