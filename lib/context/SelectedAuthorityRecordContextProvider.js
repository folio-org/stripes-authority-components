import {
  createContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import { navigationSegments } from '../constants';

const SelectedAuthorityRecordContext = createContext();

const propTypes = {
  children: PropTypes.node.isRequired,
};

const SelectedAuthorityRecordContextProvider = ({ children }) => {
  const [selectedAuthorityForSearch, setSelectedAuthorityForSearch] = useState(null);
  const [selectedAuthorityForBrowse, setSelectedAuthorityForBrowse] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  let selectedAuthorityRecordContext;
  let setSelectedAuthorityRecordContext;

  if (searchParams.get('segment') === navigationSegments.search) {
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

export {
  SelectedAuthorityRecordContext,
  SelectedAuthorityRecordContextProvider,
};
