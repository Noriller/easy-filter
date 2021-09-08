import { ParsedResult, ParsedTag } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';

export function tagParse(search: string): ParsedResult {
  /**
   * This regex should match:
   * * tag:something
   * * tag:"something in double quotes"
   * * tag:'something in single quotes'
   * * tag:(between brackets)
   * * tag:(between (nested) brackets)
   * * Where [tag] -> can be any word
   */
  const tagPartRegexAloneBracketQuotes =
    /(?<tags>\S+:(?<tagvalue>(?<quotetag>["']).*?\k<quotetag>|\((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*\)|.*?(?=(\s|$))))/gi;

  const tagPartsFound = search.match(tagPartRegexAloneBracketQuotes) || false;

  if (tagPartsFound) {
    const { reducedString, reducedTags } = tagPartsFound.reduce(tagsReducer, {
      reducedString: search,
      reducedTags: [],
    });

    return {
      search: reducedString,
      parsedSearch: reducedTags.length > 0 ? reducedTags : null,
    };
  } else {
    return {
      search,
      parsedSearch: null,
    };
  }
}

const tagsReducer = (
  {
    reducedString,
    reducedTags,
  }: { reducedString: string; reducedTags: ParsedTag[] },
  tagPart: string,
): {
  reducedString: string;
  reducedTags: ParsedTag[];
} => {
  // This removes tags without values: "tag:"
  if (cleanString(tagPart).endsWith(':')) {
    return {
      reducedString: cleanString(reducedString, tagPart),
      reducedTags: reducedTags,
    };
  } else {
    const [tag, tagString] = tagPart.split(':');

    const tagNullValuesRegex = /^(NULL|NIL|NONE|NOTHING)$/i;
    const tagMode = tagNullValuesRegex.test(tagString) ? 'TAG_NULL' : 'TAG';

    // This regex removes the outside brackets from a "tag:(or)"
    const middleOfBracketsOrItselfRegex = /(?:(?:^\()(.*?)(?:\)$))|(^.*?$)/i;
    // The return of the regex depends on it having or not brackets. I wasn't able to take it all in one go.
    const [tagPayloadWithoutBrackers, tagPayloadWithBrackers] = tagString.match(
      middleOfBracketsOrItselfRegex,
    );

    // So... here it takes the one with value.
    const payload = tagPayloadWithBrackers || tagPayloadWithoutBrackers;

    return {
      reducedString: cleanString(reducedString, tagPart),
      reducedTags: [
        ...reducedTags,
        {
          payload,
          tag,
          mode: tagMode,
        },
      ],
    };
  }
};
