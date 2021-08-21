import { ParsedPart } from 'src/shared/shapes';
import { shouldReturnRecursion } from '../shouldReturn';
import { reduceIndexing } from '../indexing/reduceIndexing';
import { QUOTE_MULTIPLIER } from '../indexing/indexingConstants';

export function quoteMode({
  object,
  stringifiedObject,
  searchNode,
}: {
  object: unknown;
  stringifiedObject: string;
  searchNode: ParsedPart;
}): number {
  const modeResult = <number[]>(
    searchNode.childs
      .map((c) =>
        shouldReturnRecursion({ object, stringifiedObject, searchNode: c }),
      )
      .filter((x) => x)
  );

  if (searchNode.childs.length === modeResult.length) {
    return reduceIndexing(modeResult, QUOTE_MULTIPLIER);
  } else {
    return 0;
  }
}
