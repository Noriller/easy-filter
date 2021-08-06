import { ParsedPart } from 'src/shared/shapes';
import { notParse } from './notParse';

describe('notParse', () => {
  describe('without a not keyword', () => {
    const searchWithoutNot = 'search';
    const emptyParsedNot: ParsedPart[] = null;

    it('should return itself and a empty parsed result', () => {
      expect(notParse(searchWithoutNot)).toEqual({
        search: searchWithoutNot,
        parsedSearch: emptyParsedNot,
      });
    });
  });

  describe('without a proper not keyword', () => {
    const searchWithNotAsValue = 'search with not that isnt a keyword';
    const emptyParsedNot: ParsedPart[] = null;

    it('should not falsely use a word as a keyword', () => {
      expect(notParse(searchWithNotAsValue)).toEqual({
        search: searchWithNotAsValue,
        parsedSearch: emptyParsedNot,
      });
    });
  });

  describe('with single not keyword', () => {
    const searchWithNot = 'search with not()';
    const searchWithoutParsedPart = 'search with';
    const parsedNot: ParsedPart[] = null;

    it('should remove a empty NOT', () => {
      expect(notParse(searchWithNot)).toEqual({
        search: searchWithoutParsedPart,
        parsedSearch: parsedNot,
      });
    });
  });

  describe('with single not keyword', () => {
    const searchWithNot = 'search with not(keyword)';
    const searchWithoutParsedPart = 'search with';
    const parsedNot: ParsedPart[] = [{ payload: 'keyword', mode: 'NOT' }];

    it('should parse a simple NOT keyword', () => {
      expect(notParse(searchWithNot)).toEqual({
        search: searchWithoutParsedPart,
        parsedSearch: parsedNot,
      });
    });

    it('should parse a simple NOT keyword in the middle of the string', () => {
      const searchWithNotInMiddle =
        'search with not(keyword) and something else';
      const searchWithoutParsedPartInMiddle = 'search with and something else';

      expect(notParse(searchWithNotInMiddle)).toEqual({
        search: searchWithoutParsedPartInMiddle,
        parsedSearch: parsedNot,
      });
    });

    describe('with nested brackets', () => {
      it('should parse with simple nested brackets', () => {
        const searchWithNestedBrackets =
          'search with not(tag:(nested bracket))';
        const parsedNotWithNestedBrackets: ParsedPart[] = [
          { payload: 'tag:(nested bracket)', mode: 'NOT' },
        ];

        expect(notParse(searchWithNestedBrackets)).toEqual({
          search: searchWithoutParsedPart,
          parsedSearch: parsedNotWithNestedBrackets,
        });
      });
    });
  });

  describe('with multiples not keywords', () => {
    const searchWithoutParsedPart = 'search with';

    it('should parse multiple NOT keywords', () => {
      const searchWithNot = 'search with not(keyword1) not(keyword2)';
      const parsedNot: ParsedPart[] = [
        { payload: 'keyword1', mode: 'NOT' },
        { payload: 'keyword2', mode: 'NOT' },
      ];

      expect(notParse(searchWithNot)).toEqual({
        search: searchWithoutParsedPart,
        parsedSearch: parsedNot,
      });
    });
  });
});
