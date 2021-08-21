import {
  DateFormat,
  NOT_Exclusion,
  ParsedPart,
  ParsedRange,
  ParsedTag,
} from '../shared/shapes';
import { getTextCrawler } from './objectCrawlers/getTextCrawler';
import { quoteMode } from './modeLogics/quoteMode';
import { orMode } from './modeLogics/orMode';
import { tagMode } from './modeLogics/tagMode';
import { rangeMode } from './modeLogics/rangeMode';
import { dateRangeMode } from './modeLogics/dateRangeMode';
import { parseDate } from '../utils/parseDate';
import { notMode } from './modeLogics/notMode';
import { tagNullMode } from './modeLogics/tagNullMode';
import { reduceIndexing } from './indexing/reduceIndexing';

function shouldReturnWrapper({
  object,
  searchTree,
  dateFormat,
}: {
  object: unknown;
  searchTree: ParsedPart[];
  dateFormat?: DateFormat;
}): number | boolean {
  if (searchTree.length === 0) return true;

  const stringifiedObject = getTextCrawler(object);

  const results = searchTree
    .map((search) =>
      shouldReturnRecursion({
        object,
        stringifiedObject,
        searchNode: search,
        dateFormat,
      }),
    )
    .flat(Infinity)
    .filter((x) => x);

  if (results.includes('NOT_Exclusion')) return false;

  return reduceIndexing(<number[]>results);
}

export function shouldReturnRecursion({
  object,
  stringifiedObject,
  searchNode,
  dateFormat,
}: {
  object: unknown;
  stringifiedObject: string;
  searchNode: ParsedPart;
  dateFormat?: DateFormat;
}): number | NOT_Exclusion {
  if (searchNode.mode === 'OR')
    return orMode({ stringifiedObject, searchNode });

  if (searchNode.mode === 'QUOTE')
    return quoteMode({ object, stringifiedObject, searchNode });

  if (searchNode.mode === 'TAG') {
    return tagMode({
      object,
      searchNode: searchNode as ParsedTag,
      dateFormat,
    });
  }

  if (searchNode.mode === 'TAG_NULL') {
    return tagNullMode({ object, searchNode: searchNode as ParsedTag });
  }

  if (searchNode.mode === 'RANGE')
    return rangeMode({
      object: object as number,
      searchNode: searchNode as ParsedRange,
    });

  if (searchNode.mode === 'DATE_RANGE')
    return dateRangeMode({
      object: new Date(parseDate(<string>object, dateFormat)),
      searchNode: searchNode as ParsedRange,
    });

  if (searchNode.mode === 'NOT')
    return notMode({
      object,
      stringifiedObject,
      searchNode,
      dateFormat,
    });
}

export { shouldReturnWrapper as shouldReturn };