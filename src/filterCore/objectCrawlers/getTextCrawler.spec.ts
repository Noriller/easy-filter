import { getTextCrawler } from './getTextCrawler';

describe('getTextCrawler', () => {
  describe('using primitive values', () => {
    it('should return the same string', () => {
      const string = 'random string';
      expect(getTextCrawler(string)).toBe(string);
    });

    it('should return a number as string', () => {
      const number = 123;
      expect(getTextCrawler(number)).toBe(number.toString());
    });

    it('should return a boolean as string', () => {
      const bool = false;
      expect(getTextCrawler(bool)).toBe(bool.toString());
    });

    it('should not return undefined as string', () => {
      const undef = undefined;
      expect(getTextCrawler(undef)).toBe(undefined);
    });

    it('should not return a null value as string', () => {
      const nil = null;
      expect(getTextCrawler(nil)).toBe(undefined);
    });

    it('should not return a empty array as string', () => {
      expect(getTextCrawler([])).toBe('');
    });
  });

  describe('using arrays', () => {
    it('should return the array values as strings', () => {
      const array = [1, 2, 3, 4];
      expect(getTextCrawler(array)).toBe('1 2 3 4');
    });
  });

  describe('using objects', () => {
    it('should return the array values as strings', () => {
      const obj = { one: 1, two: 2, three: 3, four: 4 };
      expect(getTextCrawler(obj)).toBe('1 2 3 4');
    });
  });

  describe('using all of the above', () => {
    it('should object with recursive arrays objects and primitive values', () => {
      const complexObject = {
        primitives: {
          string: 'just some string',
          number: 123,
          boolean: true,
        },
        array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        recursiveObjects: {
          anotherObject: {
            morePrimitives: {
              anotherString: 'just another string',
              anotherNumber: 6543,
              anotherBoolean: false,
              otherValues: {
                aNull: null,
                aUndefined: undefined,
              },
            },
          },
          anotherArray: ['array', 'of', 'strings'],
          arrayWithObjects: [
            { value: 'firstObject' },
            { value: 'secondObject' },
            { value: 'thirdObject' },
            { value: 'finalObject' },
          ],
        },
      };
      expect(getTextCrawler(complexObject)).toBe(
        'just some string 123 true 1 2 3 4 5 6 7 8 9 10 just another string 6543 false   array of strings firstObject secondObject thirdObject finalObject',
      );
    });
  });
});
