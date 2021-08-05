/* eslint-disable prettier/prettier */
import { ParsedResult, RangePayload } from 'src/shared/shapes';
import { cleanString } from '../../utils/cleanString';
import { middleBetweenBracketsRegex } from '../../utils/regexes';

export function rangeParse(search: string): ParsedResult {
  const rangePartRegex = /\b(range)\(.*?\)/gi;

  const rangePartFound = search.match(rangePartRegex) || false;

  if (rangePartFound) {
    const rangeParsed = rangePartFound.map((range) => {
      const [min, max] = range.match(middleBetweenBracketsRegex)[0].split(',');
      return [
        +min || Number.NEGATIVE_INFINITY,
        +max || Number.POSITIVE_INFINITY
      ];
    }).filter(([min, max]) => !(min === -Infinity && max === Infinity));

    const cleanedString: string = rangePartFound.reduce((cleaned, range) => cleanString(cleaned, range), search);

    if (rangeParsed.length === 0) return emptyParsedResult(cleanedString);

    return {
      search: cleanedString,
      parsedSearch: rangeParsed.map((payload: RangePayload) => ({ payload, mode: 'RANGE' }))
    };
  } else {
    return emptyParsedResult(search);
  }
}
function emptyParsedResult(search: string): ParsedResult {
  return {
    search,
    parsedSearch: null
  };
}
