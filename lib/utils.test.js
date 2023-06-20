import * as utils from './utils';

describe('Given Filters utils', () => {
  describe('getSelectedFacets', () => {
    describe('when there are no selected facets', () => {
      it('should return an empty array', () => {
        const filterAccordions = {
          headingType: false,
          subjectHeadings: false,
        };

        const selectedFacets = utils.getSelectedFacets(filterAccordions);

        expect(selectedFacets.length).toBe(0);
      });
    });

    describe('when there are selected facets', () => {
      it('should return an array of selected facets', () => {
        const filterAccordions = {
          headingType: true,
          subjectHeadings: false,
        };

        const selectedFacets = utils.getSelectedFacets(filterAccordions);

        expect(selectedFacets.length).toBe(1);
        expect(selectedFacets[0]).toBe('headingType');
      });
    });
  });

  describe('updateFilters', () => {
    it('should handle setFilters', () => {
      const name = 'headingType';
      const values = ['Geographic Name'];
      const setFilters = jest.fn()
        .mockImplementation(setter => setter({ headingType: ['Geographic Name'] }));

      utils.updateFilters({ name, values, setFilters });

      expect(setFilters).toHaveBeenCalledTimes(1);
      expect(setFilters.mock.results[0].value).toMatchObject({});
    });
  });

  describe('onClearFilter', () => {
    it('should handle setFilters', () => {
      const filter = 'headingType';
      const setFilters = jest.fn()
        .mockImplementation(setter => setter({ headingType: ['Geographic Name'] }));

      utils.onClearFilter({ filter, setFilters });

      expect(setFilters).toHaveBeenCalledTimes(1);
      expect(setFilters.mock.results[0].value).toMatchObject({});
    });
  });
});

