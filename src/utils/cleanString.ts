export function cleanString(stringToClean: string, replaceString = ''): string {
  return stringToClean.replace(replaceString, '').replace(/  +/g, ' ').trim();
}
