/**
 * Use this regex to return the string between
 * the first '(' and the first ')'
 *
 * @example
 * ```js
 * '(will return all this (and even this))'
 * ```
 */
export const middleBetweenBracketsRegex = /(?<=\().*?(?=\))/;
/**
 * Possible characters used in separating dates.
 */
export const dateSplitters = /[-/., ]/;
/**
 * Possible characters used in separating dates.
 * This uses the global flag.
 */
export const dateSplittersGlobal = /[-/., ]/g;
