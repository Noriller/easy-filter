import { FilterOptions, ParsedTag } from 'src/shared/shapes';
import { getTextCrawler } from '../objectCrawlers/getTextCrawler';
import { tagCrawler } from '../objectCrawlers/tagCrawler';
import { shouldReturnRecursion } from '../shouldReturn';

export function tagMode({
  object,
  searchNode,
  filterOptions,
}: {
  object: unknown;
  searchNode: ParsedTag;
  filterOptions?: FilterOptions;
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
          filterOptions,
        }),
      )
      .filter((x) => x).length > 0
  );
}
