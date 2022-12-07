import { REFERENCES_VALUES_MAP } from '../references';
import {
  filterConfig,
  FILTERS,
} from './filterConfig';

describe('filterConfig', () => {
  describe('createdDate filter', () => {
    it('should call buildDateRangeQuery', () => {
      const values = ['2022-11-01:2022-12-07'];
      const result = '(metadata.createdDate>="2022-11-01" and metadata.createdDate<="2022-12-07")';

      const filter = filterConfig.find(config => config.name === 'createdDate');

      expect(filter.parse(values)).toEqual(result);
    });
  });

  describe('updatedDate filter', () => {
    it('should call buildDateRangeQuery', () => {
      const values = ['2022-11-01:2022-12-07'];
      const result = '(metadata.updatedDate>="2022-11-01" and metadata.updatedDate<="2022-12-07")';

      const filter = filterConfig.find(config => config.name === 'updatedDate');

      expect(filter.parse(values)).toEqual(result);
    });
  });

  describe('headingType filter', () => {
    it('should return correct search string', () => {
      const filter = filterConfig.find(config => config.name === 'headingType');

      const searchString = filter.parse(['val1', 'val2']);

      expect(searchString).toEqual('(headingType==("val1" or "val2"))');
    });
  });

  describe('references filter', () => {
    it('should return correct search string when \'excludeSeeFrom\' is selected', () => {
      const filter = filterConfig.find(config => config.name === FILTERS.REFERENCES);

      const searchString = filter.parse([REFERENCES_VALUES_MAP.excludeSeeFrom]);

      expect(searchString).toEqual('(authRefType==("Authorized" or "Auth/Ref"))');
    });

    it('should return correct search string when \'excludeSeeFromAlso\' is selected', () => {
      const filter = filterConfig.find(config => config.name === FILTERS.REFERENCES);

      const searchString = filter.parse([REFERENCES_VALUES_MAP.excludeSeeFromAlso]);

      expect(searchString).toEqual('(authRefType==("Authorized" or "Reference"))');
    });

    it('should return correct search string when both \'excludeSeeFrom\' and \'excludeSeeFromAlso\' are selected', () => {
      const filter = filterConfig.find(config => config.name === FILTERS.REFERENCES);

      const searchString = filter.parse([
        REFERENCES_VALUES_MAP.excludeSeeFrom,
        REFERENCES_VALUES_MAP.excludeSeeFromAlso,
      ]);

      expect(searchString).toEqual('(authRefType==("Authorized"))');
    });
  });

  describe('subjectHeadings filter', () => {
    it('should return correct search string', () => {
      const filter = filterConfig.find(config => config.name === 'subjectHeadings');

      const searchString = filter.parse(['val1', 'val2']);

      expect(searchString).toEqual('(subjectHeadings==("val1" or "val2"))');
    });
  });
});
