/* eslint-disable prettier/prettier */
import { ParsedRange, ParsedResult, RangePayload } from 'src/shared/shapes';
import { cleanString } from '../../utils/cleanString';
import { middleBetweenBracketsRegex } from '../../utils/regexes';

export function rangeParse(search: string): ParsedResult {
  const rangePartRegex = /\b(range)\(.*?\)/gi;

  const rangePartFound = search.match(rangePartRegex) || false;

  if (rangePartFound) {
    const rangeParsed = rangePartFound.map((range) => {
      const [min, max]: (number | string)[] = range.match(middleBetweenBracketsRegex)[0].split(',');
      const minumum = (min === '' || min === undefined || isNaN(Number(min))) ? Number.NEGATIVE_INFINITY : Number(min);
      const maximum = (max === '' || max === undefined || isNaN(Number(max))) ? Number.POSITIVE_INFINITY : Number(max);
      return [minumum, maximum];
    }).filter(([min, max]) => !(min === -Infinity && max === Infinity));

    const cleanedString: string = rangePartFound.reduce((cleaned, range) => cleanString(cleaned, range), search);

    if (rangeParsed.length === 0) return emptyParsedResult(cleanedString);

    return {
      search: cleanedString,
      parsedSearch: rangeParsed.map((range: RangePayload): ParsedRange =>
        ({ payload: null, range: range, mode: 'RANGE' })
      )
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
