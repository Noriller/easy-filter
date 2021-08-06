import { ParsedPart, ParsedResult } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';

export function notParse(search: string): ParsedResult {
  const notPartRegexWithNestedBalancedBrackets =
    /not\((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*\)/gi;

  const notPartsFound =
    search.match(notPartRegexWithNestedBalancedBrackets) || false;

  if (notPartsFound) {
    const { reducedString, reducedNots } = notPartsFound.reduce(notsReducer, {
      reducedString: search,
      reducedNots: [],
    });

    return {
      search: reducedString,
      parsedSearch: reducedNots.length > 0 ? reducedNots : null,
    };
  } else {
    return {
      search,
      parsedSearch: null,
    };
  }
}

const notsReducer = (
  {
    reducedString,
    reducedNots,
  }: { reducedString: string; reducedNots: ParsedPart[] },
  notPart: string,
): {
  reducedString: string;
  reducedNots: ParsedPart[];
} => {
  const notParsed = notPart.slice(4, notPart.length - 1);
  if (notParsed === '') {
    return {
      reducedString: cleanString(reducedString, notPart),
      reducedNots: reducedNots,
    };
  }

  return {
    reducedString: cleanString(reducedString, notPart),
    reducedNots: [
      ...reducedNots,
      {
        payload: notParsed,
        mode: 'NOT',
      },
    ],
  };
};
