import { shouldReturn } from './filterCore/shouldReturn';
import { searchParser } from './searchParser/searchParser';
import { addAliases } from './searchParser/tagAliases';
import { FilterOptions, ParsedPart, TagAlias } from './shared/shapes';
import { removeDiacritics } from './utils/removeDiacritics';

export default function EasyFilter({
  source,
  filterOptions = {},
  tagAlias = {},
}: {
  source: Array<unknown>;
  filterOptions?: FilterOptions;
  tagAlias?: TagAlias;
}) {
  return {
    search: (string) => search(string, source, filterOptions, tagAlias),
  };
}

function search(
  string: string,
  source: Array<unknown>,
  filterOptions: FilterOptions,
  tagAlias: TagAlias,
) {
  const { options, searchTree } = searchParser(string, filterOptions);

  let finalTree: ParsedPart[] = searchTree;

  if (tagAlias !== {}) {
    finalTree = searchTree.map((node) => {
      return addAliases(node, tagAlias);
    });
  }

  const maxReturns = options?.limit || source.length;

  const returnAccumulator = [];

  for (let i = 0; i < maxReturns; i++) {
    const object = options?.normalize
      ? JSON.parse(removeDiacritics(JSON.stringify(source[i])))
      : source[i];

    const result = shouldReturn({
      object,
      searchTree: finalTree,
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
