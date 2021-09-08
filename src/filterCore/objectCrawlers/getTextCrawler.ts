/**
 * Traverse objects (or primitives) recursively and return all values concatenaded together, separated by space.
 *
 * @param object basically anything
 * @returns a concatenation of all values of the given object recursively.
 */
export function getTextCrawler(object: unknown): string {
  // This basically returns the string representation of primitive values, used as exit condition to the recursion
  if (object !== Object(object)) return object?.toString();

  return Object.values(object).flatMap(getTextCrawler).join(' ');
}
