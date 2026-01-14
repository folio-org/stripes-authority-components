import {
  useMemo,
  useContext,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';

import {
  MultiColumnList,
  Icon,
} from '@folio/stripes/components';
import { SearchAndSortNoResultsMessage } from '@folio/stripes/smart-components';
import { useNamespace } from '@folio/stripes/core';

import { useAuthoritySourceFiles } from '../queries';
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
  error: PropTypes.object,
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
  showSortIndicator: PropTypes.bool,
  sortableColumns: PropTypes.arrayOf(PropTypes.string),
  sortedColumn: PropTypes.string,
  sortOrder: PropTypes.string,
  toggleFilterPane: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const SearchResultsList = ({
  authorities,
  loading,
  loaded,
  pageSize,
  onNeedMoreData,
  visibleColumns,
  isFilterPaneVisible,
  query,
  toggleFilterPane,
  hasFilters,
  renderHeadingRef,
  columnMapping = {},
  error = null,
  formatter = {},
  columnWidths = {
    [searchResultListColumns.SELECT]: { min: 30, max: 30 },
    [searchResultListColumns.AUTH_REF_TYPE]: { min: 200 },
    [searchResultListColumns.HEADING_REF]: { min: 400 },
    [searchResultListColumns.HEADING_TYPE]: { min: 200 },
  },
  hidePageIndices = false,
  hasNextPage = null,
  hasPrevPage = null,
  onRowFocus = noop,
  onHeaderClick = noop,
  showSortIndicator = false,
  sortableColumns = [],
  sortedColumn = null,
  sortOrder = null,
  totalResults = NaN,
  nonInteractiveHeaders = [],
}) => {
  const intl = useIntl();
  const namespace = useNamespace();
  const [selectedAuthorityRecord, setSelectedAuthorityRecord] = useContext(SelectedAuthorityRecordContext);

  const { sourceFiles } = useAuthoritySourceFiles();

  const itemToView = JSON.parse(sessionStorage.getItem(`${namespace}.position`));

  const handleMarkPosition = useCallback(position => {
    onRowFocus(position);
    sessionStorage.setItem(`${namespace}.position`, JSON.stringify(position));
  }, [namespace, onRowFocus]);

  const handleMarkReset = useCallback(() => {
    sessionStorage.setItem(`${namespace}.position`, null);
  }, [namespace]);

  const defaultFormatter = {
    // eslint-disable-next-line react/no-multi-comp, react/prop-types
    [searchResultListColumns.AUTH_REF_TYPE]: ({ authRefType }) => {
      return authRefType === AUTH_REF_TYPES.AUTHORIZED
        ? <b>{authRefType}</b>
        : authRefType;
    },
    // eslint-disable-next-line react/no-multi-comp
    [searchResultListColumns.HEADING_REF]: authority => {
      const {
        isAnchor,
        isExactMatch,
        headingRef,
      } = authority;
      const anchorLink = isAnchor ? css.anchorLink : undefined;

      return (
        isAnchor && !isExactMatch
          ? (
            <span>
              <Icon
                icon="exclamation-circle"
                status="error"
                iconRootClass={css.anchorLink}
              />
              <span className={css.noMatchLabelWrapper}>
                {headingRef}
                &ensp;
                <span className={css.browseNoMatchText}>
                  {intl.formatMessage({ id: 'stripes-authority-components.browse.noMatch.wouldBeHereLabel' })}
                </span>
              </span>
            </span>
          )
          : renderHeadingRef(authority, anchorLink)
      );
    },
    [searchResultListColumns.AUTHORITY_SOURCE]: ({ sourceFileId, isAnchor, isExactMatch }) => {
      if (isAnchor && !isExactMatch) {
        return '';
      }

      return sourceFiles.find(sourceFile => sourceFile.id === sourceFileId)?.name
        || intl.formatMessage({ id: 'stripes-authority-components.search.sourceFileId.nullOption' });
    },
  };

  const onRowClick = (e, row) => {
    if (!row || (row.isAnchor && !row.isExactMatch)) {
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
      failure: () => error,
      failureMessage() {
        const status = error?.response?.status;

        if (status === 403) {
          return intl.formatMessage({ id: 'stripes-authority-components.authorities.error.forbidden' });
        }

        return intl.formatMessage({ id: 'stripes-authority-components.search-results-list.error.badRequest' }, { query });
      },
    }),
    [loading, hasFilters, query, loaded, error, intl],
  );

  return (
    <MultiColumnList
      hasMargin
      columnMapping={columnMapping}
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
      sortableFields={sortableColumns}
      sortedColumn={sortedColumn}
      sortDirection={sortOrder}
      sortOrder={sortOrder}
      showSortIndicator={showSortIndicator}
      onHeaderClick={onHeaderClick}
      autosize
      hidePageIndices={hidePageIndices}
      pagingCanGoNext={hasNextPage}
      pagingCanGoPrevious={hasPrevPage}
      itemToView={itemToView}
      nonInteractiveHeaders={nonInteractiveHeaders}
      onMarkPosition={handleMarkPosition}
      onMarkReset={handleMarkReset}
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

export default SearchResultsList;
