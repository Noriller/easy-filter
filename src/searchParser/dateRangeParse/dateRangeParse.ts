/* eslint-disable prettier/prettier */
import { ParsedResult, DateRangePayload, ParsedRange } from 'src/shared/shapes';
import { cleanString } from '../../utils/cleanString';
import { middleBetweenBracketsRegex } from '../../utils/regexes';

export function dateRangeParse(search: string): ParsedResult {
  const dateRangePartRegex = /\b(dateRange)\(.*?\)/gi;

  const dateRangePartFound = search.match(dateRangePartRegex) || false;

  if (dateRangePartFound) {
    const minimumDate = new Date('0000-01-01');
    const maximumDate = new Date('10000-01-01');

    const dateRangeParsed = dateRangePartFound.map((dateRange) => {
      const [min, max] = dateRange.match(middleBetweenBracketsRegex)[0].split(',');

      // If the date is given in the DD-MM-YYYY format, it will not work properly
      // Either in the initial options or in the search options we should be locale aware.
      const minDate = new Date(min).getTime();
      const maxDate = new Date(max).getTime();

      return [
        new Date(+minDate || minimumDate),
        new Date(+maxDate || maximumDate),
      ];
    }).filter(([min, max]) => !(min.getTime() === minimumDate.getTime() && max.getTime() === maximumDate.getTime()));

    const cleanedString: string = dateRangePartFound.reduce((cleaned, dateRange) => cleanString(cleaned, dateRange), search);

    if (dateRangeParsed.length === 0) return emptyParsedResult(cleanedString);

    return {
      search: cleanedString,
      parsedSearch: dateRangeParsed.map((range: DateRangePayload): ParsedRange =>
        ({ payload: null, range, mode: 'RANGE' })
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