import { ParsedPart, ParsedResult } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';

export function quotesParse(search: string): ParsedResult {
  const quotePartRegex = /(?<quotevalue>(?<quote>["']).*?\k<quote>)/gi;
  const tagPartRegexAloneBracketQuotes =
    /(?<tags>\S+:(?<tagvalue>(?<quotetag>["']).*?\k<quotetag>|\(.*?\)|.*?(?=(\s|$))))/gi;
  /**
   * While a quote can have a tag and a tag can have quotes,
   * I need to be able to get quotes first that aren't part of tags.
   * I couldn't find a regex to do that,
   *  so I'm going to use both and exclude quotes that are part of tags.
   */

  const quotesPartFound = search.match(quotePartRegex) || false;
  const tagsPartFound =
    quotesPartFound && search.match(tagPartRegexAloneBracketQuotes);

  if (quotesPartFound) {
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
  const quoteParsed = quotePart.slice(1, quotePart.length - 1);
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
