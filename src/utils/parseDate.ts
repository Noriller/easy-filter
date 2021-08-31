import { DateFormat } from '../shared/shapes';
import { dateSplitters } from './regexes';

/**
 * Parse a date in string format with year, month and day in any order by using a formater to override the default javascript implementation or parsing date.
 * @param date date in string format
 * @param dateFormat optional: a formater like YYYY-MM-DD
 * @returns date in UTC format, if dateFormat is not provided, just returns the date without parsing
 */
export function parseDate(date: string, dateFormat?: DateFormat) {
  if (!dateFormat) return date;

  const dateFormatSplit = dateFormat.toUpperCase().split(dateSplitters);

  const dateSplit = date.replace(/ /g, '').toUpperCase().split(dateSplitters);

  const formatedDateObject = Object.fromEntries(
    dateFormatSplit.map((_, i) => [dateFormatSplit[i], dateSplit[i]]),
  );

  const jsDateMonthOffset = 1;
  return Date.UTC(
    +formatedDateObject['YYYY'],
    +formatedDateObject['MM'] - jsDateMonthOffset,
    +formatedDateObject['DD'],
  );
}
