import buildQuery from './buildQuery';
import {
  FILTERS,
  REFERENCES_VALUES_MAP,
  searchableIndexesValues,
} from '../../constants';

describe('Given buildQuery', () => {
  describe('when index with plain, sft, and saft prefixes provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.PERSONAL_NAME,
        query: 'somevalue',
      });

      expect(query).toBe('(personalName all "%{query}" or sftPersonalName all "%{query}" or saftPersonalName all "%{query}")');
    });
  });

  describe('when non-existent index provided', () => {
    it('should return an empty string', () => {
      const query = buildQuery({
        searchIndex: 'testIndex',
        query: 'somevalue',
      });

      expect(query).toBe('');
    });
  });

  describe('when index with different names for plain, sft, and saft prefixes provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.GEOGRAPHIC_NAME,
        query: 'somevalue',
      });

      expect(query).toBe('(geographicName all "%{query}" or sftGeographicName all "%{query}" or saftGeographicName all "%{query}")');
    });
  });

  describe('when keyword index provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.KEYWORD,
        query: 'somevalue',
      });

      expect(query).toBe('(keyword all "%{query}" or naturalId=="%{query}" or identifiers.value=="%{query}")');
    });
  });

  describe('when identifier index provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.IDENTIFIER,
        query: 'somevalue',
      });

      expect(query).toBe('((identifiers.value=="%{query}" or naturalId="%{query}") and authRefType=="Authorized")');
    });

    describe('when isExcludedSeeFromLimiter is true', () => {
      it('should return correct query', () => {
        const query = buildQuery({
          searchIndex: searchableIndexesValues.IDENTIFIER,
          isExcludedSeeFromLimiter: true,
          query: 'somevalue',
        });

        expect(query).toBe('((identifiers.value=="%{query}" or naturalId="%{query}") and authRefType=="Authorized")');
      });
    });
  });

  describe('when identifier with forward slash is provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.IDENTIFIER,
        query: 'somevalue/',
      });

      expect(query).toBe('((identifiers.value=="%{query}" or naturalId="%{query}") and authRefType=="Authorized")');
    });
  });

  describe('when identifier with backward slash is provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.IDENTIFIER,
        query: 'somevalue\\',
      });

      expect(query).toBe('((identifiers.value==(%{query}) or naturalId=(%{query})) and authRefType=="Authorized")');
    });
  });

  describe('when LCCN index is provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.LCCN,
        query: ' n  88173836 ',
      });

      expect(query).toBe('lccn="n  88173836"');
    });
  });

  describe('when childrenSubjectHeading index provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: 'childrenSubjectHeading',
        query: 'somevalue',
      });

      expect(query).toBe('((keyword all "%{query}" or naturalId="%{query}") and subjectHeadings=="b")');
    });
  });

  describe('when \'reference filter\' values are provided', () => {
    it('should return correct query when \'excludeSeeFrom\' is selected', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.PERSONAL_NAME,
        filters: {
          [FILTERS.REFERENCES]: [REFERENCES_VALUES_MAP.excludeSeeFrom],
        },
        query: 'somevalue',
      });

      expect(query).toEqual('(personalName all "%{query}" or saftPersonalName all "%{query}")');
    });

    it('should return correct query when \'excludeSeeFromAlso\' is selected', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.PERSONAL_NAME,
        filters: {
          [FILTERS.REFERENCES]: [REFERENCES_VALUES_MAP.excludeSeeFromAlso],
        },
        query: 'somevalue',
      });

      expect(query).toEqual('(personalName all "%{query}" or sftPersonalName all "%{query}")');
    });

    it('should return correct query when both \'excludeSeeFromAlso\' and \'excludeSeeFromAlso\' are selected', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.PERSONAL_NAME,
        filters: {
          [FILTERS.REFERENCES]: [
            REFERENCES_VALUES_MAP.excludeSeeFrom,
            REFERENCES_VALUES_MAP.excludeSeeFromAlso,
          ],
        },
        query: 'somevalue',
      });

      expect(query).toEqual('(personalName all "%{query}")');
    });
  });
});
