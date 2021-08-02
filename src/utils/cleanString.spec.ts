import { cleanString } from './cleanString';

describe('cleanString', () => {
  it('should trim a string', () => {
    const stringWithTrailingSpaces = '  string with trailing spaces   ';
    const stringWithoutTrailingSpaces = 'string with trailing spaces';
    expect(cleanString(stringWithTrailingSpaces)).toBe(
      stringWithoutTrailingSpaces,
    );
  });

  it('should remove multiple spaces in the middle of the string', () => {
    const stringWithMultipleSpaces = 'string    with    multiple    spaces';
    const stringWithoutMultipleSpaces = 'string with multiple spaces';
    expect(cleanString(stringWithMultipleSpaces)).toBe(
      stringWithoutMultipleSpaces,
    );
  });

  it('should remove a substring from the string', () => {
    const string = 'string dirty to be cleaned';
    const substringToRemove = 'dirty to be';
    const cleanedString = 'string cleaned';
    expect(cleanString(string, substringToRemove)).toBe(cleanedString);
  });

  it('should remove a substring that have multiple spaces and/or trailing spaces', () => {
    const string = 'string dirty to be cleaned';
    const substringToRemove = '  dirty  to   be  ';
    const cleanedString = 'string cleaned';
    expect(cleanString(string, substringToRemove)).toBe(cleanedString);
  });

  it('should do all of the above', () => {
    const string = '  string   dirty to be   cleaned  ';
    const substringToRemove = '   dirty   to   be   ';
    const cleanedString = 'string cleaned';
    expect(cleanString(string, substringToRemove)).toBe(cleanedString);
  });
});
