import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { navigationSegments } from './constants/navigationSegments';

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

export const markHighlightedFields = (marcSource, authority) => {
  const highlightAuthRefFields = {
    'Authorized': /1\d\d/,
    'Reference': /4\d\d/,
    'Auth/Ref': /5\d\d/,
  };

  const marcFields = marcSource.data.parsedRecord.content.fields.map(field => {
    const tag = Object.keys(field)[0];

    const isHighlightedTag = highlightAuthRefFields[authority.data.authRefType].test(tag);

    if (!isHighlightedTag) {
      return field;
    }

    const fieldContent = field[tag].subfields.reduce((contentArr, subfield) => {
      const subfieldValue = Object.values(subfield)[0];

      return [...contentArr, subfieldValue];
    }, []).join(' ');

    const isHeadingRefMatching = fieldContent === authority.data.headingRef;

    return {
      ...field,
      [tag]: {
        ...field[tag],
        isHighlighted: isHeadingRefMatching && isHighlightedTag,
      },
    };
  });
  const marcSourceClone = cloneDeep(marcSource);

  set(marcSourceClone, 'data.parsedRecord.content.fields', marcFields);

  return marcSourceClone;
};

export const autoOpenDetailView = (totalRecords, firstAuthority, navigationSegmentValue) => {
  if (totalRecords !== 1) {
    return false;
  }

  return navigationSegmentValue === navigationSegments.browse
    ? firstAuthority?.isAnchor && firstAuthority?.isExactMatch
    : true;
};
