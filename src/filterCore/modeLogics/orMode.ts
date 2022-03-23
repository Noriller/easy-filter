import { ParsedPart } from '@noriller/easy-filter-parser/types';

export function orMode({
  stringifiedObject,
  searchNode,
  indexing,
}: {
  stringifiedObject: string;
  searchNode: ParsedPart;
  indexing: boolean;
}): number | boolean {
  const payload = searchNode.payload.replace('(', '\\(');
  // In case a fuzzy search were to be included, this would probably be where.
  const regex = new RegExp(payload, 'i');
  const bool = regex.test(stringifiedObject);

  return indexing ? Number(bool) : bool;
}
