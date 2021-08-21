import { FilterOptions, ParsedOptions } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';
import { middleBetweenBracketsRegex } from '../../utils/regexes';

export function optionsParse(search: string): ParsedOptions {
  const optionsPartRegex = /\b(options|option)\(.+?\)/gi;

  const optionsPartFound = search.match(optionsPartRegex) || null;

  if (optionsPartFound) {
    const optionParsed = optionsPartFound.flatMap((option) => {
      return option
        .match(middleBetweenBracketsRegex)[0]
        .split(' ')
        .filter((x) => x);
    });

    const cleanedString = optionsPartFound.reduce(
      (cleaned, option) => cleanString(cleaned, option),
      search,
    );

    const parsedOptions: FilterOptions = optionParsed.reduce(
      (filterOptions, option) => {
        if (/normalize/i.test(option)) filterOptions.normalize = true;
        if (/index/i.test(option)) filterOptions.indexing = true;
        if (/limit/i.test(option)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, limit] = option.split(':');
          filterOptions.limit = parseInt(limit);
        }
        return filterOptions;
      },
      {} as FilterOptions,
    );

    return {
      search: cleanedString,
      parsedOptions,
    };
  } else {
    return {
      search: search,
      parsedOptions: null,
    };
  }
}
