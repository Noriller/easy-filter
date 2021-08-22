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
 * ! hierarchy:
 * * not()
 * * quotes -> "" / ''
 * * tags -> tag:value / tag:"quoted" / tag:(multiple values)
 * * range/dateRange -> range(x,y) -> only inside tags -> no OR
 * * values (or)
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
  if (
    type === 'OR' ||
    type === 'RANGE' ||
    type === 'DATE_RANGE' ||
    type === 'OPTION'
  )
    return null;

  const parsedArray: ParsedPart[] = [];
  let searchString: string = search;

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
    parser: dateRangeParse(filterOptions?.dateFormat),
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
