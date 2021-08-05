import { middleBetweenBracketsRegex } from 'src/utils/regexes';
import { ParsedResult, ParsedTag } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';

export function tagParse(search: string): ParsedResult {
  /**
   * This should match:
   *  tag:something
   *  tag:"something in double quotes"
   *  tag:'something in single quotes'
   *  tag:(between brackets)
   *  [tag] -> can be any word
   */
  const tagPartRegexAloneBracketQuotes =
    /(?<tags>\S+:(?<tagvalue>(?<quotetag>["']).*?\k<quotetag>|\(.*?\)|.*?(?=(\s|$))))/gi;

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
    //for this regex to work, you need to use the groups, not the matchs so you cant use [0], but [1]
    const middleOfBracketsOrItselfRegex = /^\(?(.*?)\)?$/i;
    const tagPayload = tagString.match(middleOfBracketsOrItselfRegex)[1];

    return {
      reducedString: cleanString(reducedString, tagPart),
      reducedTags: [
        ...reducedTags,
        {
          payload: { tag, tagPayload },
          mode: 'TAG',
        },
      ],
    };
  }
};
