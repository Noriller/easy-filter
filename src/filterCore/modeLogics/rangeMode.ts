import { FilterOptions, ParsedRange } from 'src/shared/shapes';

export function rangeMode({
  object,
  searchNode,
  filterOptions,
}: {
  object: number;
  searchNode: ParsedRange;
  filterOptions: FilterOptions;
}) {
  if (isNaN(object)) return false;

  return (
    Number(object) > searchNode.range[0] && Number(object) < searchNode.range[1]
  );
}
