import { ParsedPart } from '../../shared/shapes';
import { shouldReturnRecursion } from '../shouldReturn';
import { reduceIndexing } from '../indexing/reduceIndexing';
import { QUOTE_MULTIPLIER } from '../indexing/indexingConstants';

export function quoteMode({
  object,
  stringifiedObject,
  searchNode,
  indexing,
}: {
  object: unknown;
  stringifiedObject: string;
  searchNode: ParsedPart;
  indexing: boolean;
}): number | boolean {
  const modeResult = <number[]>searchNode.childs
    .map((c) =>
      shouldReturnRecursion({
        object,
        stringifiedObject,
        searchNode: c,
        indexing,
      }),
    )
    .filter((x) => x);

  if (searchNode.childs.length === modeResult.length) {
    return indexing ? reduceIndexing(modeResult, QUOTE_MULTIPLIER) : true;
  } else {
    return indexing ? 0 : false;
  }
}
