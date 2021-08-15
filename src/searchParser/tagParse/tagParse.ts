import { ParsedResult, ParsedTag } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';

export function tagParse(search: string): ParsedResult {
  /**
   * This should match:
   *  tag:something
   *  tag:"something in double quotes"
   *  tag:'something in single quotes'
   *  tag:(between brackets)
   *  tag:(between (nested) brackets)
   *  [tag] -> can be any word
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
  if (cleanString(tagPart).endsWith(':')) {
    return {
      reducedString: cleanString(reducedString, tagPart),
      reducedTags: reducedTags,
    };
  } else {
    const [tag, tagString] = tagPart.split(':');
    const middleOfBracketsOrItselfRegex = /(?:(?:^\()(.*?)(?:\)$))|(^.*?$)/i;
    const [tagPayloadWithoutBrackers, tagPayloadWithBrackers] = tagString.match(
      middleOfBracketsOrItselfRegex,
    );

    const payload = tagPayloadWithBrackers || tagPayloadWithoutBrackers;

    const tagNullValuesRegex = /^(NULL|NIL|NONE|NOTHING)$/;

    const tagMode = tagNullValuesRegex.test(payload) ? 'TAG_NULL' : 'TAG';

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
