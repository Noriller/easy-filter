import { searchParser } from './searchParser';

describe('searchParser', () => {
  it('should parse string without options', () => {
    const result = searchParser('something');
    expect(result).toEqual({
      options: [],
      searchTree: [{ payload: 'something', mode: 'OR', childs: null }],
    });
  });
  it('should parse string with options', () => {
    const result = searchParser('something options(option1 option2)');
    expect(result).toEqual({
      options: ['option1', 'option2'],
      searchTree: [{ payload: 'something', mode: 'OR', childs: null }],
    });
  });
});
