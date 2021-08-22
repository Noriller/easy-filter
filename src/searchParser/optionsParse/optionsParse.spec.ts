import { FilterOptions } from '../../shared/shapes';
import { optionsParse } from './optionsParse';

describe('optionsParse', () => {
  describe('without a options keyword', () => {
    const searchWithoutOptions = 'search';
    const emptyParsedOptions: FilterOptions = null;

    it('should return itself and a empty options result', () => {
      expect(optionsParse(searchWithoutOptions)).toEqual({
        search: searchWithoutOptions,
        parsedOptions: emptyParsedOptions,
      });
    });
  });

  describe('without a proper option keyword', () => {
    const searchWithOptionAsValue = 'search with option that isnt a keyword';
    const emptyParsedOptions: FilterOptions = null;

    it('should not falsely use a word as a keyword', () => {
      expect(optionsParse(searchWithOptionAsValue)).toEqual({
        search: searchWithOptionAsValue,
        parsedOptions: emptyParsedOptions,
      });
    });
  });

  describe('with option keyword', () => {
    it('should parse option (singular) keyword', () => {
      const searchWithOptionAsValue = 'search with option(normalize)';
      const searchWithOptionRemoved = 'search with';
      const emptyParsedOptions: FilterOptions = { normalize: true };

      expect(optionsParse(searchWithOptionAsValue)).toEqual({
        search: searchWithOptionRemoved,
        parsedOptions: emptyParsedOptions,
      });
    });

    it('should parse options (plural) keyword', () => {
      const searchWithOptionAsValue = 'search with options(limit)';
      const searchWithOptionRemoved = 'search with';
      const emptyParsedOptions: FilterOptions = { limit: 0 };

      expect(optionsParse(searchWithOptionAsValue)).toEqual({
        search: searchWithOptionRemoved,
        parsedOptions: emptyParsedOptions,
      });
    });

    it('should parse with multiple options keyword', () => {
      const searchWithOptionAsValue =
        'search with options(limit:10) option(normalize index)';
      const searchWithOptionRemoved = 'search with';
      const emptyParsedOptions: FilterOptions = {
        normalize: true,
        indexing: true,
        limit: 10,
      };

      expect(optionsParse(searchWithOptionAsValue)).toEqual({
        search: searchWithOptionRemoved,
        parsedOptions: emptyParsedOptions,
      });
    });
  });

  describe('negative options', () => {
    it('should parse negative options', () => {
      const searchWithOptionAsValue =
        'search with options(normalize:false index:false)';
      const searchWithOptionRemoved = 'search with';
      const emptyParsedOptions: FilterOptions = {
        normalize: false,
        indexing: false,
      };

      expect(optionsParse(searchWithOptionAsValue)).toEqual({
        search: searchWithOptionRemoved,
        parsedOptions: emptyParsedOptions,
      });
    });
  });
});
