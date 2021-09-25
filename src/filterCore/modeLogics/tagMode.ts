import { ParsedTag } from '@noriller/easy-filter-parser/types';
import { DateFormat } from '@noriller/easy-filter-parser';
import { getTextCrawler } from '../objectCrawlers/getTextCrawler';
import { tagCrawler } from '../objectCrawlers/tagCrawler';
import { shouldReturnRecursion } from '../shouldReturn';
import { reduceIndexing } from '../indexing/reduceIndexing';
import { TAG_MULTIPLIER } from '../indexing/indexingConstants';

export function tagMode({
  object,
  searchNode,
  dateFormat,
  indexing,
}: {
  object: unknown;
  searchNode: ParsedTag;
  dateFormat?: DateFormat;
  indexing: boolean;
}): number | boolean {
  const objectFromTag = tagCrawler(object, searchNode.tag, searchNode.aliases);
  const stringifiedObject = getTextCrawler(objectFromTag);

  const modeResult = <number[]>searchNode.childs
    .map((c) =>
      shouldReturnRecursion({
        object: objectFromTag.length === 1 ? objectFromTag[0] : objectFromTag,
        stringifiedObject,
        searchNode: c,
        dateFormat,
        indexing,
      }),
    )
    .filter(Boolean);
  return indexing
    ? reduceIndexing(modeResult, TAG_MULTIPLIER)
    : modeResult.length > 0;
}
