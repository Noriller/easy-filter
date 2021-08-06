import { orParse } from './orParse';

describe('optionsParse', () => {
  it('should return null if parsing empty strings', () => {
    const emptySearch = '';
    expect(orParse(emptySearch)).toEqual(null);
  });

  it('should parse one word', () => {
    const search = 'one';
    expect(orParse(search)).toEqual({
      search: null,
      parsedSearch: [{ payload: 'one', mode: 'OR' }],
    });
  });

  it('should parse multiple words', () => {
    const search = 'one two three';
    expect(orParse(search)).toEqual({
      search: null,
      parsedSearch: [
        { payload: 'one', mode: 'OR' },
        { payload: 'two', mode: 'OR' },
        { payload: 'three', mode: 'OR' },
      ],
    });
  });
});
