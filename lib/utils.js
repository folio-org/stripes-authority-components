import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

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

export const markHighlightedFields = (marcSource, authority, authorityMappingRules = []) => {
  const highlightAuthRefFields = {
    'Authorized': /1\d\d/,
    'Reference': /4\d\d/,
    'Auth/Ref': /5\d\d/,
  };

  const getFieldMapping = field => {
    const tag = Object.keys(field)[0];
    const fieldMappingRules = authorityMappingRules[tag] || [];
    const subfields = field[tag].subfields;

    if (!fieldMappingRules.length) {
      return fieldMappingRules;
    }

    let properFieldMappingRules = [];

    fieldMappingRules.forEach(mappingRule => {
      const exclusiveSubfield = mappingRule?.exclusiveSubfield || [];
      const requiredSubfield = mappingRule?.requiredSubfield || [];

      if (exclusiveSubfield.length > 0) {
        if (subfields.filter(x => !exclusiveSubfield.includes(Object.keys(x)[0])).length === subfields.length) {
          properFieldMappingRules = mappingRule;
        }
      }

      if (requiredSubfield.length > 0) {
        if (subfields.filter(x => requiredSubfield.includes(Object.keys(x)[0])).length === requiredSubfield.length) {
          properFieldMappingRules = mappingRule;
        }
      }
    });

    return properFieldMappingRules;
  };

  const marcFields = marcSource.data.parsedRecord?.content.fields.map(field => {
    const tag = Object.keys(field)[0];

    const isHighlightedTag = highlightAuthRefFields[authority.data.authRefType].test(tag);

    if (!isHighlightedTag) {
      return field;
    }

    const fieldMapping = getFieldMapping(field);

    const fieldContent = field[tag].subfields.reduce((contentArr, subfield) => {
      const subfieldCode = Object.keys(subfield)[0];
      const subfieldValue = Object.values(subfield)[0];

      if (fieldMapping.length === 0) {
        return [...contentArr, subfieldValue];
      }

      if (Object.values(fieldMapping.subfield).includes(subfieldCode)) {
        return [...contentArr, subfieldValue];
      }
      return [...contentArr];
    }, []).join(' ');

    const isHeadingRefMatching = fieldContent === authority.data.headingRef;

    return {
      ...field,
      [tag]: {
        ...field[tag],
        isHighlighted: isHeadingRefMatching && isHighlightedTag,
      },
    };
  }) || [];
  const marcSourceClone = cloneDeep(marcSource);

  set(marcSourceClone, 'data.parsedRecord.content.fields', marcFields);

  return marcSourceClone;
};
