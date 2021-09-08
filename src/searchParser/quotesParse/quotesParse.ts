import { ParsedPart, ParsedResult } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';

export function quotesParse(search: string): ParsedResult {
  // Matches anything between first quote and next matching quote.
  const quotePartRegex = /(?<quotevalue>(?<quote>["']).*?\k<quote>)/gi;
  /**
   * While a quote can have a tag and a tag can have quotes,
   * I needed to be able to get quotes first that aren't part of tags.
   * I couldn't find a regex to do that,
   *  so I'm going to use both and exclude quotes that are part of tags.
   */
  const tagPartRegexAloneBracketQuotes =
    /(?<tags>\S+:(?<tagvalue>(?<quotetag>["']).*?\k<quotetag>|\(.*?\)|.*?(?=(\s|$))))/gi;

  const quotesPartFound = search.match(quotePartRegex) || false;

  if (quotesPartFound) {
    const tagsPartFound = search.match(tagPartRegexAloneBracketQuotes);
    const quotesToUse = tagsPartFound
      ? quotesPartFound.filter((quote) =>
          tagsPartFound.reduce(
            (acc, tag) => (tag.includes(quote) ? false : acc),
            true,
          ),
        )
      : quotesPartFound;

    const { reducedString, reducedQuotes } = quotesToUse.reduce(quotesReducer, {
      reducedString: search,
      reducedQuotes: [],
    });

    return {
      search: reducedString,
      parsedSearch: reducedQuotes,
    };
  } else {
    return {
      search: search,
      parsedSearch: null,
    };
  }
}

const quotesReducer = (
  {
    reducedString,
    reducedQuotes,
  }: { reducedString: string; reducedQuotes: ParsedPart[] },
  quotePart: string,
): {
  reducedString: string;
  reducedQuotes: ParsedPart[];
} => {
  const openingQuoteIndex = 1;
  const closingQuoteIndex = quotePart.length - 1;
  const quoteParsed = quotePart.slice(openingQuoteIndex, closingQuoteIndex);
  return {
    reducedString: cleanString(reducedString, quotePart),
    reducedQuotes: [
      ...reducedQuotes,
      {
        payload: quoteParsed,
        mode: 'QUOTE',
      },
    ],
  };
};
