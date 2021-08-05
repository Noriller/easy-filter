import { dateRangeParse } from './dateRangeParse';

describe('dateRangeParse', () => {
  describe('without a range keyword', () => {
    const searchWithoutRange = 'search';
    const emptyParsedRange = null;

    it('should return itself and a null parsed result', () => {
      expect(dateRangeParse(searchWithoutRange)).toEqual({
        search: searchWithoutRange,
        parsedSearch: emptyParsedRange,
      });
    });
  });

  describe('without a proper range keyword', () => {
    const searchWithRangeAsValue = 'search with range that isnt a keyword';
    const emptyParsedRange = null;

    it('should not falsely use a word as a keyword', () => {
      expect(dateRangeParse(searchWithRangeAsValue)).toEqual({
        search: searchWithRangeAsValue,
        parsedSearch: emptyParsedRange,
      });
    });
  });

  describe('with range keyword', () => {
    it('should parse range keyword', () => {
      const searchWithRangeAsValue =
        'search with daterange(2020-12-30,2021-12-30)';
      const searchWithRangeRemoved = 'search with';
      const emptyParsedRange = [
        {
          mode: 'RANGE',
          payload: [new Date('2020-12-30'), new Date('2021-12-30')],
        },
      ];

      expect(dateRangeParse(searchWithRangeAsValue)).toEqual({
        search: searchWithRangeRemoved,
        parsedSearch: emptyParsedRange,
      });
    });

    it('should parse multiple range keyword', () => {
      const searchWithRangeAsValue =
        'search with daterange(2020-12-30,2021-12-30) daterange(2020-05-30,2021-08-30)';
      const searchWithRangeRemoved = 'search with';
      const emptyParsedRange = [
        {
          mode: 'RANGE',
          payload: [new Date('2020-12-30'), new Date('2021-12-30')],
        },
        {
          mode: 'RANGE',
          payload: [new Date('2020-05-30'), new Date('2021-08-30')],
        },
      ];

      expect(dateRangeParse(searchWithRangeAsValue)).toEqual({
        search: searchWithRangeRemoved,
        parsedSearch: emptyParsedRange,
      });
    });

    it('should ignore more than 2 parameters', () => {
      const searchWithRangeAsValue =
        'search with daterange(2020-12-30,2021-12-30, 2021-01-01, 2021-10-10) daterange(,2021-08-30, 2020-12-30, 2020-10-10)';
      const searchWithRangeRemoved = 'search with';
      const emptyParsedRange = [
        {
          mode: 'RANGE',
          payload: [new Date('2020-12-30'), new Date('2021-12-30')],
        },
        {
          mode: 'RANGE',
          payload: [new Date('0000-01-01'), new Date('2021-08-30')],
        },
      ];

      expect(dateRangeParse(searchWithRangeAsValue)).toEqual({
        search: searchWithRangeRemoved,
        parsedSearch: emptyParsedRange,
      });
    });

    describe('without all the required parameters', () => {
      it('should parse when with only one range parameter', () => {
        const searchWithRangeAsValue = 'search with daterange(2020-12-30)';
        const searchWithRangeRemoved = 'search with';
        const emptyParsedRange = [
          {
            mode: 'RANGE',
            payload: [new Date('2020-12-30'), new Date('10000-01-01')],
          },
        ];

        expect(dateRangeParse(searchWithRangeAsValue)).toEqual({
          search: searchWithRangeRemoved,
          parsedSearch: emptyParsedRange,
        });
      });
      it('should parse when with one empty range parameter', () => {
        const searchWithRangeAsValue = 'search with daterange(,2021-08-30)';
        const searchWithRangeRemoved = 'search with';
        const emptyParsedRange = [
          {
            mode: 'RANGE',
            payload: [new Date('0000-01-01'), new Date('2021-08-30')],
          },
        ];

        expect(dateRangeParse(searchWithRangeAsValue)).toEqual({
          search: searchWithRangeRemoved,
          parsedSearch: emptyParsedRange,
        });
      });
      it('should just remove when without parameters', () => {
        const searchWithRangeAsValue = 'search with daterange()';
        const searchWithRangeRemoved = 'search with';
        const emptyParsedRange = null;

        expect(dateRangeParse(searchWithRangeAsValue)).toEqual({
          search: searchWithRangeRemoved,
          parsedSearch: emptyParsedRange,
        });
      });
    });

    describe('with strings as parameters', () => {
      it('should replace when one string is found', () => {
        const searchWithRangeAsValue = 'search with daterange(2020-12-30,two)';
        const searchWithRangeRemoved = 'search with';
        const emptyParsedRange = [
          {
            mode: 'RANGE',
            payload: [new Date('2020-12-30'), new Date('10000-01-01')],
          },
        ];

        expect(dateRangeParse(searchWithRangeAsValue)).toEqual({
          search: searchWithRangeRemoved,
          parsedSearch: emptyParsedRange,
        });
      });
      it('should remove when only strings are found', () => {
        const searchWithRangeAsValue = 'search with daterange(one, two)';
        const searchWithRangeRemoved = 'search with';
        const emptyParsedRange = null;

        expect(dateRangeParse(searchWithRangeAsValue)).toEqual({
          search: searchWithRangeRemoved,
          parsedSearch: emptyParsedRange,
        });
      });
    });
  });
});
