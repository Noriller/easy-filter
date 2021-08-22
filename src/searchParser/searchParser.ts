import { FilterOptions } from '../shared/shapes';
import { removeDiacritics } from '../utils/removeDiacritics';
import { optionsParse } from './optionsParse/optionsParse';
import { parserPipeline } from './parserPipeline';

export function searchParser(search: string, filterOptions?: FilterOptions) {
  const { search: afterOptionsSearch, parsedOptions } = optionsParse(search);

  const finalOptions = { ...filterOptions, ...parsedOptions };

  const parsedSearch = parserPipeline({
    search: finalOptions.normalize
      ? removeDiacritics(afterOptionsSearch)
      : afterOptionsSearch,
    filterOptions: finalOptions,
  });

  return {
    options: finalOptions,
    searchTree: parsedSearch,
  };
}
