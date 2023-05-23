import {
  useState,
  useRef,
  useEffect,
  createContext,
} from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import pick from 'lodash/pick';

import { buildFiltersObj } from '@folio/stripes-acq-components';
import { useAdvancedSearch } from '@folio/stripes/components';

import {
  navigationSegments,
  searchableIndexesValues,
  FILTERS,
  sortOrders,
} from '../constants';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  initialValues: PropTypes.object,
  readParamsFromUrl: PropTypes.bool,
};

const AuthoritiesSearchContext = createContext();

const defaultDropdownValueBySegment = {
  [navigationSegments.search]: searchableIndexesValues.KEYWORD,
  [navigationSegments.browse]: '',
};

const AuthoritiesSearchContextProvider = ({
  children,
  readParamsFromUrl,
  initialValues,
}) => {
  const location = useLocation();
  const filterUrlParams = Object.values(FILTERS);
  const paramsBySegment = useRef({
    [navigationSegments.search]: null,
    [navigationSegments.browse]: null,
  });

  const searchParams = readParamsFromUrl
    ? queryString.parse(location.search)
    : {};

  const initialSegment = searchParams.segment || initialValues.segment || navigationSegments.search;
  const initialValuesBySegment = initialValues[initialSegment];

  const getInitialFilters = () => {
    return initialValuesBySegment?.filters || pick(buildFiltersObj(queryString.stringify(searchParams)), filterUrlParams);
  };


  const initialDropdownValue = searchParams.qindex || initialValuesBySegment?.dropdownValue || defaultDropdownValueBySegment[initialSegment];
  const initialSearchIndex = searchParams.qindex || (initialValuesBySegment?.searchIndex ?? defaultDropdownValueBySegment[initialSegment]);
  const initialSearchInputValue = searchParams.query || initialValuesBySegment?.searchInputValue || '';
  const initialSearchQuery = searchParams.query || initialValuesBySegment?.searchQuery || '';
  const initialOffset = parseInt(searchParams.offset || 0, 10);
  const initialBrowsePageQuery = searchParams.browsePageQuery || '';
  const initialSortOrder = searchParams.sort?.[0] === '-' ? sortOrders.DES : sortOrders.ASC;
  const initialSortedColumn = initialSortOrder === sortOrders.DES ? searchParams.sort?.substring(1) : searchParams.sort || '';
  const initialBrowsePage = parseInt(searchParams.browsePage || 0, 10);

  const [navigationSegmentValue, _setNavigationSegmentValue] = useState(initialSegment); // eslint-disable-line react/hook-use-state
  const [searchInputValue, setSearchInputValue] = useState(initialSearchInputValue);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchDropdownValue, setSearchDropdownValue] = useState(initialDropdownValue);
  const [searchIndex, setSearchIndex] = useState(initialSearchIndex);
  const [filters, setFilters] = useState(getInitialFilters());
  const [offset, setOffset] = useState(initialOffset);
  const [browsePage, setBrowsePage] = useState(initialBrowsePage);
  const [browsePageQuery, setBrowsePageQuery] = useState(initialBrowsePageQuery);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [sortedColumn, setSortedColumn] = useState(initialSortedColumn);

  const [isGoingToBaseURL, setIsGoingToBaseURL] = useState(false);
  const [advancedSearchDefaultSearch, setAdvancedSearchDefaultSearch] = useState({
    query: initialSearchQuery || '',
    option: initialSearchIndex,
  });
  const advancedSearch = useAdvancedSearch({
    defaultSearchOptionValue: searchableIndexesValues.KEYWORD,
    firstRowInitialSearch: advancedSearchDefaultSearch,
  });
  const [advancedSearchRows, setAdvancedSearchRows] = useState(advancedSearch.filledRows);

  useEffect(() => {
    paramsBySegment.current[initialSegment] = {
      searchInputValue: initialSearchInputValue,
      searchQuery: initialSearchQuery,
      searchIndex: initialSearchIndex,
      searchDropdownValue: initialDropdownValue,
      filters: getInitialFilters(),
      advancedSearchRows: [],
    };

    if (initialSegment === navigationSegments.search) {
      paramsBySegment.current[initialSegment].offset = initialOffset;
      paramsBySegment.current[initialSegment].sortOrder = initialSortOrder;
      paramsBySegment.current[initialSegment].sortedColumn = initialSortedColumn;
    } else {
      paramsBySegment.current[initialSegment].browsePageQuery = initialBrowsePageQuery;
      paramsBySegment.current[initialSegment].browsePage = initialBrowsePage;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    paramsBySegment.current[navigationSegmentValue] = {
      searchInputValue: searchQuery,
      searchQuery,
      searchDropdownValue: searchIndex,
      searchIndex,
      filters,
      advancedSearchRows,
    };

    if (navigationSegmentValue === navigationSegments.search) {
      paramsBySegment.current[navigationSegmentValue].offset = offset;
      paramsBySegment.current[navigationSegmentValue].sortOrder = sortOrder;
      paramsBySegment.current[navigationSegmentValue].sortedColumn = sortedColumn;
    } else {
      paramsBySegment.current[navigationSegmentValue].browsePageQuery = browsePageQuery;
      paramsBySegment.current[navigationSegmentValue].browsePage = browsePage;
    }
  }, [
    searchQuery,
    searchIndex,
    filters,
    advancedSearchRows,
    navigationSegmentValue,
    offset,
    browsePageQuery,
    browsePage,
    sortOrder,
    sortedColumn,
  ]);

  const setNavigationSegmentValue = value => {
    const params = paramsBySegment.current[value];

    setSearchDropdownValue((params?.searchDropdownValue ?? initialValues[value]?.dropdownValue) || defaultDropdownValueBySegment[value]);
    setSearchIndex((params?.searchIndex ?? initialValues[value]?.searchIndex) || defaultDropdownValueBySegment[value]);
    setFilters(params?.filters || initialValues[value]?.filters || {});
    setSearchInputValue(params?.searchInputValue || '');
    setSearchQuery(params?.searchQuery || '');
    setIsGoingToBaseURL(true);
    setAdvancedSearchDefaultSearch(null);
    _setNavigationSegmentValue(value);

    if (value === navigationSegments.search) {
      setOffset(params?.offset || 0);
      setSortOrder(params?.sortOrder || sortOrders.ASC);
      setSortedColumn(params?.sortedColumn || '');
    } else {
      setOffset(0);
      setSortOrder(sortOrders.ASC);
      setSortedColumn('');
      setBrowsePageQuery(params?.browsePageQuery || '');
      setBrowsePage(params?.browsePage || 0);
    }
  };

  const resetAll = () => {
    setSearchInputValue('');
    setSearchQuery('');
    setSearchDropdownValue(defaultDropdownValueBySegment[navigationSegmentValue]);
    setSearchIndex(defaultDropdownValueBySegment[navigationSegmentValue]);
    setSortOrder(sortOrders.ASC);
    setSortedColumn('');
    setFilters({});
    setIsGoingToBaseURL(true);
    setAdvancedSearchDefaultSearch(null);
    paramsBySegment.current[navigationSegmentValue] = null;
  };

  const contextValue = {
    searchInputValue,
    setSearchInputValue,
    searchQuery,
    setSearchQuery,
    searchDropdownValue,
    setSearchDropdownValue,
    searchIndex,
    setSearchIndex,
    filters,
    setFilters,
    offset,
    setOffset,
    browsePageQuery,
    setBrowsePageQuery,
    browsePage,
    setBrowsePage,
    sortOrder,
    setSortOrder,
    sortedColumn,
    setSortedColumn,
    navigationSegmentValue,
    setNavigationSegmentValue,
    advancedSearchRows,
    setAdvancedSearchRows,
    resetAll,
    isGoingToBaseURL,
    setIsGoingToBaseURL,
    advancedSearchDefaultSearch,
    setAdvancedSearchDefaultSearch,
  };

  return (
    <AuthoritiesSearchContext.Provider
      value={contextValue}
    >
      {children}
    </AuthoritiesSearchContext.Provider>
  );
};

AuthoritiesSearchContextProvider.propTypes = propTypes;
AuthoritiesSearchContextProvider.defaultProps = {
  initialValues: {},
  readParamsFromUrl: true,
};

export {
  AuthoritiesSearchContext,
  AuthoritiesSearchContextProvider,
};
