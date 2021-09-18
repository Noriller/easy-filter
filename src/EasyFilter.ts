import { shouldReturn } from './filterCore/shouldReturn';
import EasyFilterParser, {
  OptionalParameters,
} from '@noriller/easy-filter-parser';
import { removeDiacritics } from '@noriller/easy-filter-parser/utils';

/**
 * EasyFilter is a minimal setup filter.
 *
 * The minimal setup is just passing the source as an array.
 *
 * After that, call `search` passing your query string and use the result.
 *
 * @param source - an array of objects
 * @example
 * ```js
  // Minimal example:
  const filter = EasyFilter(sourceArray)
  const filteredResult = filter.search('your query')
 * ```
 * @description
 * You can also pass options that will define default behaviors.
 *
 * @example
 * ```js
  // Using All Options:
  const filter = EasyFilter(sourceArray, {
    filterOptions: {
      dateFormat: 'DD-MM-YYYY',
      normalize: true,
      indexing: true,
      limit: 10,
    },
    tagAliases: {
      tag: ['tag1', 'tag2', 'tag3'],
    }
  })
 * ```
 */
export default function EasyFilter(
  source: Array<unknown>,
  { filterOptions = {}, tagAliases = {} }: OptionalParameters = {},
) {
  const parser = EasyFilterParser({
    filterOptions,
    tagAliases,
  });

  return {
    /**
     * Call `search` with your query string to filter the source array.
     * @param string - Your query string.
     * @returns the filtered source array.
     *
     * @remarks
     * Returns objects with the reference of the source unless using indexing.
     *
     * @see README for everything that can be passed in the query string.
     */
    search: (string) => search(string, source, parser),
  };
}

function search(string: string, source: Array<unknown>, parser) {
  const { options, searchTree } = parser.search(string);

  let maxReturns =
    options?.limit > 0 && options?.limit <= source.length
      ? options?.limit
      : source.length;

  const returnAccumulator = [];

  for (let i = 0; i < source.length; i++) {
    const object = options?.normalize
      ? JSON.parse(removeDiacritics(JSON.stringify(source[i])))
      : source[i];

    const result = shouldReturn({
      object,
      searchTree,
      filterOptions: options,
    });

    if (result) {
      maxReturns--;
      const objectToReturn = options?.indexing
        ? addIndexing(source[i], <number>result)
        : source[i];
      returnAccumulator.push(objectToReturn);
    }

    if (!maxReturns) i = source.length;
  }

  return returnAccumulator;
}

function addIndexing(sourceObj: unknown, indexValue: number): unknown {
  const returnObject: any = Object.assign({}, sourceObj);
  returnObject._EasyFilterIndex = indexValue;

  return returnObject;
}
