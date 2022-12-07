import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import template from 'lodash/template';

import { defaultAdvancedSearchQueryBuilder } from '@folio/stripes/components';

import {
  filterConfig,
  searchableIndexesValues,
} from './constants';
import {
  buildHeadingTypeQuery,
  buildQuery,
} from './queries/utils';

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

const buildRegularSearch = (searchIndex, query, filters) => {
  const compileQuery = template(
    buildQuery({
      searchIndex,
      filters,
      query,
    }),
    { interpolate: /%{([\s\S]+?)}/g },
  );

  const cqlSearch = [];

  if (query) {
    const queryParam = searchIndex === searchableIndexesValues.IDENTIFIER
      ? query
      : query.trim();

    const compiledQuery = compileQuery({ query: queryParam });

    cqlSearch.push(compiledQuery);
  }

  return cqlSearch;
};

const buildAdvancedSearch = (advancedSearch, filters) => {
  const rowFormatter = (index, query, comparator) => {
    const compileQuery = template(
      buildQuery({
        searchIndex: index,
        comparator,
        filters,
        query,
      }),
      { interpolate: /%{([\s\S]+?)}/g },
    );

    return compileQuery({ query });
  };

  return [defaultAdvancedSearchQueryBuilder(advancedSearch, rowFormatter)];
};

export const getCqlQueryForSearchLookup = ({
  isAdvancedSearch,
  advancedSearch,
  filters,
  searchIndex,
  searchQuery = '',
  sortOrder,
  sortedColumn,
}) => {
  let cqlSearch;

  if (isAdvancedSearch) {
    cqlSearch = buildAdvancedSearch(advancedSearch, filters);
  } else {
    cqlSearch = buildRegularSearch(searchIndex, searchQuery, filters);
  }

  const cqlFilters = Object.entries(filters)
    .filter(([, filterValues]) => filterValues.length)
    .map(([filterName, filterValues]) => {
      const filterData = filterConfig.find(filter => filter.name === filterName);

      return filterData.parse(filterValues);
    });

  let cqlQuery = [...cqlSearch, ...cqlFilters].join(' and ');

  if (sortOrder && sortedColumn) {
    cqlQuery += ` sortBy ${sortedColumn}/sort.${sortOrder}`;
  }

  return cqlQuery;
};

export const startingSearchForBrowseLookup = (initialQuery = '') => {
  return [`(headingRef>="${initialQuery}" or headingRef<"${initialQuery}")`];
};

export const getCqlQueryForBrowseLookup = ({
  startingSearch,
  searchIndex,
  filters,
}) => {
  const cqlSearch = startingSearch ? [startingSearch] : [];

  cqlSearch.push(`isTitleHeadingRef==${searchIndex === searchableIndexesValues.NAME_TITLE}`);

  const cqlFilters = Object.entries(filters)
    .filter(([, filterValues]) => filterValues.length)
    .map(([filterName, filterValues]) => {
      const filterData = filterConfig.find(filter => filter.name === filterName);

      return filterData ? filterData.parse(filterValues) : null;
    });

  const headingTypeQuery = buildHeadingTypeQuery(searchIndex);

  return [...cqlSearch, ...cqlFilters, headingTypeQuery].filter(Boolean).join(' and ');
};
