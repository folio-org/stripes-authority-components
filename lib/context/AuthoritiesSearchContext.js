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



  const [navigationSegmentValue, _setNavigationSegmentValue] = useState(initialSegment); // eslint-disable-line react/hook-use-state
  const [searchInputValue, setSearchInputValue] = useState(initialSearchInputValue);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchDropdownValue, setSearchDropdownValue] = useState(initialDropdownValue);
  const [searchIndex, setSearchIndex] = useState(initialSearchIndex);
  const [filters, setFilters] = useState(getInitialFilters());
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
  }, [
    searchQuery,
    searchIndex,
    filters,
    advancedSearchRows,
    navigationSegmentValue,
  ]);

  const setNavigationSegmentValue = value => {
    const params = paramsBySegment.current[value];

    setSearchDropdownValue(params?.searchDropdownValue || initialValues[value]?.dropdownValue || defaultDropdownValueBySegment[value]);
    setSearchIndex(params?.searchIndex || initialValues[value]?.searchIndex || defaultDropdownValueBySegment[value]);
    setFilters(params?.filters || initialValues[value]?.filters || {});
    setSearchInputValue(params?.searchInputValue || '');
    setSearchQuery(params?.searchQuery || '');
    setIsGoingToBaseURL(true);
    setAdvancedSearchDefaultSearch(null);
    _setNavigationSegmentValue(value);
  };

  const resetAll = () => {
    setSearchInputValue('');
    setSearchQuery('');
    setSearchDropdownValue(defaultDropdownValueBySegment[navigationSegmentValue]);
    setSearchIndex(defaultDropdownValueBySegment[navigationSegmentValue]);
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
