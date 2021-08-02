import { optionsParse } from './optionsParse';

describe('notParse', () => {
  describe('without a options keyword', () => {
    const searchWithoutOptions = 'search';
    const emptyParsedOptions = { mode: 'OPTION', string: '' };

    it('should return itself and a empty options result', () => {
      expect(optionsParse(searchWithoutOptions)).toEqual([
        searchWithoutOptions,
        emptyParsedOptions,
      ]);
    });
  });

  describe('without a proper option keyword', () => {
    const searchWithOptionAsValue = 'search with option that isnt a keyword';
    const emptyParsedOptions = { mode: 'OPTION', string: '' };

    it('should not falsely use a word as a keyword', () => {
      expect(optionsParse(searchWithOptionAsValue)).toEqual([
        searchWithOptionAsValue,
        emptyParsedOptions,
      ]);
    });
  });

  describe('with option keyword', () => {
    it('should parse option (singular) keyword', () => {
      const searchWithOptionAsValue = 'search with option(option)';
      const searchWithOptionRemoved = 'search with';
      const emptyParsedOptions = { mode: 'OPTION', string: 'option' };

      expect(optionsParse(searchWithOptionAsValue)).toEqual([
        searchWithOptionRemoved,
        emptyParsedOptions,
      ]);
    });

    it('should parse options (plural) keyword', () => {
      const searchWithOptionAsValue = 'search with options(option)';
      const searchWithOptionRemoved = 'search with';
      const emptyParsedOptions = { mode: 'OPTION', string: 'option' };

      expect(optionsParse(searchWithOptionAsValue)).toEqual([
        searchWithOptionRemoved,
        emptyParsedOptions,
      ]);
    });

    it('should parse with multiple options keyword', () => {
      const searchWithOptionAsValue =
        'search with options(option1) option(option2 option3)';
      const searchWithOptionRemoved = 'search with';
      const emptyParsedOptions = {
        mode: 'OPTION',
        string: 'option1 option2 option3',
      };

      expect(optionsParse(searchWithOptionAsValue)).toEqual([
        searchWithOptionRemoved,
        emptyParsedOptions,
      ]);
    });
  });
});
