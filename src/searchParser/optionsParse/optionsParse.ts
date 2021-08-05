/* eslint-disable prettier/prettier */
import { ParsedPart, ParsedResult } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';
import { middleBetweenBracketsRegex } from '../../utils/regexes';

export function optionsParse(search: string): ParsedResult {
  const optionsPartRegex = /\b(options|option)\(.+?\)/gi;

  const optionsPartFound = search.match(optionsPartRegex) || null;

  if (optionsPartFound) {
    const optionParsed = optionsPartFound.flatMap((option) => {
      return option.match(middleBetweenBracketsRegex)[0].split(' ').filter(x => x);
    });

    const cleanedString = optionsPartFound.reduce((cleaned, option) => cleanString(cleaned, option), search);

    return {
      search: cleanedString,
      parsedSearch: optionParsed.map((payload): ParsedPart => ({ payload, mode: 'OPTION' }))
    };
  } else {
    return {
      search: search,
      parsedSearch: null,
    };
  }
}
