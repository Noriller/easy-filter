import {
  FilterOptions,
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

function shouldReturnWrapper({
  object,
  searchTree,
  filterOptions,
}: {
  object: unknown;
  searchTree: ParsedPart[];
  filterOptions?: FilterOptions;
}): boolean | unknown {
  if (searchTree.length === 0) return true;

  const stringifiedObject = getTextCrawler(object);

  const results = searchTree
    .map((search) =>
      shouldReturnRecursion({
        object,
        stringifiedObject,
        searchNode: search,
        filterOptions,
      }),
    )
    .flat(Infinity)
    .filter((x) => x);

  if (results.includes('NOT_Exclusion')) return false;

  return results.length > 0;
}

export function shouldReturnRecursion({
  object,
  stringifiedObject,
  searchNode,
  filterOptions,
}: {
  object: unknown;
  stringifiedObject: string;
  searchNode: ParsedPart;
  filterOptions?: FilterOptions;
}): boolean | NOT_Exclusion {
  if (searchNode.mode === 'OR')
    return orMode({ stringifiedObject, searchNode, filterOptions });

  if (searchNode.mode === 'QUOTE')
    return quoteMode({ object, stringifiedObject, searchNode, filterOptions });

  if (searchNode.mode === 'TAG') {
    return tagMode({
      object,
      searchNode: searchNode as ParsedTag,
      filterOptions,
    });
  }

  if (searchNode.mode === 'TAG_NULL') {
    return tagNullMode({
      object,
      searchNode: searchNode as ParsedTag,
      filterOptions,
    });
  }

  if (searchNode.mode === 'RANGE')
    return rangeMode({
      object: object as number,
      searchNode: searchNode as ParsedRange,
      filterOptions,
    });

  if (searchNode.mode === 'DATE_RANGE')
    return dateRangeMode({
      object: new Date(parseDate(<string>object, filterOptions?.dateFormat)),
      searchNode: searchNode as ParsedRange,
      filterOptions,
    });

  if (searchNode.mode === 'NOT')
    return notMode({
      object,
      stringifiedObject,
      searchNode,
      filterOptions,
    });
}

export { shouldReturnWrapper as shouldReturn };
