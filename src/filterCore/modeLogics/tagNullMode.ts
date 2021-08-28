import { ParsedTag } from '../../shared/shapes';
import { TAG_NULL_VALUE } from '../indexing/indexingConstants';
import { tagCrawler } from '../objectCrawlers/tagCrawler';

export function tagNullMode({
  object,
  searchNode,
  indexing,
}: {
  object: unknown;
  searchNode: ParsedTag;
  indexing: boolean;
}): number | boolean {
  const objectFromTag = tagCrawler(object, searchNode.tag);
  if (objectFromTag.length === 0) {
    return indexing ? TAG_NULL_VALUE : true;
  } else {
    return indexing ? 0 : false;
  }
}
