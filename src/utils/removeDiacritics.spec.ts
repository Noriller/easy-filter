import { removeDiacritics } from './removeDiacritics';

describe('removeDiacritics', () => {
  const withoutDiacritics = 'string with no diacritics';
  const withDiacritics = 'stríng wïth nô dìãçrîtïçs';

  it('should give back the same string when there are no diacritics', () => {
    expect(removeDiacritics(withoutDiacritics)).toBe(withoutDiacritics);
  });

  it('should remove the diacritics from the string', () => {
    expect(removeDiacritics(withDiacritics)).toBe(withoutDiacritics);
  });

  it('should return empty string when empty string is passed', () => {
    expect(removeDiacritics('')).toBe('');
  });

  it('should return diacritic when only diacritic is passed', () => {
    expect(removeDiacritics('^`´~¨')).toBe('^`´~¨');
  });
});
