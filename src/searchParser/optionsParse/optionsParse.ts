import { parseStringToBoolean } from '../../utils/parseStringToBoolean';
import { DateFormat, FilterOptions, ParsedOptions } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';
import {
  dateSplittersGlobal,
  middleBetweenBracketsRegex,
} from '../../utils/regexes';

export function optionsParse(search: string): ParsedOptions {
  // Matches option(*anything*)/options(*anything*)
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
      optionsReducer,
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

function optionsReducer(filterOptions: FilterOptions, option: string) {
  const [optionLabel, value] = option.split(':');

  if (/normalize/i.test(optionLabel))
    filterOptions.normalize = (value && parseStringToBoolean(value)) ?? true;

  if (/index/i.test(optionLabel))
    filterOptions.indexing = (value && parseStringToBoolean(value)) ?? true;

  if (/limit/i.test(optionLabel)) filterOptions.limit = parseInt(value) || 0;

  if (/dateFormat/i.test(optionLabel)) {
    const validFormats = ['YYYYMMDD', 'DDMMYYYY', 'MMDDYYYY', 'YYYYDDMM'];
    if (validFormats.includes(value.replace(dateSplittersGlobal, '')))
      filterOptions.dateFormatSearch = value as DateFormat;
  }

  return filterOptions;
}
