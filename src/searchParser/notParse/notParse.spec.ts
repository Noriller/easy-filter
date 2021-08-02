import { ParsedPart } from 'src/shared/shapes';
import { notParse } from './notParse';

describe('notParse', () => {
  describe('without a not keyword', () => {
    const searchWithoutNot = 'search';
    const emptyParsedNot = [];

    it('should return itself and a empty parsed result', () => {
      expect(notParse(searchWithoutNot)).toEqual([
        searchWithoutNot,
        emptyParsedNot,
      ]);
    });
  });

  describe('without a proper not keyword', () => {
    const searchWithNotAsValue = 'search with not that isnt a keyword';
    const emptyParsedNot = [];

    it('should not falsely use a word as a keyword', () => {
      expect(notParse(searchWithNotAsValue)).toEqual([
        searchWithNotAsValue,
        emptyParsedNot,
      ]);
    });
  });

  describe('with single not keyword', () => {
    const searchWithNot = 'search with not(keyword)';
    const searchWithoutParsedPart = 'search with';
    const parsedNot: ParsedPart[] = [{ string: 'keyword', mode: 'NOT' }];

    it('should parse a simple NOT keyword', () => {
      expect(notParse(searchWithNot)).toEqual([
        searchWithoutParsedPart,
        parsedNot,
      ]);
    });

    it('should parse a simple NOT keyword in the middle of the string', () => {
      const searchWithNotInMiddle =
        'search with not(keyword) and something else';
      const searchWithoutParsedPartInMiddle = 'search with and something else';

      expect(notParse(searchWithNotInMiddle)).toEqual([
        searchWithoutParsedPartInMiddle,
        parsedNot,
      ]);
    });

    describe('with nested brackets', () => {
      it('should parse with simple nested brackets', () => {
        const searchWithNestedBrackets =
          'search with not(tag:(nested bracket))';
        const parsedNotWithNestedBrackets: ParsedPart[] = [
          { string: 'tag:(nested bracket)', mode: 'NOT' },
        ];

        expect(notParse(searchWithNestedBrackets)).toEqual([
          searchWithoutParsedPart,
          parsedNotWithNestedBrackets,
        ]);
      });
    });
  });

  describe('with multiples not keywords', () => {
    const searchWithNot = 'search with not(keyword1) not(keyword2)';
    const searchWithoutParsedPart = 'search with';
    const parsedNot: ParsedPart[] = [
      { string: 'keyword1', mode: 'NOT' },
      { string: 'keyword2', mode: 'NOT' },
    ];

    it('should parse multiple NOT keywords', () => {
      expect(notParse(searchWithNot)).toEqual([
        searchWithoutParsedPart,
        parsedNot,
      ]);
    });
  });
});
