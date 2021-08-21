import { ParsedTag } from '../../shared/shapes';
import { TAG_NULL_VALUE } from '../indexing/indexingConstants';
import { tagCrawler } from '../objectCrawlers/tagCrawler';

export function tagNullMode({
  object,
  searchNode,
}: {
  object: unknown;
  searchNode: ParsedTag;
}): number {
  const objectFromTag = tagCrawler(object, searchNode.tag);
  return objectFromTag === undefined ? TAG_NULL_VALUE : 0;
}
