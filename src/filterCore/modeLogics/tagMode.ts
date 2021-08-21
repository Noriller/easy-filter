import { DateFormat, ParsedTag } from 'src/shared/shapes';
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
  const objectFromTag = tagCrawler(object, searchNode.tag);
  const stringifiedObject = getTextCrawler(objectFromTag);

  const modeResult = <number[]>searchNode.childs
    .map((c) =>
      shouldReturnRecursion({
        object: objectFromTag,
        stringifiedObject,
        searchNode: c,
        dateFormat,
      }),
    )
    .filter((x) => x);
  return indexing
    ? reduceIndexing(modeResult, TAG_MULTIPLIER)
    : modeResult.length > 0;
}
