import { ParsedPart } from 'src/shared/shapes';
import { tagParse } from './tagParse';

describe('tagParse', () => {
  describe('without a tag', () => {
    const searchWithoutTag = 'search';
    const emptyParsedTag = [];

    it('should return itself and a empty parsed result', () => {
      expect(tagParse(searchWithoutTag)).toEqual([
        searchWithoutTag,
        emptyParsedTag,
      ]);
    });
  });

  describe('without a proper tag', () => {
    const searchWithIncompleteTagRemoved = 'search with incomplete';
    const emptyParsedTag = [];

    it('should remove a incomplete tag', () => {
      const searchWithIncompleteTag = 'search with incomplete tag:';
      expect(tagParse(searchWithIncompleteTag)).toEqual([
        searchWithIncompleteTagRemoved,
        emptyParsedTag,
      ]);
    });

    it('should remove a incomplete tag space only', () => {
      const searchWithIncompleteTag = 'search with tag: incomplete';

      expect(tagParse(searchWithIncompleteTag)).toEqual([
        searchWithIncompleteTagRemoved,
        emptyParsedTag,
      ]);
    });
  });

  describe('with single tag', () => {
    const searchWithoutParsedPart = 'search with';
    const parsedTag: ParsedPart[] = [{ string: 'tag:something', mode: 'TAG' }];

    it('should parse a simple tag keyword', () => {
      const searchWithTag = 'search with tag:something';
      expect(tagParse(searchWithTag)).toEqual([
        searchWithoutParsedPart,
        parsedTag,
      ]);
    });

    it('should parse a simple tag in the middle of the string', () => {
      const searchWithTagInMiddle =
        'search with tag:something and something else';
      const searchWithoutParsedPartInMiddle = 'search with and something else';

      expect(tagParse(searchWithTagInMiddle)).toEqual([
        searchWithoutParsedPartInMiddle,
        parsedTag,
      ]);
    });
  });

  describe('with multiples tags', () => {
    const searchWithTag = 'search with tag:keyword1 tag:keyword2';
    const searchWithoutParsedPart = 'search with';
    const parsedTag: ParsedPart[] = [
      { string: 'tag:keyword1', mode: 'TAG' },
      { string: 'tag:keyword2', mode: 'TAG' },
    ];

    it('should parse multiple tags', () => {
      expect(tagParse(searchWithTag)).toEqual([
        searchWithoutParsedPart,
        parsedTag,
      ]);
    });
  });

  describe('with complex tag values', () => {
    const searchWithoutParsedPart = 'search with';
    it('should parse tag with brackets', () => {
      const searchWithTag = 'search with tag:(keyword1 keyword2)';
      const parsedTag: ParsedPart[] = [
        { string: 'tag:(keyword1 keyword2)', mode: 'TAG' },
      ];

      expect(tagParse(searchWithTag)).toEqual([
        searchWithoutParsedPart,
        parsedTag,
      ]);
    });

    it('should parse tag with quotes', () => {
      const searchWithTag = 'search with tag:"keyword1 keyword2"';
      const parsedTag: ParsedPart[] = [
        { string: 'tag:"keyword1 keyword2"', mode: 'TAG' },
      ];

      expect(tagParse(searchWithTag)).toEqual([
        searchWithoutParsedPart,
        parsedTag,
      ]);
    });
  });
});
