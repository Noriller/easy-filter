import { FilterOptions, ParsedTag } from '../../shared/shapes';
import { tagCrawler } from '../objectCrawlers/tagCrawler';

export function tagNullMode({
  object,
  searchNode,
  filterOptions,
}: {
  object: unknown;
  searchNode: ParsedTag;
  filterOptions: FilterOptions;
}) {
  const objectFromTag = tagCrawler(object, searchNode.tag);
  return objectFromTag === undefined;
}
