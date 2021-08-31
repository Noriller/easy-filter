/**
 * This parses a string "true" and returns true, else returns false.
 * @param str either "true" or something else
 * @returns true if "true" or false
 */
export function parseStringToBoolean(str: string): boolean {
  return str.toLowerCase() === 'true';
}
