export function cleanString(stringToClean: string, replaceString = ''): string {
  return stringToClean
    .replace(/  +/g, ' ')
    .replace(replaceString.replace(/  +/g, ' ').trim(), '')
    .replace(/  +/g, ' ')
    .trim();
}
