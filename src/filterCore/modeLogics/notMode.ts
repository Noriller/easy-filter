import { ParsedPart } from '@noriller/easy-filter-parser/types';
import { DateFormat } from '@noriller/easy-filter-parser';
import { shouldReturnRecursion } from '../shouldReturn';

export type NOT_Exclusion = 'NOT_Exclusion';

export function notMode({
  object,
  stringifiedObject,
  searchNode,
  dateFormat,
  indexing,
}: {
  object: unknown;
  stringifiedObject: string;
  searchNode: ParsedPart;
  dateFormat?: DateFormat;
  indexing: boolean;
}): number | boolean | NOT_Exclusion {
  const childsResult =
    searchNode.childs
      .map((c) =>
        shouldReturnRecursion({
          object,
          stringifiedObject,
          searchNode: c,
          dateFormat,
          indexing,
        }),
      )
      .filter(Boolean).length > 0;

  // It doesn't matter the result, only if there was any.
  if (childsResult) {
    return 'NOT_Exclusion';
  } else {
    return indexing ? 0 : false;
  }
}
