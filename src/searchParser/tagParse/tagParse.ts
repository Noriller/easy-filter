import { ParsedPart } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';

export function tagParse(search: string, parsedTag: ParsedPart[] = []) {
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

  const tagPartsFound = search.match(tagPartRegexAloneBracketQuotes) || [];

  if (tagPartsFound.length > 0) {
    const { reducedString, reducedTags } = tagPartsFound.reduce(tagsReducer, {
      reducedString: search,
      reducedTags: parsedTag,
    });

    return [reducedString, reducedTags];
  } else {
    return [search, parsedTag];
  }
}

const tagsReducer = ({ reducedString, reducedTags }, tagPart) => {
  if (cleanString(tagPart).endsWith(':')) {
    return {
      reducedString: cleanString(reducedString, tagPart),
      reducedTags: reducedTags,
    };
  } else {
    return {
      reducedString: cleanString(reducedString, tagPart),
      reducedTags: [
        ...reducedTags,
        {
          string: tagPart,
          mode: 'TAG',
        },
      ],
    };
  }
};
