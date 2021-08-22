import { DateFormat } from '../shared/shapes';

export function parseDate(date: string, dateFormat?: DateFormat) {
  if (!dateFormat) return date;

  const dateFormatSplit = dateFormat.toUpperCase().split(/[-/., ]/i);

  const dateSplit = date
    .replace(/ /g, '')
    .toUpperCase()
    .split(/[-/., ]/i);

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
