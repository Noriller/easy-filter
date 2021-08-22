import { DateFormat, NOT_Exclusion, ParsedPart } from '../../shared/shapes';
import { shouldReturnRecursion } from '../shouldReturn';

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
      .filter((x) => x).length > 0;

  if (childsResult) {
    return 'NOT_Exclusion';
  } else {
    return indexing ? 0 : false;
  }
}
