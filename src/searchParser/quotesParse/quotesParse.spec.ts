import { ParsedPart } from 'src/shared/shapes';
import { quotesParse } from './quotesParse';

describe('quotesParse', () => {
  describe('without a quote', () => {
    const searchWithoutQuote = 'search';
    const emptyParsedQuote = [];

    it('should return itself and a empty parsed result', () => {
      expect(quotesParse(searchWithoutQuote)).toEqual([
        searchWithoutQuote,
        emptyParsedQuote,
      ]);
    });
  });

  describe('with a single quote', () => {
    const searchWithQuoteRemoved = 'search';
    const parsedQuote = [{ mode: 'QUOTE', string: 'with quote' }];

    it('should parse with a double quote', () => {
      const searchWithQuote = 'search "with quote"';
      expect(quotesParse(searchWithQuote)).toEqual([
        searchWithQuoteRemoved,
        parsedQuote,
      ]);
    });

    it('should parse with a single quote', () => {
      const searchWithQuote = "search 'with quote'";
      expect(quotesParse(searchWithQuote)).toEqual([
        searchWithQuoteRemoved,
        parsedQuote,
      ]);
    });
  });

  describe('with multiple quotes', () => {
    const searchWithQuote = `search "with quote" 'and another quote'`;
    const searchWithQuoteRemoved = 'search';
    const parsedQuote = [
      { mode: 'QUOTE', string: 'with quote' },
      { mode: 'QUOTE', string: 'and another quote' },
    ];

    it('should parse multiple quotes', () => {
      expect(quotesParse(searchWithQuote)).toEqual([
        searchWithQuoteRemoved,
        parsedQuote,
      ]);
    });
  });

  describe('with mismatched quotes', () => {
    const searchWithMismatchedQuote = `search 'with quote"`;
    const parsedQuote = [];

    it('should not parse mismatched quotes', () => {
      expect(quotesParse(searchWithMismatchedQuote)).toEqual([
        searchWithMismatchedQuote,
        parsedQuote,
      ]);
    });
  });

  describe('with strings having tags and quotes', () => {
    it('should parse only the quote not in a tag', () => {
      const searchWithTagAndQuote = `search tag:"with quote" tag:(bracket 'and quote') "and another quote"`;
      const searchAfterParsing = `search tag:"with quote" tag:(bracket 'and quote')`;
      const parsedQuote = [{ mode: 'QUOTE', string: 'and another quote' }];
      expect(quotesParse(searchWithTagAndQuote)).toEqual([
        searchAfterParsing,
        parsedQuote,
      ]);
    });

    it('should parse the quote with a tag that has quotes', () => {
      const searchWithTagAndQuote = `search "tag:'with quote' tag:(bracket 'and quote')"`;
      const searchAfterParsing = `search`;
      const parsedQuote = [
        { mode: 'QUOTE', string: "tag:'with quote' tag:(bracket 'and quote')" },
      ];
      expect(quotesParse(searchWithTagAndQuote)).toEqual([
        searchAfterParsing,
        parsedQuote,
      ]);
    });
  });
});
