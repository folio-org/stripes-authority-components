import {
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import {
  Button,
  Icon,
  AdvancedSearch,
  Row,
  Col,
  HotKeys,
} from '@folio/stripes/components';

import { SearchTextareaField } from '../SearchTextareaField';
import { FilterNavigation } from '../FilterNavigation';
import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
} from '../context';
import {
  navigationSegments,
  rawBrowseSearchableIndexes,
  rawDefaultSearchableIndexes,
  advancedSearchIndexes,
  searchableIndexesValues,
} from '../constants';

import css from './AuthoritiesSearchForm.css';

const propTypes = {
  hasAdvancedSearch: PropTypes.bool,
  isAuthoritiesLoading: PropTypes.bool.isRequired,
  onChangeSortOption: PropTypes.func,
  onShowDetailView: PropTypes.func,
  onSubmitSearch: PropTypes.func.isRequired,
  resetSelectedRows: PropTypes.func.isRequired,
};

const AuthoritiesSearchForm = ({
  isAuthoritiesLoading,
  onSubmitSearch,
  onChangeSortOption,
  onShowDetailView,
  resetSelectedRows,
  hasAdvancedSearch,
}) => {
  const intl = useIntl();

  const {
    navigationSegmentValue,
    filters,
    searchDropdownValue,
    searchInputValue,
    setSearchInputValue,
    setSearchQuery,
    setSearchDropdownValue,
    setSearchIndex,
    setAdvancedSearchRows,
    resetAll,
    advancedSearchDefaultSearch,
    setAdvancedSearchDefaultSearch,
  } = useContext(AuthoritiesSearchContext);
  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  const searchInputRef = useRef();

  const handleResetAll = () => {
    onShowDetailView(false);
    resetAll();
    resetSelectedRows();
    setSelectedAuthorityRecordContext(null);
    onChangeSortOption('');
  };

  const handleAdvancedSearch = (searchString, searchRows) => {
    setSearchDropdownValue(searchableIndexesValues.ADVANCED_SEARCH);
    setSearchIndex(searchableIndexesValues.ADVANCED_SEARCH);
    setSearchInputValue(searchString);
    setSearchQuery(searchString);
    setAdvancedSearchRows(searchRows);
    setIsAdvancedSearchOpen(false);
  };

  useEffect(() => {
    setAdvancedSearchDefaultSearch({
      query: searchInputValue,
      option: searchDropdownValue,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInputValue, searchDropdownValue]);

  const rawSearchableIndexes = navigationSegmentValue === navigationSegments.browse
    ? rawBrowseSearchableIndexes
    : rawDefaultSearchableIndexes;

  const searchableIndexes = rawSearchableIndexes.map(index => ({
    label: intl.formatMessage({ id: index.label }),
    value: index.value,
  }));

  const advancedSearchOptions = advancedSearchIndexes.map(index => ({
    label: intl.formatMessage({ id: index.label }),
    value: index.value,
  }));

  const isSearchButtonDisabled = (navigationSegmentValue === navigationSegments.browse && !searchDropdownValue)
    || !searchInputValue
    || isAuthoritiesLoading;

  const isFiltersApplied = Object.values(filters).find(value => value.length > 0);
  const isResetAllButtonDisabled = (!searchInputValue && !isFiltersApplied) || isAuthoritiesLoading;

  const hotKeys = {
    search: ['enter'],
  };

  const getHandlers = rowState => ({
    search:e => {
      if (isSearchButtonDisabled) return e.preventDefault();

      return onSubmitSearch(e, rowState);
    },
  });

  const placeholderValue = navigationSegmentValue === navigationSegments.browse
    ? intl.formatMessage({ id: 'stripes-authority-components.browseSelectPlaceholder' })
    : null;

  return (
    <AdvancedSearch
      open={isAdvancedSearchOpen}
      searchOptions={advancedSearchOptions}
      defaultSearchOptionValue={searchableIndexesValues.KEYWORD}
      firstRowInitialSearch={advancedSearchDefaultSearch}
      onSearch={handleAdvancedSearch}
      onCancel={() => setIsAdvancedSearchOpen(false)}
    >
      {({ resetRows, rowState }) => (
        <HotKeys
          keyMap={hotKeys}
          handlers={getHandlers(rowState)}
        >
          <form onSubmit={e => onSubmitSearch(e, rowState)}>
            <FilterNavigation />
            <div className={css.searchGroupWrap}>
              <SearchTextareaField
                textAreaRef={searchInputRef}
                autoFocus
                rows="1"
                name="query"
                id="textarea-authorities-search"
                className={css.searchField}
                placeholder={placeholderValue}
                searchableIndexes={searchableIndexes}
                onSubmitSearch={onSubmitSearch}
              />
              <Button
                id="submit-authorities-search"
                data-testid="submit-authorities-search"
                type="submit"
                buttonStyle="primary"
                fullWidth
                marginBottom0
                disabled={isSearchButtonDisabled}
              >
                {intl.formatMessage({ id: 'stripes-authority-components.label.search' })}
              </Button>
            </div>
            <Row between="xs">
              <Col xs={12} lg={6}>
                <Button
                  buttonStyle="none"
                  id="clickable-reset-all"
                  fullWidth
                  disabled={isResetAllButtonDisabled}
                  onClick={() => {
                    resetRows();
                    handleResetAll();
                  }}
                >
                  <Icon icon="times-circle-solid">
                    {intl.formatMessage({ id: 'stripes-smart-components.resetAll' })}
                  </Icon>
                </Button>
              </Col>
              {hasAdvancedSearch && (
                <Col xs={12} lg={6}>
                  {navigationSegmentValue !== navigationSegments.browse && (
                    <Button
                      fullWidth
                      onClick={() => setIsAdvancedSearchOpen(true)}
                    >
                      {intl.formatMessage({ id: 'stripes-components.advancedSearch.button' })}
                    </Button>
                  )}
                </Col>
              )}
            </Row>
          </form>
        </HotKeys>
      )}
    </AdvancedSearch>
  );
};

AuthoritiesSearchForm.propTypes = propTypes;

AuthoritiesSearchForm.defaultProps = {
  hasAdvancedSearch: false,
  onChangeSortOption: noop,
  onShowDetailView: noop,
};

export default AuthoritiesSearchForm;
