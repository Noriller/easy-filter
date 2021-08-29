import { searchParser } from './searchParser';

describe('searchParser', () => {
  it('should parse an empty string', () => {
    const result = searchParser('');
    expect(result).toEqual({
      options: {},
      searchTree: [],
    });
  });

  it('should parse string without options', () => {
    const result = searchParser('something');
    expect(result).toEqual({
      options: {},
      searchTree: [{ payload: 'something', mode: 'OR', childs: null }],
    });
  });

  it('should parse string with options', () => {
    const result = searchParser('something options(normalize limit:50)');
    expect(result).toEqual({
      options: { limit: 50, normalize: true },
      searchTree: [{ payload: 'something', mode: 'OR', childs: null }],
    });
  });

  it('should parse with range inside quotes', () => {
    const result = searchParser(
      'something tag:"dateRange(2020-05-12,2021-05-12)"',
    );
    expect(result).toEqual({
      options: {},
      searchTree: [
        {
          childs: [
            {
              childs: [
                {
                  childs: null,
                  mode: 'DATE_RANGE',
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

  it('should parse the date range with the custom date format', () => {
    const searchString = `something tag:(dateRange(01-05-2020, 02-05-2021))`;
    const result = searchParser(searchString, { dateFormat: 'DD-MM-YYYY' });
    expect(result).toEqual({
      options: { dateFormat: 'DD-MM-YYYY' },
      searchTree: [
        {
          childs: [
            {
              childs: null,
              mode: 'DATE_RANGE',
              payload: null,
              range: [new Date('2020-05-01'), new Date('2021-05-02')],
            },
          ],
          mode: 'TAG',
          payload: 'dateRange(01-05-2020, 02-05-2021)',
          tag: 'tag',
        },
        { childs: null, mode: 'OR', payload: 'something' },
      ],
    });
  });

  it('should parse the date range overriding the custom date format', () => {
    const searchString = `something tag:(dateRange(01-05-2020, 02-05-2021)) option(dateformat:MM-DD-YYYY)`;
    const result = searchParser(searchString, { dateFormat: 'DD-MM-YYYY' });
    expect(result).toEqual({
      options: { dateFormat: 'DD-MM-YYYY', dateFormatSearch: 'MM-DD-YYYY' },
      searchTree: [
        {
          childs: [
            {
              childs: null,
              mode: 'DATE_RANGE',
              payload: null,
              range: [new Date('2020-01-05'), new Date('2021-02-05')],
            },
          ],
          mode: 'TAG',
          payload: 'dateRange(01-05-2020, 02-05-2021)',
          tag: 'tag',
        },
        { childs: null, mode: 'OR', payload: 'something' },
      ],
    });
  });

  it('should parse with range alone', () => {
    const result = searchParser('something tag:range(1,2)');
    expect(result).toEqual({
      options: {},
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
      options: {},
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
