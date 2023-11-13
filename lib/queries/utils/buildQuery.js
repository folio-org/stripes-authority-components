import { upperFirst } from 'lodash';

import {
  searchableIndexesValues,
  searchableIndexesMap,
  searchResultListColumns,
  FILTERS,
  REFERENCES_VALUES_MAP,
} from '../../constants';

const buildQuery = ({
  searchIndex,
  comparator = '==',
  seeAlsoJoin = 'or',
  filters = {},
  query,
}) => {
  const indexData = searchableIndexesMap[searchIndex];

  const isExcludeSeeFrom = filters[FILTERS.REFERENCES]?.includes(REFERENCES_VALUES_MAP.excludeSeeFrom);
  const isExcludeSeeFromAlso = filters[FILTERS.REFERENCES]?.includes(REFERENCES_VALUES_MAP.excludeSeeFromAlso);

  if (!indexData) {
    return '';
  }

  if (searchIndex === searchableIndexesValues.KEYWORD) {
    return `(${searchableIndexesValues.KEYWORD}=="%{query}" or naturalId="%{query}")`;
  }

  if (searchIndex === searchableIndexesValues.CHILDREN_SUBJECT_HEADING) {
    const childrenSubjectHeadingData = indexData[0];

    return `((${searchableIndexesValues.KEYWORD}=="%{query}" or naturalId="%{query}") and ${childrenSubjectHeadingData.name}=="b")`;
  }

  if (searchIndex === searchableIndexesValues.IDENTIFIER) {
    const authRefType = searchResultListColumns.AUTH_REF_TYPE;

    const queryTemplate = query.endsWith('\\') ? '(%{query})' : '"%{query}"';

    return `((${searchableIndexesValues.IDENTIFIER}==${queryTemplate} or naturalId=${queryTemplate}) and ${authRefType}=="Authorized")`;
  }

  if (searchIndex === searchableIndexesValues.LCCN) {
    const lccn = indexData[0].name;

    return `${lccn}="${query.trim()}"`;
  }

  const queryStrings = indexData.map(data => {
    const queryParts = [];

    const queryTemplate = name => `${name}${comparator}"%{query}"`;

    if (data.plain) {
      queryParts.push(queryTemplate(data.name));
    }

    if ((data.sft || data.saft) && data.plain) {
      const name = upperFirst(data.name);

      if (data.sft && !isExcludeSeeFrom) {
        queryParts.push(queryTemplate(`sft${name}`));
      }

      if (data.saft && !isExcludeSeeFromAlso) {
        queryParts.push(queryTemplate(`saft${name}`));
      }
    }

    if (data.sft && !data.plain && !isExcludeSeeFrom) {
      queryParts.push(queryTemplate(data.name));
    }

    if (data.saft && !data.plain && !isExcludeSeeFromAlso) {
      queryParts.push(queryTemplate(data.name));
    }

    return queryParts;
  });

  const flattenedQueryStrings = queryStrings.reduce((acc, arr) => acc.concat(arr));
  const joinedQueryParts = flattenedQueryStrings.join(` ${seeAlsoJoin} `);

  return `(${joinedQueryParts})`;
};

export default buildQuery;
