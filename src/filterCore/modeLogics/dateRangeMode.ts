import { ParsedRange } from 'src/shared/shapes';

export function dateRangeMode({
  object,
  searchNode,
}: {
  object: Date;
  searchNode: ParsedRange;
}) {
  if (<unknown>object == 'Invalid Date') return false;
  return (
    object > new Date(searchNode.range[0]) &&
    object < new Date(searchNode.range[1])
  );
}
