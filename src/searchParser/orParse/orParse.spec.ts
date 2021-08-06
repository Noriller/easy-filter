import { ParsedPart } from 'src/shared/shapes';
import { orParse } from './orParse';

describe('optionsParse', () => {
  it('should return null if parsing empty strings', () => {
    const emptySearch = '';
    expect(orParse(emptySearch)).toEqual(null);
  });

  it('should parse one word', () => {
    const search = 'one';
    const parsedOr: ParsedPart[] = [{ payload: 'one', mode: 'OR' }];
    expect(orParse(search)).toEqual({
      search: null,
      parsedSearch: parsedOr,
    });
  });

  it('should parse multiple words', () => {
    const search = 'one two three';
    const parsedOr: ParsedPart[] = [
      { payload: 'one', mode: 'OR' },
      { payload: 'two', mode: 'OR' },
      { payload: 'three', mode: 'OR' },
    ];
    expect(orParse(search)).toEqual({
      search: null,
      parsedSearch: parsedOr,
    });
  });
});
