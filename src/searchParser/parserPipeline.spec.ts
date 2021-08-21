import { ParsedPart } from 'src/shared/shapes';
import { parserPipeline } from './parserPipeline';

describe('parserPipeline', () => {
  it('should parse a empty string', () => {
    const searchString = ``;
    const result: ParsedPart[] = parserPipeline({ search: searchString });
    expect(result).toEqual([]);
  });

  it('should parse one word', () => {
    const searchString = `word`;
    const result: ParsedPart[] = parserPipeline({ search: searchString });
    expect(result).toEqual([{ payload: 'word', mode: 'OR', childs: null }]);
  });

  it('should parse multiple words', () => {
    const searchString = `word one two three`;
    const result: ParsedPart[] = parserPipeline({ search: searchString });
    expect(result).toEqual([
      { payload: 'word', mode: 'OR', childs: null },
      { payload: 'one', mode: 'OR', childs: null },
      { payload: 'two', mode: 'OR', childs: null },
      { payload: 'three', mode: 'OR', childs: null },
    ]);
  });

  it('should parse string with tags', () => {
    const searchString = `tag1:(tagValue1 tagValue2) tag2:"tag value in double quotes" tag3:'tag value in single quotes' tag4:value tag5:(with nested (brackets))`;
    const result: ParsedPart[] = parserPipeline({ search: searchString });
    expect(result).toEqual([
      {
        payload: 'tagValue1 tagValue2',
        tag: 'tag1',
        mode: 'TAG',
        childs: [
          { payload: 'tagValue1', mode: 'OR', childs: null },
          { payload: 'tagValue2', mode: 'OR', childs: null },
        ],
      },
      {
        payload: '"tag value in double quotes"',
        tag: 'tag2',
        mode: 'TAG',
        childs: [
          {
            payload: 'tag value in double quotes',
            mode: 'QUOTE',
            childs: [
              { payload: 'tag', mode: 'OR', childs: null },
              { payload: 'value', mode: 'OR', childs: null },
              { payload: 'in', mode: 'OR', childs: null },
              { payload: 'double', mode: 'OR', childs: null },
              { payload: 'quotes', mode: 'OR', childs: null },
            ],
          },
        ],
      },
      {
        payload: "'tag value in single quotes'",
        tag: 'tag3',
        mode: 'TAG',
        childs: [
          {
            payload: 'tag value in single quotes',
            mode: 'QUOTE',
            childs: [
              { payload: 'tag', mode: 'OR', childs: null },
              { payload: 'value', mode: 'OR', childs: null },
              { payload: 'in', mode: 'OR', childs: null },
              { payload: 'single', mode: 'OR', childs: null },
              { payload: 'quotes', mode: 'OR', childs: null },
            ],
          },
        ],
      },
      {
        payload: 'value',
        tag: 'tag4',
        mode: 'TAG',
        childs: [{ payload: 'value', mode: 'OR', childs: null }],
      },
      {
        payload: 'with nested (brackets)',
        tag: 'tag5',
        mode: 'TAG',
        childs: [
          { payload: 'with', mode: 'OR', childs: null },
          { payload: 'nested', mode: 'OR', childs: null },
          { payload: '(brackets)', mode: 'OR', childs: null },
        ],
      },
    ]);
  });

  it('should parse tags with ranges', () => {
    const searchString = `tag:(range(1,2) dateRange(2020-12-30,2021-12-30))`;
    const result: ParsedPart[] = parserPipeline({ search: searchString });
    expect(result).toEqual([
      {
        payload: 'range(1,2) dateRange(2020-12-30,2021-12-30)',
        tag: 'tag',
        mode: 'TAG',
        childs: [
          { payload: null, range: [1, 2], mode: 'RANGE', childs: null },
          {
            payload: null,
            range: [new Date('2020-12-30'), new Date('2021-12-30')],
            mode: 'DATE_RANGE',
            childs: null,
          },
        ],
      },
    ]);
  });

  it('should parse tags with date ranges and custom date format', () => {
    const searchString = `tag:(range(1,2) dateRange(30-12-2020, 30-12-2021))`;
    const result: ParsedPart[] = parserPipeline({
      search: searchString,
      filterOptions: { dateFormat: 'DD-MM-YYYY' },
    });
    expect(result).toEqual([
      {
        payload: 'range(1,2) dateRange(30-12-2020, 30-12-2021)',
        tag: 'tag',
        mode: 'TAG',
        childs: [
          { payload: null, range: [1, 2], mode: 'RANGE', childs: null },
          {
            payload: null,
            range: [new Date('2020-12-30'), new Date('2021-12-30')],
            mode: 'DATE_RANGE',
            childs: null,
          },
        ],
      },
    ]);
  });

  it('should parse string with quotes', () => {
    const searchString = `"value in quotes 'with subquotes'"`;
    const result: ParsedPart[] = parserPipeline({ search: searchString });
    expect(result).toEqual([
      {
        payload: "value in quotes 'with subquotes'",
        mode: 'QUOTE',
        childs: [
          {
            payload: 'with subquotes',
            mode: 'QUOTE',
            childs: [
              { payload: 'with', mode: 'OR', childs: null },
              { payload: 'subquotes', mode: 'OR', childs: null },
            ],
          },
          { payload: 'value', mode: 'OR', childs: null },
          { payload: 'in', mode: 'OR', childs: null },
          { payload: 'quotes', mode: 'OR', childs: null },
        ],
      },
    ]);
  });

  it('should parse a not string', () => {
    const searchString = `not(value "quotes" tag:(nested and range(1,2)))`;
    const result: ParsedPart[] = parserPipeline({ search: searchString });
    expect(result).toEqual([
      {
        payload: 'value "quotes" tag:(nested and range(1,2))',
        mode: 'NOT',
        childs: [
          {
            payload: 'quotes',
            mode: 'QUOTE',
            childs: [{ payload: 'quotes', mode: 'OR', childs: null }],
          },
          {
            payload: 'nested and range(1,2)',
            tag: 'tag',
            mode: 'TAG',
            childs: [
              { payload: null, range: [1, 2], mode: 'RANGE', childs: null },
              { payload: 'nested', mode: 'OR', childs: null },
              { payload: 'and', mode: 'OR', childs: null },
            ],
          },
          { payload: 'value', mode: 'OR', childs: null },
        ],
      },
    ]);
  });
});
