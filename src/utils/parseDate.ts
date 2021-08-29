import { DateFormat } from '../shared/shapes';
import { dateSplitters } from './regexes';

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
