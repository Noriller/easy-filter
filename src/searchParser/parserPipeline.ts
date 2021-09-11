import {
  AllTypes,
  FilterOptions,
  ParsedPart,
  ParsedResult,
} from '../shared/shapes';
import { dateRangeParse } from './dateRangeParse/dateRangeParse';
import { notParse } from './notParse/notParse';
import { orParse } from './orParse/orParse';
import { quotesParse } from './quotesParse/quotesParse';
import { rangeParse } from './rangeParse/rangeParse';
import { tagParse } from './tagParse/tagParse';

/**
 * This is the actual core of the parser.
 *
 * With everything set, this will, with each step, take from the string and return a "smaller" string.
 */
export function parserPipeline({
  search,
  type = 'INITIAL',
  filterOptions = null,
  insideTag = false,
}: {
  search: string;
  type?: AllTypes;
  filterOptions?: FilterOptions;
  insideTag?: boolean;
}): ParsedPart[] {
  // This is the recursion exit condition.
  // New types that should not have children, should be added here.
  if (
    type === 'OR' ||
    type === 'RANGE' ||
    type === 'DATE_RANGE' ||
    type === 'OPTION'
  )
    return null;

  const parsedArray: ParsedPart[] = [];
  let searchString: string = search;

  // As of now, the hierarchy (what is parsed first) is:
  // * not() -> but only in the first pass.
  // * quotes -> "" / ''
  // * tags -> tag:value / tag:"quoted" / tag:(multiple values)
  // * range/dateRange -> range(x,y) -> only inside tags -> no children
  // * values (or) -> no children

  searchString = parserWrapper({
    searchString,
    parser: notParse,
    shouldParse: type === 'INITIAL',
    parsedArray,
  });

  searchString = parserWrapper({
    searchString,
    parser: quotesParse,
    parsedArray,
  });

  searchString = parserWrapper({
    searchString,
    parser: tagParse,
    parsedArray,
  });

  searchString = parserWrapper({
    searchString,
    parser: rangeParse,
    shouldParse: insideTag || type === 'TAG',
    parsedArray,
  });

  searchString = parserWrapper({
    searchString,
    parser: dateRangeParse(
      filterOptions?.dateFormatSearch || filterOptions?.dateFormat,
    ),
    shouldParse: insideTag || type === 'TAG',
    parsedArray,
  });

  parserWrapper({
    searchString,
    parser: orParse,
    parsedArray,
  });

  return parsedArray.map((object) => {
    object.childs = parserPipeline({
      search: object.payload,
      type: object.mode,
      filterOptions,
      insideTag: insideTag || object.mode === 'TAG',
    });
    return object;
  });
}

/**
 * Helper function to make it easier to read the pipeline.
 *
 * Skips when without string or on condition.
 *
 * Uses the provided parser, push the parsedResults to the tree and return the string after parsing.
 */
function parserWrapper({
  searchString,
  parser,
  shouldParse = true,
  parsedArray,
}: {
  searchString: string;
  parser: (search: string) => ParsedResult;
  shouldParse?: boolean;
  parsedArray: ParsedPart[];
}) {
  if (!shouldParse || !searchString) return searchString;

  const { search, parsedSearch } = parser(searchString);
  if (parsedSearch) parsedArray.push(...parsedSearch);
  return search;
}
