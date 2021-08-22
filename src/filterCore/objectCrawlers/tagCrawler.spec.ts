import { tagCrawler } from './tagCrawler';

describe('tagCrawler', () => {
  describe('with partial values', () => {
    it('should return undefined without tags', () => {
      const object = { some: 'object' };
      const tags = null;
      expect(tagCrawler(object, tags)).toBe(undefined);
    });
    it('should return undefined without object', () => {
      const tags = 'first.second';
      expect(tagCrawler(undefined, tags)).toBe(undefined);
    });
  });

  describe('with existing tags', () => {
    const value = 'value';
    const object = {
      first: {
        second: value,
      },
    };
    it('should return the value from the tag', () => {
      const tags = 'first';
      expect(tagCrawler(object, tags)).toBe(object.first);
    });
    it('should return the value from the chaining tag', () => {
      const tags = 'first.second';
      expect(tagCrawler(object, tags)).toBe(value);
    });
  });

  describe('without existing tags', () => {
    const value = 'value';
    const object = {
      first: {
        second: value,
      },
    };
    it('should return undefined when the first tag dont exist', () => {
      const tags = 'nullTag';
      expect(tagCrawler(object, tags)).toBe(undefined);
    });
    it('should return undefined if the first tag from the chaining tag dont exist', () => {
      const tags = 'nullTag.second';
      expect(tagCrawler(object, tags)).toBe(undefined);
    });
  });

  describe('with arrays', () => {
    it('should return the index of the array', () => {
      const object = [1, 2, 3, 4];
      const tags = '0';
      expect(tagCrawler(object, tags)).toBe(1);
    });
    it('should return the value from the subobject', () => {
      const object = [{ value: 1 }, { value: 2 }];
      const tags = '0.value';
      expect(tagCrawler(object, tags)).toBe(1);
    });
  });

  describe('with complext objects and arrays', () => {
    const complexObject = {
      firstTag: 'just a string',
      secondTag: [
        { value: 1 },
        {
          subObject: {
            value: 2,
          },
        },
        {
          subObject: {
            yetAnotherSubObject: {
              value: 2,
            },
          },
        },
      ],
      thirdTag: {
        1: { value: 'string 1' },
        2: ['a', 'b', 'c'],
      },
    };

    it('should return the entire subobject', () => {
      const tags = 'secondTag';
      expect(tagCrawler(complexObject, tags)).toBe(complexObject.secondTag);
    });

    it('should return the subobject inside the array', () => {
      const tags = 'secondTag.2';
      expect(tagCrawler(complexObject, tags)).toBe(complexObject.secondTag[2]);
    });

    it('should return the subobject inside the object in the array', () => {
      const tags = 'secondTag.2.subObject';
      expect(tagCrawler(complexObject, tags)).toBe(
        complexObject.secondTag[2].subObject,
      );
    });

    it('should not find a object outside of the bounds of the array inside the complex object', () => {
      const tags = 'secondTag.999.subObject';
      expect(tagCrawler(complexObject, tags)).toBe(undefined);
    });

    it('should find a tag that is a number and not an array index', () => {
      const tags = 'thirdTag.1';
      expect(tagCrawler(complexObject, tags)).toBe(complexObject.thirdTag[1]);
    });

    describe('searching inside subarray', () => {
      it('should search using the wildcard and find two values', () => {
        const tags = 'secondTag.*.subObject';
        expect(tagCrawler(complexObject, tags)).toEqual([
          complexObject.secondTag[1].subObject,
          complexObject.secondTag[2].subObject,
        ]);
      });

      it('should search using the wildcard and find no values', () => {
        const tags = 'secondTag.*.random';
        expect(tagCrawler(complexObject, tags)).toEqual([]);
      });
    });
  });
});
