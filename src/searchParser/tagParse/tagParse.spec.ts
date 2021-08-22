import { ParsedTag } from '../../shared/shapes';
import { tagParse } from './tagParse';

describe('tagParse', () => {
  describe('without a tag', () => {
    const searchWithoutTag = 'search';
    const emptyParsedTag = null;

    it('should return itself and a empty parsed result', () => {
      expect(tagParse(searchWithoutTag)).toEqual({
        search: searchWithoutTag,
        parsedSearch: emptyParsedTag,
      });
    });
  });

  describe('without a proper tag', () => {
    const searchWithIncompleteTagRemoved = 'search with incomplete';
    const emptyParsedTag = null;

    it('should remove a incomplete tag', () => {
      const searchWithIncompleteTag = 'search with incomplete tag:';
      expect(tagParse(searchWithIncompleteTag)).toEqual({
        search: searchWithIncompleteTagRemoved,
        parsedSearch: emptyParsedTag,
      });
    });

    it('should remove a incomplete tag space only', () => {
      const searchWithIncompleteTag = 'search with tag: incomplete';

      expect(tagParse(searchWithIncompleteTag)).toEqual({
        search: searchWithIncompleteTagRemoved,
        parsedSearch: emptyParsedTag,
      });
    });
  });

  describe('with single tag', () => {
    const searchWithoutParsedPart = 'search with';
    const parsedTag: ParsedTag[] = [
      { payload: 'something', tag: 'tag', mode: 'TAG' },
    ];

    it('should parse a simple tag keyword', () => {
      const searchWithTag = 'search with tag:something';
      expect(tagParse(searchWithTag)).toEqual({
        search: searchWithoutParsedPart,
        parsedSearch: parsedTag,
      });
    });

    it('should parse a simple tag in the middle of the payload', () => {
      const searchWithTagInMiddle =
        'search with tag:something and something else';
      const searchWithoutParsedPartInMiddle = 'search with and something else';

      expect(tagParse(searchWithTagInMiddle)).toEqual({
        search: searchWithoutParsedPartInMiddle,
        parsedSearch: parsedTag,
      });
    });
  });

  describe('with multiples tags', () => {
    const searchWithTag = 'search with tag:keyword1 tag:keyword2';
    const searchWithoutParsedPart = 'search with';
    const parsedTag: ParsedTag[] = [
      { payload: 'keyword1', tag: 'tag', mode: 'TAG' },
      { payload: 'keyword2', tag: 'tag', mode: 'TAG' },
    ];

    it('should parse multiple tags', () => {
      expect(tagParse(searchWithTag)).toEqual({
        search: searchWithoutParsedPart,
        parsedSearch: parsedTag,
      });
    });
  });

  describe('with complex tag values', () => {
    const searchWithoutParsedPart = 'search with';
    it('should parse tag with brackets', () => {
      const searchWithTag = 'search with tag:(keyword1 keyword2)';
      const parsedTag: ParsedTag[] = [
        {
          payload: 'keyword1 keyword2',
          tag: 'tag',
          mode: 'TAG',
        },
      ];

      expect(tagParse(searchWithTag)).toEqual({
        search: searchWithoutParsedPart,
        parsedSearch: parsedTag,
      });
    });
    it('should parse tag with nested brackets', () => {
      const searchWithTag = 'search with tag:(keyword1 range(1,2))';
      const parsedTag: ParsedTag[] = [
        {
          payload: 'keyword1 range(1,2)',
          tag: 'tag',
          mode: 'TAG',
        },
      ];

      expect(tagParse(searchWithTag)).toEqual({
        search: searchWithoutParsedPart,
        parsedSearch: parsedTag,
      });
    });

    it('should parse tag with quotes', () => {
      const searchWithTag = 'search with tag:"keyword1 keyword2"';
      const parsedTag: ParsedTag[] = [
        {
          payload: '"keyword1 keyword2"',
          tag: 'tag',
          mode: 'TAG',
        },
      ];

      expect(tagParse(searchWithTag)).toEqual({
        search: searchWithoutParsedPart,
        parsedSearch: parsedTag,
      });
    });
  });

  describe('with ranges', () => {
    it('should parse tag with range in quotes', () => {
      const searchWithTag = 'search with tag:"range(1,2)"';
      const searchWithoutParsedPart = 'search with';
      const parsedTag: ParsedTag[] = [
        {
          payload: '"range(1,2)"',
          tag: 'tag',
          mode: 'TAG',
        },
      ];

      expect(tagParse(searchWithTag)).toEqual({
        search: searchWithoutParsedPart,
        parsedSearch: parsedTag,
      });
    });

    it('should parse tag with range alone', () => {
      const searchWithTag = 'search with tag:range(1,2)';
      const searchWithoutParsedPart = 'search with';
      const parsedTag: ParsedTag[] = [
        {
          payload: 'range(1,2)',
          tag: 'tag',
          mode: 'TAG',
        },
      ];

      expect(tagParse(searchWithTag)).toEqual({
        search: searchWithoutParsedPart,
        parsedSearch: parsedTag,
      });
    });
  });

  describe('null value in tag', () => {
    it('should parse tag for null values', () => {
      const searchWithTag = 'search with tag:NULL';
      const searchWithoutParsedPart = 'search with';
      const parsedTag: ParsedTag[] = [
        {
          payload: 'NULL',
          tag: 'tag',
          mode: 'TAG_NULL',
        },
      ];

      expect(tagParse(searchWithTag)).toEqual({
        search: searchWithoutParsedPart,
        parsedSearch: parsedTag,
      });
    });
  });
});
