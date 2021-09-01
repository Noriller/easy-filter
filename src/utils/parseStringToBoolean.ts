/**
 * This parses a string "true" and returns true, else returns false.
 * @remarks
 * Ignores casing.
 * @param strTrue - either "true" or something else
 * @returns True if "true" else False.
 */
export function parseStringToBoolean(strTrue: string): boolean {
  return strTrue.toLowerCase() === 'true';
}
