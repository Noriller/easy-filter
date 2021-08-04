import { ParsedPart } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';

export function notParse(search: string, parsedNot: ParsedPart[] = []) {
  const notPartRegexWithNestedBalancedBrackets =
    /not\((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*\)/gi;

  const notPartsFound =
    search.match(notPartRegexWithNestedBalancedBrackets) || false;

  if (notPartsFound) {
    const { reducedString, reducedNots } = notPartsFound.reduce(notsReducer, {
      reducedString: search,
      reducedNots: parsedNot,
    });
    return [reducedString, reducedNots];
  } else {
    return [search, parsedNot];
  }
}

const notsReducer = ({ reducedString, reducedNots }, notPart) => {
  const notParsed = notPart.slice(4, notPart.length - 1);
  return {
    reducedString: cleanString(reducedString, notPart),
    reducedNots: [
      ...reducedNots,
      {
        string: notParsed,
        mode: 'NOT',
      },
    ],
  };
};
