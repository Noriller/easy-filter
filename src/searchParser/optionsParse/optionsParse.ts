/* eslint-disable prettier/prettier */
import { ParsedPart } from '../../shared/shapes';
import { cleanString } from '../../utils/cleanString';
import { middleBetweenBracketsRegex } from '../../utils/regexes';

export function optionsParse(search: string): [string, ParsedPart] {
  const optionsPartRegex = /\b(options|option)\(.+?\)/gi;

  const optionsPartFound = search.match(optionsPartRegex) || [];

  const optionParsed =
    optionsPartFound.length > 0
      ? optionsPartFound.flatMap((option) => {
        return option.match(middleBetweenBracketsRegex)[0].split(' ').filter(x => x);
      })
      : [];

  const cleanedString = optionsPartFound.reduce((cleaned, option) => cleanString(cleaned, option), search);
  return [
    cleanedString,
    { string: optionParsed.join(' '), mode: 'OPTION' }
  ];
}
