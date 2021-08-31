/**
 * Takes a string and removes all diacritics.
 * @param string
 * @returns the string without diacritics: "Crème brûlée" returns as "Creme brulee"
 */
export function removeDiacritics(string: string): string {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
