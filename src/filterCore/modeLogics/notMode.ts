import { DateFormat, NOT_Exclusion, ParsedPart } from 'src/shared/shapes';
import { shouldReturnRecursion } from '../shouldReturn';

export function notMode({
  object,
  stringifiedObject,
  searchNode,
  dateFormat,
}: {
  object: unknown;
  stringifiedObject: string;
  searchNode: ParsedPart;
  dateFormat?: DateFormat;
}): boolean | NOT_Exclusion {
  const childsResult =
    searchNode.childs
      .map((c) =>
        shouldReturnRecursion({
          object,
          stringifiedObject,
          searchNode: c,
          dateFormat,
        }),
      )
      .filter((x) => x).length > 0;
  return childsResult ? 'NOT_Exclusion' : false;
}
