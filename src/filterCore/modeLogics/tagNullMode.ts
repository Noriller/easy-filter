import { ParsedTag } from '../../shared/shapes';
import { tagCrawler } from '../objectCrawlers/tagCrawler';

export function tagNullMode({
  object,
  searchNode,
}: {
  object: unknown;
  searchNode: ParsedTag;
}) {
  const objectFromTag = tagCrawler(object, searchNode.tag);
  return objectFromTag === undefined;
}
