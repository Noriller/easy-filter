import { DateFormat, FilterOptions } from '@noriller/easy-filter-parser';
import {
  ParsedPart,
  ParsedRange,
  ParsedTag,
} from '@noriller/easy-filter-parser/types';
import { getTextCrawler } from './objectCrawlers/getTextCrawler';
import { quoteMode } from './modeLogics/quoteMode';
import { orMode } from './modeLogics/orMode';
import { tagMode } from './modeLogics/tagMode';
import { rangeMode } from './modeLogics/rangeMode';
import { dateRangeMode } from './modeLogics/dateRangeMode';
import { parseDate } from '@noriller/easy-filter-parser/utils';
import { notMode, NOT_Exclusion, NOT_Pass } from './modeLogics/notMode';
import { tagNullMode } from './modeLogics/tagNullMode';
import { reduceIndexing } from './indexing/reduceIndexing';

function shouldReturnWrapper({
  object,
  searchTree,
  filterOptions: { dateFormat, indexing = false } = {},
}: {
  object: unknown;
  searchTree: ParsedPart[];
  filterOptions?: FilterOptions;
}): number | boolean {
  if (searchTree.length === 0) return true;

  const stringifiedObject = getTextCrawler(object);

  const results = searchTree.map((search) =>
    shouldReturnRecursion({
      object,
      stringifiedObject,
      searchNode: search,
      dateFormat,
      indexing,
    }),
  );

  if (results.includes('NOT_Exclusion')) return false;
  if (results.length === 1 && results[0] === 'NOT_Pass')
    return indexing ? 1 : true;

  const returnResults = results.filter((val) => {
    if (val === 'NOT_Pass') return false;
    return Boolean(val);
  });

  return indexing
    ? reduceIndexing(<number[]>returnResults)
    : returnResults.length > 0;
}

export function shouldReturnRecursion({
  object,
  stringifiedObject,
  searchNode,
  dateFormat,
  indexing = false,
}: {
  object: unknown;
  stringifiedObject: string;
  searchNode: ParsedPart;
  dateFormat?: DateFormat;
  indexing?: boolean;
}): number | boolean | NOT_Exclusion | NOT_Pass {
  if (searchNode.mode === 'OR')
    return orMode({ stringifiedObject, searchNode, indexing });

  if (searchNode.mode === 'QUOTE')
    return quoteMode({ object, stringifiedObject, searchNode, indexing });

  if (searchNode.mode === 'TAG') {
    return tagMode({
      object,
      searchNode: searchNode as ParsedTag,
      dateFormat,
      indexing,
    });
  }

  if (searchNode.mode === 'TAG_NULL') {
    return tagNullMode({
      object,
      searchNode: searchNode as ParsedTag,
      indexing,
    });
  }

  if (searchNode.mode === 'RANGE')
    return rangeMode({
      object: object as number,
      searchNode: searchNode as ParsedRange,
      indexing,
    });

  if (searchNode.mode === 'DATE_RANGE')
    return dateRangeMode({
      object: new Date(parseDate(<string>object, dateFormat)),
      searchNode: searchNode as ParsedRange,
      indexing,
    });

  if (searchNode.mode === 'NOT')
    return notMode({
      object,
      stringifiedObject,
      searchNode,
      dateFormat,
      indexing,
    });
}

export { shouldReturnWrapper as shouldReturn };
