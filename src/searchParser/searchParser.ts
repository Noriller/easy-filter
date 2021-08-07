import { FilterOptions, ParsedPart } from 'src/shared/shapes';
import { parserPipeline } from './parserPipeline';

export function searchParser(search: string, filterOptions?: FilterOptions) {
  const parsedSearch = parserPipeline({
    search,
    filterOptions,
  });

  return parsedSearch.reduce(optionSearchsReducer, {
    options: [],
    searchTree: [],
  });
}

const optionSearchsReducer = (
  { options, searchTree }: { options: string[]; searchTree: ParsedPart[] },
  node: ParsedPart,
) => {
  if (node.mode === 'OPTION') {
    options.push(node.payload);
  } else {
    searchTree.push(node);
  }

  return { options, searchTree };
};
