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
import { tagCrawler } from './objectCrawlers/tagCrawler';
import { tagMode } from './modeLogics/tagMode';
import { rangeMode } from './modeLogics/rangeMode';
import { dateRangeMode } from './modeLogics/dateRangeMode';
import { parseDate } from '../utils/parseDate';
import { notMode } from './modeLogics/notMode';

function shouldReturnWrapper({
  object,
  searchTree,
  dateFormat,
}: {
  object: unknown;
  searchTree: ParsedPart[];
  dateFormat?: DateFormat;
}): boolean | unknown {
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

  return results.length > 0;
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
}): boolean | NOT_Exclusion {
  if (searchNode.mode === 'OR')
    return orMode({ stringifiedObject, searchNode });

  if (searchNode.mode === 'QUOTE')
    return quoteMode({ object, stringifiedObject, searchNode });

  if (searchNode.mode === 'TAG') {
    const objectFromTag = tagCrawler(object, (<ParsedTag>searchNode).tag);
    return tagMode({
      object: objectFromTag,
      stringifiedObject: getTextCrawler(objectFromTag),
      searchNode: searchNode as ParsedTag,
      dateFormat,
    });
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
