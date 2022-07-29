import omit from 'lodash/omit';

export const buildDateRangeQuery = name => values => {
  const [startDateString, endDateString] = values[0]?.split(':') || [];

  if (!startDateString || !endDateString) {
    return '';
  }

  return `(metadata.${name}>="${startDateString}" and metadata.${name}<="${endDateString}")`;
};

export const getSelectedFacets = filterAccordions => {
  return Object.keys(filterAccordions).filter(accordion => filterAccordions[accordion]);
};

export const updateFilters = ({ name, values, setFilters }) => {
  setFilters(currentFilters => {
    return {
      ...currentFilters,
      [name]: values,
    };
  });
};

export const onClearFilter = ({ filter, setFilters }) => {
  setFilters(currentFilters => omit(currentFilters, filter));
};
