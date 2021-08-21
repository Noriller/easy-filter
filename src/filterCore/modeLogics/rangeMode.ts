import { ParsedRange } from 'src/shared/shapes';
import { RANGE_VALUE } from '../indexing/indexingConstants';

export function rangeMode({
  object,
  searchNode,
}: {
  object: number;
  searchNode: ParsedRange;
}): number {
  if (isNaN(object)) return 0;

  const isInRange =
    Number(object) > searchNode.range[0] &&
    Number(object) < searchNode.range[1];

  return isInRange ? RANGE_VALUE : 0;
}
