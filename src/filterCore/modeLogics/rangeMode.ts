import { ParsedRange } from '@noriller/easy-filter-parser/types';
import { RANGE_VALUE } from '../indexing/indexingConstants';

export function rangeMode({
  object,
  searchNode,
  indexing,
}: {
  object: number;
  searchNode: ParsedRange;
  indexing: boolean;
}): number | boolean {
  if (isNaN(object)) return 0;

  const isInRange =
    Number(object) >= searchNode.range[0] &&
    Number(object) <= searchNode.range[1];

  if (isInRange) {
    return indexing ? RANGE_VALUE : true;
  } else {
    return indexing ? 0 : false;
  }
}
