import { shouldReturn } from './filterCore/shouldReturn';
import { searchParser } from './searchParser/searchParser';
import { FilterOptions } from './shared/shapes';
import { removeDiacritics } from './utils/removeDiacritics';

export default function EasyFilter({
  source,
  filterOptions = {},
}: {
  source: Array<unknown>;
  filterOptions?: FilterOptions;
}) {
  return {
    search: (string) => search(string, source, filterOptions),
  };
}

function search(string: string, source: Array<unknown>, filterOptions) {
  const { options, searchTree } = searchParser(string, filterOptions);

  const maxReturns = options?.limit || source.length;

  const returnAccumulator = [];

  for (let i = 0; i < maxReturns; i++) {
    const object = options?.normalize
      ? JSON.parse(removeDiacritics(JSON.stringify(source[i])))
      : source[i];

    const result = shouldReturn({
      object,
      searchTree,
      filterOptions: options,
    });

    if (result) {
      const objectToReturn = options?.indexing
        ? addIndexing(source[i], <number>result)
        : source[i];
      returnAccumulator.push(objectToReturn);
    }
  }

  return returnAccumulator;
}

function addIndexing(sourceObj: unknown, indexValue: number): unknown {
  const returnObject: any = Object.assign({}, sourceObj);
  returnObject._EasyFilterIndex = indexValue;

  return returnObject;
}
