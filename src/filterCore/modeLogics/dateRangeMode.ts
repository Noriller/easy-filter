import { ParsedRange } from 'src/shared/shapes';
import { RANGE_VALUE } from '../indexing/indexingConstants';

export function dateRangeMode({
  object,
  searchNode,
}: {
  object: Date;
  searchNode: ParsedRange;
}): number {
  if (<unknown>object == 'Invalid Date') return 0;
  const isInRange =
    object > new Date(searchNode.range[0]) &&
    object < new Date(searchNode.range[1]);
  return isInRange ? RANGE_VALUE : 0;
}
