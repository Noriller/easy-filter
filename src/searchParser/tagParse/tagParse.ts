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
    /(?<=\s?)\S+:((?<quote>["']).*?\k<quote>|\(.*?\)|.*?(?=\s)|.*)/i;

  const [tagPartFound] = search.match(tagPartRegexAloneBracketQuotes) || [];

  if (tagPartFound) {
    if (cleanString(tagPartFound).endsWith(':')) {
      return tagParse(cleanString(search, tagPartFound), parsedTag);
    } else {
      return tagParse(cleanString(search, tagPartFound), [
        ...parsedTag,
        {
          string: tagPartFound,
          mode: 'TAG',
        },
      ]);
    }
  } else {
    return [search, parsedTag];
  }
}
