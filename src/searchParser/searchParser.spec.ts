import { searchParser } from './searchParser';

describe('searchParser', () => {
  it('should parse an empty string', () => {
    const result = searchParser('');
    expect(result).toEqual({
      options: [],
      searchTree: [],
    });
  });

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

  it('should parse with range inside quotes', () => {
    const result = searchParser(
      'something tag:"dateRange(2020-05-12,2021-05-12)"',
    );
    expect(result).toEqual({
      options: [],
      searchTree: [
        {
          childs: [
            {
              childs: [
                {
                  childs: null,
                  mode: 'RANGE',
                  payload: null,
                  range: [new Date('2020-05-12'), new Date('2021-05-12')],
                },
              ],
              mode: 'QUOTE',
              payload: 'dateRange(2020-05-12,2021-05-12)',
            },
          ],
          mode: 'TAG',
          payload: '"dateRange(2020-05-12,2021-05-12)"',
          tag: 'tag',
        },
        { childs: null, mode: 'OR', payload: 'something' },
      ],
    });
  });

  it('should parse with range alone', () => {
    const result = searchParser('something tag:range(1,2)');
    expect(result).toEqual({
      options: [],
      searchTree: [
        {
          payload: 'range(1,2)',
          tag: 'tag',
          mode: 'TAG',
          childs: [
            {
              payload: null,
              range: [1, 2],
              mode: 'RANGE',
              childs: null,
            },
          ],
        },
        {
          payload: 'something',
          mode: 'OR',
          childs: null,
        },
      ],
    });
  });

  it('should not parse range alone', () => {
    const result = searchParser('something range(1,2)');
    expect(result).toEqual({
      options: [],
      searchTree: [
        {
          payload: 'something',
          mode: 'OR',
          childs: null,
        },
        {
          payload: 'range(1,2)',
          mode: 'OR',
          childs: null,
        },
      ],
    });
  });
});
