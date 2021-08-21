import { FilterOptions, ParsedPart } from 'src/shared/shapes';

export function orMode({
  stringifiedObject,
  searchNode,
  filterOptions
}: {
  stringifiedObject: string;
  searchNode: ParsedPart;
  filterOptions: FilterOptions;
}): boolean {
  return stringifiedObject.includes(searchNode.payload);
}
