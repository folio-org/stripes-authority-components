import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { MultiSelectionFacet } from '../MultiSelectionFacet';
import { useAuthoritySourceFiles } from '../queries';
import { FILTERS } from '../constants';

const propTypes = {
  handleSectionToggle: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValues: PropTypes.array,
  values: PropTypes.array.isRequired,
};

const AuthoritySourceFilter = ({
  open,
  selectedValues,
  onClearFilter,
  values,
  onFilterChange,
  handleSectionToggle,
  isLoading,
}) => {
  const intl = useIntl();
  const { sourceFiles, isLoading: isSourceFilesLoading } = useAuthoritySourceFiles();

  const isPending = isLoading || isSourceFilesLoading;

  const options = useMemo(() => {
    return values.reduce((acc, { id, totalRecords }) => {
      const sourceFile = sourceFiles.find(file => file.id === id);

      if (id === 'NULL') {
        return [...acc, {
          id,
          label: intl.formatMessage({ id: 'stripes-authority-components.search.sourceFileId.nullOption' }),
          totalRecords,
        }];
      }

      return [...acc, {
        id,
        label: sourceFile?.name || id,
        totalRecords,
      }];
    }, []);
  }, [values, sourceFiles, intl]);

  return (
    <MultiSelectionFacet
      id={FILTERS.AUTHORITY_SOURCE}
      label={intl.formatMessage({ id: `stripes-authority-components.search.${FILTERS.AUTHORITY_SOURCE}` })}
      name={FILTERS.AUTHORITY_SOURCE}
      open={open}
      options={options}
      selectedValues={selectedValues}
      onFilterChange={onFilterChange}
      onClearFilter={onClearFilter}
      displayClearButton={!!selectedValues.length}
      handleSectionToggle={handleSectionToggle}
      isPending={isPending}
    />
  );
};

AuthoritySourceFilter.defaultProps = {
  selectedValues: [],
};
AuthoritySourceFilter.propTypes = propTypes;

export default AuthoritySourceFilter;
