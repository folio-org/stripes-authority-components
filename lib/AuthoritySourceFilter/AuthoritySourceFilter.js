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
  options: PropTypes.array.isRequired,
  selectedValues: PropTypes.array,
  tenantId: PropTypes.string,
};

const AuthoritySourceFilter = ({
  open,
  selectedValues,
  onClearFilter,
  options,
  onFilterChange,
  handleSectionToggle,
  isLoading,
  tenantId,
}) => {
  const intl = useIntl();
  const { sourceFiles, isLoading: isSourceFilesLoading } = useAuthoritySourceFiles({ tenantId });

  const isPending = isLoading || isSourceFilesLoading;

  const getSourceFileLabel = id => {
    return id === 'NULL'
      ? intl.formatMessage({ id: 'stripes-authority-components.search.sourceFileId.nullOption' })
      : sourceFiles.find(file => file.id === id)?.name || id;
  };

  const formatMissingOption = value => ({
    value,
    label: getSourceFileLabel(value),
    totalRecords: 0,
  });

  const formattedOptions = useMemo(() => {
    return options.reduce((acc, { id, totalRecords }) => {
      const sourceFile = sourceFiles.find(file => file.id === id);

      if (id === 'NULL') {
        return [...acc, {
          id,
          label: getSourceFileLabel(id),
          totalRecords,
        }];
      }

      return [...acc, {
        id,
        label: sourceFile?.name || id,
        totalRecords,
      }];
    }, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, sourceFiles, intl]);

  return (
    <MultiSelectionFacet
      id={FILTERS.AUTHORITY_SOURCE}
      label={intl.formatMessage({ id: `stripes-authority-components.search.${FILTERS.AUTHORITY_SOURCE}` })}
      name={FILTERS.AUTHORITY_SOURCE}
      open={open}
      options={formattedOptions}
      selectedValues={selectedValues}
      formatMissingOption={formatMissingOption}
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
  tenantId: null,
};
AuthoritySourceFilter.propTypes = propTypes;

export default AuthoritySourceFilter;
