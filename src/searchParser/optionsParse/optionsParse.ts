import { parseStringToBoolean } from '../../utils/parseStringToBoolean';
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
        .filter(Boolean);
    });

    const cleanedString = optionsPartFound.reduce(
      (cleaned, option) => cleanString(cleaned, option),
      search,
    );

    const parsedOptions: FilterOptions = optionParsed.reduce(
      (filterOptions, option) => {
        const [optionLabel, value] = option.split(':');

        if (/normalize/i.test(optionLabel))
          filterOptions.normalize =
            (value && parseStringToBoolean(value)) ?? true;
        if (/index/i.test(optionLabel))
          filterOptions.indexing =
            (value && parseStringToBoolean(value)) ?? true;
        if (/limit/i.test(optionLabel))
          filterOptions.limit = parseInt(value) || 0;

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
