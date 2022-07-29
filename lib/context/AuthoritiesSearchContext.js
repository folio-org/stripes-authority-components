import {
  useState,
  createContext,
} from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import pick from 'lodash/pick';

import { buildFiltersObj } from '@folio/stripes-acq-components';

import { useDidUpdate } from '../hooks';
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
  readParamsFromUrl: PropTypes.bool,
};

const AuthoritiesSearchContext = createContext();

const AuthoritiesSearchContextProvider = ({
  children,
  readParamsFromUrl,
}) => {
  const location = useLocation();
  const filterUrlParams = Object.values(FILTERS);

  const searchParams = readParamsFromUrl
    ? queryString.parse(location.search)
    : {};

  const getInitialFilters = () => {
    return pick(buildFiltersObj(queryString.stringify(searchParams)), filterUrlParams);
  };

  const initialSegment = searchParams.segment || navigationSegments.search;

  const initialDropdownValue = initialSegment === navigationSegments.browse
    ? searchParams.qindex || ''
    : searchParams.qindex || searchableIndexesValues.KEYWORD;

  const [navigationSegmentValue, setNavigationSegmentValue] = useState(initialSegment);
  const [searchInputValue, setSearchInputValue] = useState(searchParams.query || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.query || '');
  const [searchDropdownValue, setSearchDropdownValue] = useState(initialDropdownValue);
  const [searchIndex, setSearchIndex] = useState(initialDropdownValue);
  const [filters, setFilters] = useState(getInitialFilters());
  const [advancedSearchRows, setAdvancedSearchRows] = useState([]);
  const [isGoingToBaseURL, setIsGoingToBaseURL] = useState(false);
  const [advancedSearchDefaultSearch, setAdvancedSearchDefaultSearch] = useState({
    query: searchParams.query,
    option: searchParams.qindex,
  });

  const resetAll = () => {
    const dropdownValue = initialSegment === navigationSegments.browse
      ? ''
      : searchableIndexesValues.KEYWORD;

    setSearchInputValue('');
    setSearchQuery('');
    setSearchDropdownValue(dropdownValue);
    setSearchIndex(dropdownValue);
    setFilters({});
    setIsGoingToBaseURL(true);
    setAdvancedSearchDefaultSearch(null);
  };

  useDidUpdate(() => {
    resetAll();
  }, [navigationSegmentValue]);

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
  readParamsFromUrl: true,
};

export {
  AuthoritiesSearchContext,
  AuthoritiesSearchContextProvider,
};
