import { ParsedPart } from 'src/shared/shapes';
import { optionsParse } from './optionsParse';

describe('optionsParse', () => {
  describe('without a options keyword', () => {
    const searchWithoutOptions = 'search';
    const emptyParsedOptions: ParsedPart[] = null;

    it('should return itself and a empty options result', () => {
      expect(optionsParse(searchWithoutOptions)).toEqual({
        search: searchWithoutOptions,
        parsedSearch: emptyParsedOptions,
      });
    });
  });

  describe('without a proper option keyword', () => {
    const searchWithOptionAsValue = 'search with option that isnt a keyword';
    const emptyParsedOptions: ParsedPart[] = null;

    it('should not falsely use a word as a keyword', () => {
      expect(optionsParse(searchWithOptionAsValue)).toEqual({
        search: searchWithOptionAsValue,
        parsedSearch: emptyParsedOptions,
      });
    });
  });

  describe('with option keyword', () => {
    it('should parse option (singular) keyword', () => {
      const searchWithOptionAsValue = 'search with option(option)';
      const searchWithOptionRemoved = 'search with';
      const emptyParsedOptions: ParsedPart[] = [
        { mode: 'OPTION', payload: 'option' },
      ];

      expect(optionsParse(searchWithOptionAsValue)).toEqual({
        search: searchWithOptionRemoved,
        parsedSearch: emptyParsedOptions,
      });
    });

    it('should parse options (plural) keyword', () => {
      const searchWithOptionAsValue = 'search with options(option)';
      const searchWithOptionRemoved = 'search with';
      const emptyParsedOptions: ParsedPart[] = [
        { mode: 'OPTION', payload: 'option' },
      ];

      expect(optionsParse(searchWithOptionAsValue)).toEqual({
        search: searchWithOptionRemoved,
        parsedSearch: emptyParsedOptions,
      });
    });

    it('should parse with multiple options keyword', () => {
      const searchWithOptionAsValue =
        'search with options(option1) option(option2 option3)';
      const searchWithOptionRemoved = 'search with';
      const emptyParsedOptions: ParsedPart[] = [
        { mode: 'OPTION', payload: 'option1' },
        { mode: 'OPTION', payload: 'option2' },
        { mode: 'OPTION', payload: 'option3' },
      ];

      expect(optionsParse(searchWithOptionAsValue)).toEqual({
        search: searchWithOptionRemoved,
        parsedSearch: emptyParsedOptions,
      });
    });
  });
});
