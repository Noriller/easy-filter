/**
 * Takes a string and removes all diacritics.
 *
 * @example
 * ```js
 * removeDiacritics("Crème brûlée") => "Creme brulee"
 * ```
 * @returns the string without diacritics
 */
export function removeDiacritics(string: string): string {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
