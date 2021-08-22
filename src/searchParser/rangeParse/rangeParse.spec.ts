import { ParsedRange } from '../../shared/shapes';
import { rangeParse } from './rangeParse';

describe('rangeParse', () => {
  describe('without a range keyword', () => {
    const searchWithoutRange = 'search';
    const emptyParsedRange: ParsedRange[] = null;

    it('should return itself and a null parsed result', () => {
      expect(rangeParse(searchWithoutRange)).toEqual({
        search: searchWithoutRange,
        parsedSearch: emptyParsedRange,
      });
    });
  });

  describe('without a proper range keyword', () => {
    const searchWithRangeAsValue = 'search with range that isnt a keyword';
    const emptyParsedRange: ParsedRange[] = null;

    it('should not falsely use a word as a keyword', () => {
      expect(rangeParse(searchWithRangeAsValue)).toEqual({
        search: searchWithRangeAsValue,
        parsedSearch: emptyParsedRange,
      });
    });
  });

  describe('with range keyword', () => {
    it('should parse range keyword', () => {
      const searchWithRangeAsValue = 'search with range(1,2)';
      const searchWithRangeRemoved = 'search with';
      const emptyParsedRange: ParsedRange[] = [
        { mode: 'RANGE', payload: null, range: [1, 2] },
      ];

      expect(rangeParse(searchWithRangeAsValue)).toEqual({
        search: searchWithRangeRemoved,
        parsedSearch: emptyParsedRange,
      });
    });

    it('should parse multiple range keyword', () => {
      const searchWithRangeAsValue = 'search with range(1,2) range(5,6)';
      const searchWithRangeRemoved = 'search with';
      const emptyParsedRange: ParsedRange[] = [
        { mode: 'RANGE', payload: null, range: [1, 2] },
        { mode: 'RANGE', payload: null, range: [5, 6] },
      ];

      expect(rangeParse(searchWithRangeAsValue)).toEqual({
        search: searchWithRangeRemoved,
        parsedSearch: emptyParsedRange,
      });
    });

    it('should parse a zero number as zero', () => {
      const searchWithRangeAsValue = 'search with range(0,2) range(-2,0)';
      const searchWithRangeRemoved = 'search with';
      const emptyParsedRange: ParsedRange[] = [
        { mode: 'RANGE', payload: null, range: [0, 2] },
        { mode: 'RANGE', payload: null, range: [-2, 0] },
      ];

      expect(rangeParse(searchWithRangeAsValue)).toEqual({
        search: searchWithRangeRemoved,
        parsedSearch: emptyParsedRange,
      });
    });

    it('should ignore more than 2 parameters', () => {
      const searchWithRangeAsValue = 'search with range(1,2,3,4) range(,6,7,8)';
      const searchWithRangeRemoved = 'search with';
      const emptyParsedRange: ParsedRange[] = [
        { mode: 'RANGE', payload: null, range: [1, 2] },
        { mode: 'RANGE', payload: null, range: [-Infinity, 6] },
      ];

      expect(rangeParse(searchWithRangeAsValue)).toEqual({
        search: searchWithRangeRemoved,
        parsedSearch: emptyParsedRange,
      });
    });

    describe('without all the required parameters', () => {
      it('should parse when with only one range parameter', () => {
        const searchWithRangeAsValue = 'search with range(1)';
        const searchWithRangeRemoved = 'search with';
        const emptyParsedRange: ParsedRange[] = [
          { mode: 'RANGE', payload: null, range: [1, Infinity] },
        ];

        expect(rangeParse(searchWithRangeAsValue)).toEqual({
          search: searchWithRangeRemoved,
          parsedSearch: emptyParsedRange,
        });
      });
      it('should parse when with one empty range parameter', () => {
        const searchWithRangeAsValue = 'search with range(,1)';
        const searchWithRangeRemoved = 'search with';
        const emptyParsedRange: ParsedRange[] = [
          { mode: 'RANGE', payload: null, range: [-Infinity, 1] },
        ];

        expect(rangeParse(searchWithRangeAsValue)).toEqual({
          search: searchWithRangeRemoved,
          parsedSearch: emptyParsedRange,
        });
      });
      it('should just remove when without parameters', () => {
        const searchWithRangeAsValue = 'search with range()';
        const searchWithRangeRemoved = 'search with';
        const emptyParsedRange: ParsedRange[] = null;

        expect(rangeParse(searchWithRangeAsValue)).toEqual({
          search: searchWithRangeRemoved,
          parsedSearch: emptyParsedRange,
        });
      });
    });

    describe('with strings as parameters', () => {
      it('should replace when one string is found', () => {
        const searchWithRangeAsValue = 'search with range(1,two)';
        const searchWithRangeRemoved = 'search with';
        const emptyParsedRange: ParsedRange[] = [
          { mode: 'RANGE', payload: null, range: [1, Infinity] },
        ];

        expect(rangeParse(searchWithRangeAsValue)).toEqual({
          search: searchWithRangeRemoved,
          parsedSearch: emptyParsedRange,
        });
      });
      it('should remove when only strings are found', () => {
        const searchWithRangeAsValue = 'search with range(one, two)';
        const searchWithRangeRemoved = 'search with';
        const emptyParsedRange: ParsedRange[] = null;

        expect(rangeParse(searchWithRangeAsValue)).toEqual({
          search: searchWithRangeRemoved,
          parsedSearch: emptyParsedRange,
        });
      });
    });
  });
});
