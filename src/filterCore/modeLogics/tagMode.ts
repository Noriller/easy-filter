import { DateFormat, ParsedTag } from 'src/shared/shapes';
import { shouldReturnRecursion } from '../shouldReturn';

export function tagMode({
  object,
  stringifiedObject,
  searchNode,
  dateFormat,
}: {
  object: unknown;
  stringifiedObject: string;
  searchNode: ParsedTag;
  dateFormat?: DateFormat;
}) {
  return (
    searchNode.childs
      .map((c) =>
        shouldReturnRecursion({
          object,
          stringifiedObject,
          searchNode: c,
          dateFormat,
        }),
      )
      .filter((x) => x).length > 0
  );
}
