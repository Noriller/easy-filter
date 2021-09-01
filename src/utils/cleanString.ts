/**
 * Takes a stringToClean, trims it and removes double spaces.
 * If a removeString is provided, it also removes it from the stringToClean.
 * @param stringToClean - any string
 * @param removeString - a substring that will be removed from the stringToClean, defaults to ''
 * @returns the stringToClean without the removeString, trimmed and without any double spaces
 */
export function cleanString(stringToClean: string, removeString = ''): string {
  return stringToClean
    .replace(/  +/g, ' ')
    .replace(removeString.replace(/  +/g, ' ').trim(), '')
    .replace(/  +/g, ' ')
    .trim();
}
