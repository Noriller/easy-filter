import { ParsedPart } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';

export function notParse(search: string, parsedNot: ParsedPart[] = []) {
  const notPartRegexWithNestedBalancedBrackets =
    /not\((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*\)/i;

  const [notPartFound] =
    search.match(notPartRegexWithNestedBalancedBrackets) || [];

  const notParsed = notPartFound?.slice(4, notPartFound.length - 1);

  if (notParsed) {
    return notParse(cleanString(search, notPartFound), [
      ...parsedNot,
      {
        string: notParsed,
        mode: 'NOT',
      },
    ]);
  } else {
    return [search, parsedNot];
  }
}
