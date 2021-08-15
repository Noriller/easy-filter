import { ParsedRange } from 'src/shared/shapes';

export function rangeMode({
  object,
  searchNode,
}: {
  object: number;
  searchNode: ParsedRange;
}) {
  if (isNaN(object)) return false;

  return (
    Number(object) > searchNode.range[0] && Number(object) < searchNode.range[1]
  );
}
