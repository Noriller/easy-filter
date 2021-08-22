import { ParsedPart } from '../../shared/shapes';

export function orMode({
  stringifiedObject,
  searchNode,
  indexing,
}: {
  stringifiedObject: string;
  searchNode: ParsedPart;
  indexing: boolean;
}): number | boolean {
  const bool = stringifiedObject.includes(searchNode.payload);
  return indexing ? Number(bool) : bool;
}
