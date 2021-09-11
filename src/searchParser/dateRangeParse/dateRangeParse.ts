import {
  ParsedResult,
  DateRangePayload,
  ParsedRange,
  DateFormat,
} from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';
import { middleBetweenBracketsRegex } from '../../utils/regexes';
import { parseDate } from '../../utils/parseDate';

export const dateRangeParse =
  (dateOptions: DateFormat = null) =>
  (search: string): ParsedResult => {
    // Matches all: dateRange(*anything*)
    const dateRangePartRegex = /\b(dateRange)\(.*?\)/gi;

    const dateRangePartFound = search.match(dateRangePartRegex) || false;

    if (dateRangePartFound) {
      const minimumDate = new Date('0000-01-01');
      const maximumDate = new Date('9999-01-01');

      const dateRangeParsed = dateRangePartFound
        .map((dateRange) => {
          const [min, max] = dateRange
            .match(middleBetweenBracketsRegex)[0]
            .split(',');

          const minDate = new Date(parseDate(min, dateOptions)).getTime();
          const maxDate = new Date(parseDate(max, dateOptions)).getTime();

          return [
            new Date(+minDate || minimumDate),
            new Date(+maxDate || maximumDate),
          ];
        })
        /* If no value is passed to dateRange (or they are invalid dates), the default min/max would be used, we filter it here.*/
        .filter(
          ([min, max]) =>
            !(
              min.getTime() === minimumDate.getTime() &&
              max.getTime() === maximumDate.getTime()
            ),
        );

      const cleanedString: string = dateRangePartFound.reduce(
        (cleaned, dateRange) => cleanString(cleaned, dateRange),
        search,
      );

      if (dateRangeParsed.length === 0) return emptyParsedResult(cleanedString);

      return {
        search: cleanedString,
        parsedSearch: dateRangeParsed.map(
          (range: DateRangePayload): ParsedRange => ({
            payload: null,
            range,
            mode: 'DATE_RANGE',
          }),
        ),
      };
    } else {
      return emptyParsedResult(search);
    }
  };

function emptyParsedResult(search: string): ParsedResult {
  return {
    search,
    parsedSearch: null,
  };
}
