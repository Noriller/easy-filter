import { FilterOptions } from '../shared/shapes';
import { removeDiacritics } from '../utils/removeDiacritics';
import { optionsParse } from './optionsParse/optionsParse';
import { parserPipeline } from './parserPipeline';

/**
 * This is the wrapper for the parser.
 *
 * @returns the final searchTree that will be used in the filters.
 */
export function searchParser(search: string, filterOptions?: FilterOptions) {
  // The options parser is passed first to get options that will be used on the rest of the parser.
  const { search: afterOptionsSearch, parsedOptions } = optionsParse(search);

  // This will make the new options to override the default ones.
  // Changing this would make possible to deny overriding of the default options.
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
