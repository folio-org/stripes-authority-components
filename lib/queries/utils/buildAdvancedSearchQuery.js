import { ADVANCED_SEARCH_MATCH_OPTIONS } from '@folio/stripes/components';

import { searchableIndexesMap, searchableIndexesValues } from '../../constants';
import { formatHeadingsQuery } from './buildQuery';

const {
  EXACT_PHRASE,
  CONTAINS_ALL,
  STARTS_WITH,
  CONTAINS_ANY,
} = ADVANCED_SEARCH_MATCH_OPTIONS;

export const buildAdvancedSearchQuery = ({ searchOption, match, query, filters }) => {
  const indexData = searchableIndexesMap[searchOption];

  const fullTextQueryTemplate = name => {
    const queryPartMap = {
      [EXACT_PHRASE]: '=="%{query}"',
      [CONTAINS_ALL]: ' all "%{query}"',
      [STARTS_WITH]: ' all "%{query}*"',
      [CONTAINS_ANY]: ' any "%{query}"',
    };

    return `${name}${queryPartMap[match]}`;
  };

  const templates = {
    [searchableIndexesValues.KEYWORD]: {
      [EXACT_PHRASE]: '(keyword=="%{query}" or naturalId="%{query}")',
      [CONTAINS_ALL]: '(keyword all "%{query}" or naturalId=="*%{query}*" or identifiers.value=="*%{query}*")',
      [STARTS_WITH]: '(keyword all "%{query}*" or naturalId="%{query}*")',
      [CONTAINS_ANY]: '(keyword any "%{query}" or naturalId="*%{query}*")',
    },
    [searchableIndexesValues.IDENTIFIER]: () => {
      const exactPhraseQueryTemplate = query.endsWith('\\') ? '(%{query})' : '"%{query}"';
      const containsAllQueryTemplate = query.endsWith('\\') ? '(*%{query}*)' : '"*%{query}*"';
      const startsWithQueryTemplate = query.endsWith('\\') ? '(%{query}*)' : '"%{query}*"';
      const containsAnyQueryTemplate = query.endsWith('\\') ? '(*%{query}*)' : '"*%{query}*"';

      const identifierTemplates = {
        [EXACT_PHRASE]: `((identifiers.value==${exactPhraseQueryTemplate} or naturalId=${exactPhraseQueryTemplate}) and authRefType=="Authorized")`,
        [CONTAINS_ALL]: `((identifiers.value=${containsAllQueryTemplate} or naturalId=${containsAllQueryTemplate}) and authRefType=="Authorized")`,
        [STARTS_WITH]: `((identifiers.value=${startsWithQueryTemplate} or naturalId=${startsWithQueryTemplate}) and authRefType=="Authorized")`,
        [CONTAINS_ANY]: `((identifiers.value any ${containsAnyQueryTemplate} or naturalId any ${containsAnyQueryTemplate}) and authRefType=="Authorized")`,
      };

      return identifierTemplates[match];
    },
    [searchableIndexesValues.LCCN]: {
      [EXACT_PHRASE]: 'lccn=="%{query}"',
      [CONTAINS_ALL]: 'lccn="*%{query}*"',
      [STARTS_WITH]: 'lccn="%{query}*"',
      [CONTAINS_ANY]: 'lccn any "*%{query}*"',
    },
    [searchableIndexesValues.PERSONAL_NAME]: () => formatHeadingsQuery(indexData, fullTextQueryTemplate, filters),
    [searchableIndexesValues.CORPORATE_CONFERENCE_NAME]: () => formatHeadingsQuery(indexData, fullTextQueryTemplate, filters),
    [searchableIndexesValues.GEOGRAPHIC_NAME]: () => formatHeadingsQuery(indexData, fullTextQueryTemplate, filters),
    [searchableIndexesValues.NAME_TITLE]: () => formatHeadingsQuery(indexData, fullTextQueryTemplate, filters),
    [searchableIndexesValues.UNIFORM_TITLE]: () => formatHeadingsQuery(indexData, fullTextQueryTemplate, filters),
    [searchableIndexesValues.SUBJECT]: () => formatHeadingsQuery(indexData, fullTextQueryTemplate, filters),
    [searchableIndexesValues.CHILDREN_SUBJECT_HEADING]: {
      [EXACT_PHRASE]: '((keyword=="%{query}" or naturalId="%{query}") and subjectHeadings=="b")',
      [CONTAINS_ALL]: '((keyword all "%{query}" or naturalId="%{query}" or identifiers.value=="%{query}") and subjectHeadings=="b")',
      [STARTS_WITH]: '((keyword all "%{query}*" or naturalId="%{query}*") and subjectHeadings=="b")',
      [CONTAINS_ANY]: '((keyword any "%{query}" or naturalId any "*%{query}*") and subjectHeadings=="b")',
    },
    [searchableIndexesValues.GENRE]: () => formatHeadingsQuery(indexData, fullTextQueryTemplate, filters),
  };

  return typeof templates[searchOption] === 'function'
    ? templates[searchOption]()
    : templates[searchOption]?.[match];
};
