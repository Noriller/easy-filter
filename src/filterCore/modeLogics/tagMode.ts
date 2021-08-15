import { DateFormat, ParsedTag } from 'src/shared/shapes';
import { getTextCrawler } from '../objectCrawlers/getTextCrawler';
import { tagCrawler } from '../objectCrawlers/tagCrawler';
import { shouldReturnRecursion } from '../shouldReturn';

export function tagMode({
  object,
  searchNode,
  dateFormat,
}: {
  object: unknown;
  searchNode: ParsedTag;
  dateFormat?: DateFormat;
}) {
  const objectFromTag = tagCrawler(object, searchNode.tag);
  const stringifiedObject = getTextCrawler(objectFromTag);

  return (
    searchNode.childs
      .map((c) =>
        shouldReturnRecursion({
          object: objectFromTag,
          stringifiedObject,
          searchNode: c,
          dateFormat,
        }),
      )
      .filter((x) => x).length > 0
  );
}
