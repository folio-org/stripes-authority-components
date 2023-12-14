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
  excludedFilters: PropTypes.object,
  firstPageQuery: PropTypes.string.isRequired,
  hasAdvancedSearch: PropTypes.bool,
  hasMatchSelection: PropTypes.bool,
  hasQueryOption: PropTypes.bool,
  height: PropTypes.string,
  isFilterPaneVisible: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onShowDetailView: PropTypes.func,
  onSubmitSearch: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  resetSelectedRows: PropTypes.func,
  tenantId: PropTypes.string,
  toggleFilterPane: PropTypes.func.isRequired,
};

const AuthoritiesSearchPane = ({
  excludedFilters,
  isFilterPaneVisible,
  toggleFilterPane,
  isLoading,
  onSubmitSearch,
  resetSelectedRows,
  query,
  hasAdvancedSearch,
  hasQueryOption,
  hasMatchSelection,
  height,
  tenantId,
  onShowDetailView,
  firstPageQuery,
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
        hasQueryOption={hasQueryOption}
        hasMatchSelection={hasMatchSelection}
      />
      {
        navigationSegmentValue === navigationSegments.browse
          ? (
            <BrowseFilters
              cqlQuery={firstPageQuery}
              excludedFilters={excludedFilters[navigationSegments.browse]}
              tenantId={tenantId}
            />
          )
          : (
            <SearchFilters
              isSearching={isLoading}
              cqlQuery={query}
              excludedFilters={excludedFilters[navigationSegments.search]}
              tenantId={tenantId}
            />
          )
      }
    </Pane>
  );
};

AuthoritiesSearchPane.propTypes = propTypes;
AuthoritiesSearchPane.defaultProps = {
  excludedFilters: {},
  resetSelectedRows: noop,
  hasAdvancedSearch: false,
  hasQueryOption: true,
  hasMatchSelection: false,
  height: null,
  onShowDetailView: noop,
  tenantId: '',
};

export default AuthoritiesSearchPane;
