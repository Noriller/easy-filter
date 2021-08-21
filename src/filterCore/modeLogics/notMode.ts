import { FilterOptions, NOT_Exclusion, ParsedPart } from 'src/shared/shapes';
import { shouldReturnRecursion } from '../shouldReturn';

export function notMode({
  object,
  stringifiedObject,
  searchNode,
  filterOptions,
}: {
  object: unknown;
  stringifiedObject: string;
  searchNode: ParsedPart;
  filterOptions: FilterOptions;
}): boolean | NOT_Exclusion {
  const childsResult =
    searchNode.childs
      .map((c) =>
        shouldReturnRecursion({
          object,
          stringifiedObject,
          searchNode: c,
          filterOptions,
        }),
      )
      .filter((x) => x).length > 0;
  return childsResult ? 'NOT_Exclusion' : false;
}
