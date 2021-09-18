import { ParsedPart } from '@noriller/easy-filter-parser/types/shapes';

export function orMode({
  stringifiedObject,
  searchNode,
  indexing,
}: {
  stringifiedObject: string;
  searchNode: ParsedPart;
  indexing: boolean;
}): number | boolean {
  // In case a fuzzy search were to be included, this would probably be where.
  const bool = stringifiedObject.includes(searchNode.payload);
  return indexing ? Number(bool) : bool;
}
