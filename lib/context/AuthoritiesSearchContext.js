import {
  useState,
  createContext,
} from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import pick from 'lodash/pick';

import { buildFiltersObj } from '@folio/stripes-acq-components';

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

  const searchParams = readParamsFromUrl
    ? queryString.parse(location.search)
    : {};

  const getInitialFilters = () => {
    return initialValues.filters || pick(buildFiltersObj(queryString.stringify(searchParams)), filterUrlParams);
  };

  const initialSegment = searchParams.segment || navigationSegments.search;

  const initialDropdownValue = searchParams.qindex || initialValues.dropdownValue || defaultDropdownValueBySegment[initialSegment];
  const initialSearchIndex = searchParams.qindex || (initialValues.searchIndex ?? defaultDropdownValueBySegment[initialSegment]);

  const [navigationSegmentValue, _setNavigationSegmentValue] = useState(initialSegment); // eslint-disable-line react/hook-use-state
  const [searchInputValue, setSearchInputValue] = useState(searchParams.query || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.query || '');
  const [searchDropdownValue, setSearchDropdownValue] = useState(initialDropdownValue);
  const [searchIndex, setSearchIndex] = useState(initialSearchIndex);
  const [filters, setFilters] = useState(getInitialFilters());
  const [advancedSearchRows, setAdvancedSearchRows] = useState([]);
  const [isGoingToBaseURL, setIsGoingToBaseURL] = useState(false);
  const [advancedSearchDefaultSearch, setAdvancedSearchDefaultSearch] = useState({
    query: searchParams.query || '',
    option: searchParams.qindex,
  });

  const setNavigationSegmentValue = value => {
    setSearchDropdownValue(initialValues.dropdownValue || defaultDropdownValueBySegment[value]);
    setSearchIndex(initialValues.searchIndex ?? defaultDropdownValueBySegment[value]);
    setFilters(initialValues.filters || {});
    setSearchInputValue('');
    setSearchQuery('');
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
