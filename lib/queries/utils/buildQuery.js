import { upperFirst } from 'lodash';

import {
  searchableIndexesValues,
  searchableIndexesMap,
  searchResultListColumns,
  FILTERS,
  REFERENCES_VALUES_MAP,
} from '../../constants';

export const formatHeadingsQuery = (indexData, queryTemplate, filters, seeAlsoJoin = 'or') => {
  const isExcludeSeeFrom = filters[FILTERS.REFERENCES]?.includes(REFERENCES_VALUES_MAP.excludeSeeFrom);
  const isExcludeSeeFromAlso = filters[FILTERS.REFERENCES]?.includes(REFERENCES_VALUES_MAP.excludeSeeFromAlso);

  const queryStrings = indexData.map(data => {
    const queryParts = [];

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

  const joinedQueryParts = queryStrings.flat().join(` ${seeAlsoJoin} `);

  return `(${joinedQueryParts})`;
};

const buildQuery = ({
  searchIndex,
  comparator = 'all',
  seeAlsoJoin = 'or',
  filters = {},
  query,
}) => {
  const indexData = searchableIndexesMap[searchIndex];

  if (!indexData) {
    return '';
  }

  if (searchIndex === searchableIndexesValues.KEYWORD) {
    return `(${searchableIndexesValues.KEYWORD} all "%{query}" or naturalId=="%{query}" or identifiers.value=="%{query}")`;
  }

  if (searchIndex === searchableIndexesValues.CHILDREN_SUBJECT_HEADING) {
    const childrenSubjectHeadingData = indexData[0];

    return `((${searchableIndexesValues.KEYWORD} all "%{query}" or naturalId="%{query}" or identifiers.value=="%{query}") and ${childrenSubjectHeadingData.name}=="b")`;
  }

  if (searchIndex === searchableIndexesValues.IDENTIFIER) {
    const authRefType = searchResultListColumns.AUTH_REF_TYPE;

    const queryTemplate = query.endsWith('\\') ? '(%{query})' : '"%{query}"';

    return `((${searchableIndexesValues.IDENTIFIER}==${queryTemplate} or naturalId=${queryTemplate}) and ${authRefType}=="Authorized")`;
  }

  if (searchIndex === searchableIndexesValues.LCCN) {
    return `(lccn="${query.trim()}" or canceledLccn="${query.trim()}")`;
  }

  const queryTemplate = name => `${name} ${comparator} "%{query}"`;

  const headingsQuery = formatHeadingsQuery(indexData, queryTemplate, filters, seeAlsoJoin);

  return headingsQuery;
};

export default buildQuery;
