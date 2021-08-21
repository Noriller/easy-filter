import { ParsedPart } from 'src/shared/shapes';

export function orMode({
  stringifiedObject,
  searchNode,
}: {
  stringifiedObject: string;
  searchNode: ParsedPart;
}): number {
  return Number(stringifiedObject.includes(searchNode.payload));
}
