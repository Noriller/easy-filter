/* eslint-disable prettier/prettier */
import { ParsedResult, DateRangePayload, ParsedRange, DateFormat } from 'src/shared/shapes';
import { cleanString } from '../../utils/cleanString';
import { middleBetweenBracketsRegex } from '../../utils/regexes';

export const dateRangeParse = (dateOptions: DateFormat = null) => (search: string): ParsedResult => {
  const dateRangePartRegex = /\b(dateRange)\(.*?\)/gi;

  const dateRangePartFound = search.match(dateRangePartRegex) || false;

  if (dateRangePartFound) {
    const minimumDate = new Date('0000-01-01');
    const maximumDate = new Date('9999-01-01');

    const dateRangeParsed = dateRangePartFound.map((dateRange) => {
      const [min, max] = dateRange.match(middleBetweenBracketsRegex)[0].split(',');

      const minDate = new Date(parseDate(min, dateOptions)).getTime();
      const maxDate = new Date(parseDate(max, dateOptions)).getTime();

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

function parseDate(date: string, dateFormat?: DateFormat) {
  if (!dateFormat) return date;

  const dateFormatSplit = dateFormat.toUpperCase().split(/[-/., ]/i);

  const dateSplit = date.replace(/ /g, '').toUpperCase().split(/[-/., ]/i);

  const formatedDateObject = Object.fromEntries(dateFormatSplit.map((_, i) => [dateFormatSplit[i], dateSplit[i]]));

  const jsDateMonthOffset = 1;
  return Date.UTC(
    +formatedDateObject['YYYY'], +formatedDateObject['MM'] - jsDateMonthOffset, +formatedDateObject['DD']
  );
}
