import {
  useMemo,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';

import {
  MultiColumnList,
  Icon,
} from '@folio/stripes/components';
import { SearchAndSortNoResultsMessage } from '@folio/stripes/smart-components';

import { SelectedAuthorityRecordContext } from '../context';
import { areRecordsEqual } from './utils';
import {
  AUTH_REF_TYPES,
  searchResultListColumns,
  AuthorityShape,
} from '../constants';

import css from './SearchResultsList.css';

const propTypes = {
  authorities: PropTypes.arrayOf(AuthorityShape).isRequired,
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  formatter: PropTypes.object,
  hasFilters: PropTypes.bool.isRequired,
  hasNextPage: PropTypes.bool,
  hasPrevPage: PropTypes.bool,
  hidePageIndices: PropTypes.bool,
  isFilterPaneVisible: PropTypes.bool.isRequired,
  itemToView: PropTypes.shape({
    localClientTop: PropTypes.number,
    selector: PropTypes.string,
  }),
  loaded: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  nonInteractiveHeaders: PropTypes.arrayOf(PropTypes.string),
  onHeaderClick: PropTypes.func,
  onNeedMoreData: PropTypes.func.isRequired,
  onRowFocus: PropTypes.func,
  pageSize: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  renderHeadingRef: PropTypes.func.isRequired,
  sortedColumn: PropTypes.string,
  sortOrder: PropTypes.string,
  toggleFilterPane: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const SearchResultsList = ({
  authorities,
  columnWidths,
  columnMapping,
  formatter,
  totalResults,
  loading,
  loaded,
  pageSize,
  onNeedMoreData,
  visibleColumns,
  sortedColumn,
  sortOrder,
  onHeaderClick,
  isFilterPaneVisible,
  query,
  toggleFilterPane,
  hasFilters,
  hidePageIndices,
  hasNextPage,
  hasPrevPage,
  renderHeadingRef,
  itemToView,
  nonInteractiveHeaders,
  onRowFocus,
}) => {
  const intl = useIntl();
  const [selectedAuthorityRecord, setSelectedAuthorityRecord] = useContext(SelectedAuthorityRecordContext);

  const defaultColumnMapping = {
    [searchResultListColumns.AUTH_REF_TYPE]: intl.formatMessage({ id: 'stripes-authority-components.search-results-list.authRefType' }),
    [searchResultListColumns.HEADING_REF]: intl.formatMessage({ id: 'stripes-authority-components.search-results-list.headingRef' }),
    [searchResultListColumns.HEADING_TYPE]: intl.formatMessage({ id: 'stripes-authority-components.search-results-list.headingType' }),
  };

  const defaultFormatter = {
    authRefType: authority => {
      return authority.authRefType === AUTH_REF_TYPES.AUTHORIZED
        ? <b>{authority.authRefType}</b>
        : authority.authRefType;
    },
    headingRef: authority => {
      const anchorLink = authority.isAnchor ? css.anchorLink : undefined;

      return (
        authority.isAnchor && !authority.isExactMatch
          ? (
            <Icon
              icon="exclamation-circle"
              status="error"
              iconRootClass={css.anchorLink}
            >
              {authority.headingRef}
              &nbsp;
              <span className={css.browseNoMatchText}>
                {intl.formatMessage({ id: 'stripes-authority-components.browse.noMatch.wouldBeHereLabel' })}
              </span>
            </Icon>
          )
          : renderHeadingRef(authority, anchorLink)
      );
    },
  };

  const onRowClick = (e, row) => {
    if (row.isAnchor && !row.isExactMatch) {
      return;
    }

    setSelectedAuthorityRecord(row);
  };

  const checkIsRowSelected = ({ item, criteria }) => {
    return areRecordsEqual(item, criteria);
  };

  const source = useMemo(
    () => ({
      loaded: () => (hasFilters || query) && loaded,
      pending: () => loading,
      failure: noop,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, hasFilters],
  );

  return (
    <MultiColumnList
      hasMargin
      columnMapping={{
        ...defaultColumnMapping,
        ...columnMapping,
      }}
      columnWidths={columnWidths}
      contentData={authorities}
      formatter={{
        ...defaultFormatter,
        ...formatter,
      }}
      id="authority-result-list"
      onNeedMoreData={onNeedMoreData}
      visibleColumns={visibleColumns}
      selectedRow={selectedAuthorityRecord}
      isSelected={checkIsRowSelected}
      onRowClick={onRowClick}
      totalCount={totalResults}
      pagingType="prev-next"
      pageAmount={pageSize}
      loading={loading}
      sortedColumn={sortedColumn}
      sortOrder={sortOrder}
      onHeaderClick={onHeaderClick}
      autosize
      hidePageIndices={hidePageIndices}
      pagingCanGoNext={hasNextPage}
      pagingCanGoPrevious={hasPrevPage}
      itemToView={itemToView}
      nonInteractiveHeaders={nonInteractiveHeaders}
      onMarkPosition={onRowFocus}
      isEmptyMessage={
        source
          ? (
            <div data-test-agreements-no-results-message>
              <SearchAndSortNoResultsMessage
                filterPaneIsVisible={isFilterPaneVisible}
                searchTerm={query || ''}
                source={source}
                toggleFilterPane={toggleFilterPane}
              />
            </div>
          )
          : '...'
      }
    />
  );
};

SearchResultsList.propTypes = propTypes;

SearchResultsList.defaultProps = {
  columnMapping: {},
  formatter: {},
  columnWidths: {
    [searchResultListColumns.SELECT]: { min: 30, max: 30 },
    [searchResultListColumns.AUTH_REF_TYPE]: { min: 200 },
    [searchResultListColumns.HEADING_REF]: { min: 400 },
    [searchResultListColumns.HEADING_TYPE]: { min: 200 },
  },
  hidePageIndices: false,
  hasNextPage: null,
  hasPrevPage: null,
  itemToView: null,
  onRowFocus: null,
  onHeaderClick: null,
  sortedColumn: null,
  sortOrder: null,
  totalResults: NaN,
  nonInteractiveHeaders: [],
};

export default SearchResultsList;
