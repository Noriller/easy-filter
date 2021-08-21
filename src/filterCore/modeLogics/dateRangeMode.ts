import { FilterOptions, ParsedRange } from 'src/shared/shapes';

export function dateRangeMode({
  object,
  searchNode,
  filterOptions,
}: {
  object: Date;
  searchNode: ParsedRange;
  filterOptions: FilterOptions;
}) {
  if (<unknown>object == 'Invalid Date') return false;
  return (
    object > new Date(searchNode.range[0]) &&
    object < new Date(searchNode.range[1])
  );
}