describe('Given markHighlightedFields utils', () => {
  const marcSource = {
    data: {
      parsedRecord: {
        content: {
          fields: [{
            100: {
              subfields: [{
                a: 'heading-ref',
              }],
              ind1: '',
              ind2: '',
            },
          }, {
            110: {
              subfields: [{
                a: 'heading-ref',
              }],
              ind1: '',
              ind2: '',
            },
          }, {
            400: {
              subfields: [{
                a: 'heading-ref',
              }],
              ind1: '',
              ind2: '',
            },
          }, {
            410: {
              subfields: [{
                a: 'heading-ref',
              }],
              ind1: '',
              ind2: '',
            },
          }, {
            500: {
              subfields: [{
                a: 'heading-ref',
              }],
              ind1: '',
              ind2: '',
            },
          }],
        },
      },
      metadata: {
        lastUpdatedDate: '2020-12-04T09:05:30.000+0000',
      },
    },
    isLoading: false,
  };

  const marcSourceT = {
    data: {
      parsedRecord: {
        content: {
          fields: [{
            100: {
              subfields: [{
                a: 'heading-ref',
              }, {
                t: 'title',
              }],
              ind1: '',
              ind2: '',
            },
          }, {
            400: {
              subfields: [{
                a: 'heading-ref',
              }, {
                t: 'title',
              }],
              ind1: '',
              ind2: '',
            },
          }, {
            500: {
              subfields: [{
                a: 'heading-ref',
              }, {
                t: 'title',
              }],
              ind1: '',
              ind2: '',
            },
          }],
        },
      },
      metadata: {
        lastUpdatedDate: '2020-12-04T09:05:30.000+0000',
      },
    },
    isLoading: false,
  };

  const authority = {
    allData: [],
    data: {
      id: 'authority-id',
      headingRef: 'heading-ref',
      authRefType: 'Authorized',
    },
    isLoading: false,
  };

  const authorityMappingRules = {
    100: [{
      description: 'Heading personal Name',
      exclusiveSubfield:['t'],
      subfield: ['a', 'b', 'c', 'd', 'g', 'q'],
      target: 'personalName',
    },
    {
      description: 'Heading personal name title',
      requiredSubfield:['t'],
      subfield: ['a', 'b', 'c', 'd', 'f', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
      target: 'personalNameTitle',
    }],
    400: [{
      description: 'See from tracing personal Name',
      exclusiveSubfield:['t'],
      subfield: ['a', 'b', 'c', 'd', 'g', 'q'],
      target: 'sftPersonalName',
    },
    {
      description: 'See from tracing personal name title',
      requiredSubfield:['t'],
      subfield: ['a', 'b', 'c', 'd', 'f', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
      target: 'sftPersonalNameTitle',
    }],
    500: [{
      description: 'See also from tracing personal Nam',
      exclusiveSubfield:['t'],
      subfield: ['a', 'b', 'c', 'd', 'g', 'q'],
      target: 'saftPersonalName',
    },
    {
      description: 'See also from tracing personal name title',
      requiredSubfield:['t'],
      subfield: ['a', 'b', 'c', 'd', 'f', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
      target: 'sftPersonalNameTitle',
    }],
  };

  beforeEach(() => {
    authority.data.headingRef = 'heading-ref';
    authority.data.authRefType = 'Authorized';
  });

  it('should set isHighlighted 100 tag', () => {
    const marcContent = utils.markHighlightedFields(marcSource, authority, authorityMappingRules);
    const marc100 = Object.values(marcContent.data.parsedRecord.content.fields.filter(x => Object.keys(x)[0] === '100')[0])[0];

    expect(marc100.isHighlighted).toBeTruthy();
  });

  it('should set isHighlighted 110 tag. No mapping rule for 110', () => {
    const marcContent = utils.markHighlightedFields(marcSource, authority, authorityMappingRules);
    const marc110 = Object.values(marcContent.data.parsedRecord.content.fields.filter(x => Object.keys(x)[0] === '110')[0])[0];

    expect(marc110.isHighlighted).toBeTruthy();
  });

  it('should set isHighlighted 100 tag. No mapping rules', () => {
    const marcContent = utils.markHighlightedFields(marcSource, authority, []);
    const marc100 = Object.values(marcContent.data.parsedRecord.content.fields.filter(x => Object.keys(x)[0] === '100')[0])[0];

    expect(marc100.isHighlighted).toBeTruthy();
  });

  it('should set isHighlighted 100 tag with t subfield', () => {
    authority.data.headingRef = 'heading-ref title';

    const marcContent = utils.markHighlightedFields(marcSourceT, authority, authorityMappingRules);
    const marc100 = Object.values(marcContent.data.parsedRecord.content.fields.filter(x => Object.keys(x)[0] === '100')[0])[0];

    expect(marc100.isHighlighted).toBeTruthy();
  });

  it('should not set isHighlighted 100 tag when heading-ref is deferent then marc heading', () => {
    authority.data.headingRef = 'heading-ref title';

    const marcContent = utils.markHighlightedFields(marcSource, authority, authorityMappingRules);
    const marc100 = Object.values(marcContent.data.parsedRecord.content.fields.filter(x => Object.keys(x)[0] === '100')[0])[0];

    expect(marc100.isHighlighted).toBeFalsy();
  });

  it('should not set isHighlighted 100 tag when marc heading is deferent then heading-ref', () => {
    const marcContent = utils.markHighlightedFields(marcSourceT, authority, authorityMappingRules);
    const marc100 = Object.values(marcContent.data.parsedRecord.content.fields.filter(x => Object.keys(x)[0] === '100')[0])[0];

    expect(marc100.isHighlighted).toBeFalsy();
  });

  it('should set isHighlighted 100 tag even marc has subfields that not in mapping rules', () => {
    const marcSourceExtra = {
      data: {
        parsedRecord: {
          content: {
            fields: [{
              100: {
                subfields: [{
                  a: 'heading-ref',
                }, {
                  x: 'x',
                }, {
                  y: 'y',
                }, {
                  8: '8',
                }],
                ind1: '',
                ind2: '',
              },
            }],
          },
        },
        metadata: {
          lastUpdatedDate: '2020-12-04T09:05:30.000+0000',
        },
      },
      isLoading: false,
    };

    const marcContent = utils.markHighlightedFields(marcSourceExtra, authority, authorityMappingRules);
    const marc100 = Object.values(marcContent.data.parsedRecord.content.fields.filter(x => Object.keys(x)[0] === '100')[0])[0];

    expect(marc100.isHighlighted).toBeTruthy();
  });

  it('should set isHightlighted 400 tag when authRefType is Reference', () => {
    authority.data.authRefType = 'Reference';

    const marcContent = utils.markHighlightedFields(marcSource, authority, authorityMappingRules);
    const marc400 = Object.values(marcContent.data.parsedRecord.content.fields.filter(x => Object.keys(x)[0] === '400')[0])[0];

    expect(marc400.isHighlighted).toBeTruthy();
  });

  it('should set isHighlighted 400 tag with t subfield', () => {
    authority.data.authRefType = 'Reference';
    authority.data.headingRef = 'heading-ref title';

    const marcContent = utils.markHighlightedFields(marcSourceT, authority, authorityMappingRules);
    const marc400 = Object.values(marcContent.data.parsedRecord.content.fields.filter(x => Object.keys(x)[0] === '400')[0])[0];

    expect(marc400.isHighlighted).toBeTruthy();
  });

  it('should set isHightlighted 500 tag when authRefType is Auth/Ref', () => {
    authority.data.authRefType = 'Auth/Ref';

    const marcContent = utils.markHighlightedFields(marcSource, authority, authorityMappingRules);
    const marc500 = Object.values(marcContent.data.parsedRecord.content.fields.filter(x => Object.keys(x)[0] === '500')[0])[0];

    expect(marc500.isHighlighted).toBeTruthy();
  });

  it('should set isHighlighted 500 tag with t subfield', () => {
    authority.data.headingRef = 'heading-ref title';
    authority.data.authRefType = 'Auth/Ref';

    const marcContent = utils.markHighlightedFields(marcSourceT, authority, authorityMappingRules);
    const marc500 = Object.values(marcContent.data.parsedRecord.content.fields.filter(x => Object.keys(x)[0] === '500')[0])[0];

    expect(marc500.isHighlighted).toBeTruthy();
  });
});
