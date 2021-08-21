import { ParsedPart } from 'src/shared/shapes';
import { shouldReturnRecursion } from '../shouldReturn';

export function quoteMode({
  object,
  stringifiedObject,
  searchNode,
}: {
  object: unknown;
  stringifiedObject: string;
  searchNode: ParsedPart;
}) {
  const modeResult = searchNode.childs
    .map((c) =>
      shouldReturnRecursion({ object, stringifiedObject, searchNode: c }),
    )
    .filter((x) => x).length;
  return searchNode.childs.length === modeResult;
}
