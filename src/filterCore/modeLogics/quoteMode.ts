import { FilterOptions, ParsedPart } from 'src/shared/shapes';
import { shouldReturnRecursion } from '../shouldReturn';

export function quoteMode({
  object,
  stringifiedObject,
  searchNode,
  filterOptions,
}: {
  object: unknown;
  stringifiedObject: string;
  searchNode: ParsedPart;
  filterOptions: FilterOptions;
}) {
  const modeResult = searchNode.childs
    .map((c) =>
      shouldReturnRecursion({
        object,
        stringifiedObject,
        searchNode: c,
        filterOptions,
      }),
    )
    .filter((x) => x).length;
  return searchNode.childs.length === modeResult;
}
