import { ParsedPart } from 'src/shared/shapes';

export function orMode({
  stringifiedObject,
  searchNode,
}: {
  stringifiedObject: string;
  searchNode: ParsedPart;
}): boolean {
  return stringifiedObject.includes(searchNode.payload);
}
