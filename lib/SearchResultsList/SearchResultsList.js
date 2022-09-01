import {
  useMemo,
  useContext,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';

import {
  Checkbox,
  MultiColumnList,
  Icon,
} from '@folio/stripes/components';
import { SearchAndSortNoResultsMessage } from '@folio/stripes/smart-components';

import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
} from '../context';
import { areRecordsEqual } from './utils';
import {
  AUTH_REF_TYPES,
  navigationSegments,
  searchResultListColumns,
  AuthorityShape,
} from '../constants';

import css from './SearchResultsList.css';

const propTypes = {
  authorities: PropTypes.arrayOf(AuthorityShape).isRequired,
  columnWidths: PropTypes.object,
  hasFilters: PropTypes.bool.isRequired,
  hasNextPage: PropTypes.bool,
  hasPrevPage: PropTypes.bool,
  hidePageIndices: PropTypes.bool,
  isFilterPaneVisible: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onHeaderClick: PropTypes.func,
  onNeedMoreData: PropTypes.func.isRequired,
  onOpenRecord: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  renderHeadingRef: PropTypes.func.isRequired,
  selectAll: PropTypes.bool,
  selectedRows: PropTypes.object,
  sortedColumn: PropTypes.string,
  sortOrder: PropTypes.string,
  toggleFilterPane: PropTypes.func.isRequired,
  toggleRowSelection: PropTypes.func,
  toggleSelectAll: PropTypes.func,
  totalResults: PropTypes.number,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const SearchResultsList = ({
  authorities,
  columnWidths,
  totalResults,
  loading,
  loaded,
  pageSize,
  onNeedMoreData,
  visibleColumns,
  selectedRows,
  sortedColumn,
  sortOrder,
  onHeaderClick,
  isFilterPaneVisible,
  query,
  toggleFilterPane,
  toggleRowSelection,
  toggleSelectAll,
  selectAll,
  hasFilters,
  hidePageIndices,
  hasNextPage,
  hasPrevPage,
  renderHeadingRef,
  onOpenRecord,
}) => {
  const intl = useIntl();
  const [selectedAuthorityRecord, setSelectedAuthorityRecord] = useContext(SelectedAuthorityRecordContext);
  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);

  const columnMapping = {
    [searchResultListColumns.SELECT]: (
      <Checkbox
        onChange={() => toggleSelectAll()}
        name="select all authorities"
        checked={selectAll}
        title={selectAll
          ? intl.formatMessage({ id: 'stripes-authority-components.search-results-list.selectAll' })
          : intl.formatMessage({ id: 'stripes-authority-components.search-results-list.unselectAll' })
        }
      />
    ),
    [searchResultListColumns.AUTH_REF_TYPE]: intl.formatMessage({ id: 'stripes-authority-components.search-results-list.authRefType' }),
    [searchResultListColumns.HEADING_REF]: intl.formatMessage({ id: 'stripes-authority-components.search-results-list.headingRef' }),
    [searchResultListColumns.HEADING_TYPE]: intl.formatMessage({ id: 'stripes-authority-components.search-results-list.headingType' }),
  };

  const formatter = {
    // eslint-disable-next-line react/prop-types
    select: ({ id, ...rowData }) => id && (
      <div // eslint-disable-line jsx-a11y/click-events-have-key-events
        tabIndex="0"
        role="button"
        onClick={e => e.stopPropagation()}
      >
        <Checkbox
          checked={Boolean(selectedRows[id])}
          aria-label={intl.formatMessage({ id: 'ui-inventory.instances.rows.select' })}
          onChange={() => toggleRowSelection({
            id,
            ...rowData,
          })}
        />
      </div>
    ),
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

  useEffect(() => {
    if (totalResults !== 1) {
      return;
    }

    const firstAuthority = authorities[0];
    const isDetailViewNeedsToBeOpen = navigationSegmentValue === navigationSegments.browse
      ? firstAuthority?.isAnchor && firstAuthority?.isExactMatch
      : true;

    if (isDetailViewNeedsToBeOpen) {
      onOpenRecord(firstAuthority);
    }
    // eslint-disable-next-line
  }, [totalResults, authorities, navigationSegmentValue]);

  return (
    <MultiColumnList
      hasMargin
      columnMapping={columnMapping}
      columnWidths={columnWidths}
      contentData={authorities}
      formatter={formatter}
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
  columnWidths: {
    [searchResultListColumns.SELECT]: { min: 30, max: 30 },
    [searchResultListColumns.AUTH_REF_TYPE]: { min: 200 },
    [searchResultListColumns.HEADING_REF]: { min: 400 },
    [searchResultListColumns.HEADING_TYPE]: { min: 200 },
  },
  hidePageIndices: false,
  hasNextPage: null,
  hasPrevPage: null,
  onHeaderClick: null,
  selectAll: null,
  selectedRows: null,
  sortedColumn: null,
  sortOrder: null,
  toggleRowSelection: null,
  toggleSelectAll: null,
  totalResults: NaN,
};

export default SearchResultsList;
