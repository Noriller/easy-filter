import { ParsedRange } from '@noriller/easy-filter-parser/types/shapes';
import { RANGE_VALUE } from '../indexing/indexingConstants';

export function dateRangeMode({
  object,
  searchNode,
  indexing,
}: {
  object: Date;
  searchNode: ParsedRange;
  indexing: boolean;
}): number | boolean {
  if (<unknown>object == 'Invalid Date') return 0;

  const isInRange =
    object >= new Date(searchNode.range[0]) &&
    object <= new Date(searchNode.range[1]);

  if (isInRange) {
    return indexing ? RANGE_VALUE : true;
  } else {
    return indexing ? 0 : false;
  }
}
