import {
  createContext,
  useContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { navigationSegments } from '../constants';
import { AuthoritiesSearchContext } from './AuthoritiesSearchContext';

const SelectedAuthorityRecordContext = createContext();

const propTypes = {
  children: PropTypes.node.isRequired,
  readParamsFromUrl: PropTypes.bool,
};

const SelectedAuthorityRecordContextProvider = ({
  children,
  readParamsFromUrl,
}) => {
  const location = useLocation();
  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);
  const [selectedAuthorityForSearch, setSelectedAuthorityForSearch] = useState(null);
  const [selectedAuthorityForBrowse, setSelectedAuthorityForBrowse] = useState(null);

  const isSearchLookup = readParamsFromUrl
    ? queryString.parse(location.search).segment === navigationSegments.search
    : navigationSegmentValue === navigationSegments.search;

  let selectedAuthorityRecordContext;
  let setSelectedAuthorityRecordContext;

  if (isSearchLookup) {
    selectedAuthorityRecordContext = selectedAuthorityForSearch;
    setSelectedAuthorityRecordContext = setSelectedAuthorityForSearch;
  } else {
    selectedAuthorityRecordContext = selectedAuthorityForBrowse;
    setSelectedAuthorityRecordContext = setSelectedAuthorityForBrowse;
  }

  return (
    <SelectedAuthorityRecordContext.Provider value={[selectedAuthorityRecordContext, setSelectedAuthorityRecordContext]}>
      {children}
    </SelectedAuthorityRecordContext.Provider>
  );
};

SelectedAuthorityRecordContextProvider.propTypes = propTypes;
SelectedAuthorityRecordContextProvider.defaultProps = {
  readParamsFromUrl: false,
};

export {
  SelectedAuthorityRecordContext,
  SelectedAuthorityRecordContextProvider,
};
