import { DateFormat } from '../shared/shapes';
import { searchParser } from '../searchParser/searchParser';
import { shouldReturn } from './shouldReturn';

describe('shouldReturn', () => {
  const object = {
    firstTag: 'just a string',
    secondTag: [
      {
        value: 1,
        boolean: false,
      },
      {
        subObject: {
          value: 2,
          boolean: true,
        },
      },
      {
        subObject: {
          yetAnotherSubObject: {
            value: 3,
          },
        },
      },
    ],
    thirdTag: {
      1: { value: 'random words' },
      2: ['a', 'b', 'c'],
    },
    fourthTag: {
      someDate: '2021-12-30',
      someNumber1: 50,
      someNumber2: 100,
    },
  };

  describe('without indexing', () => {
    it('should return true on empty search', () => {
      const { searchTree } = searchParser('');
      const result = shouldReturn({ object, searchTree });
      expect(result).toBe(true);
    });

    describe('OR search', () => {
      it('should find the value and return true', () => {
        const { searchTree } = searchParser('random');
        const result = shouldReturn({ object, searchTree });
        expect(result).toBe(true);
      });

      it('should find the value and return true even if not matching all words', () => {
        const { searchTree } = searchParser('random something');
        const result = shouldReturn({ object, searchTree });
        expect(result).toBe(true);
      });

      it('should not find the value and return false', () => {
        const { searchTree } = searchParser('StringThatShouldNotFind');
        const result = shouldReturn({ object, searchTree });
        expect(result).toBe(false);
      });
    });

    describe('QUOTE search', () => {
      it('should find the value and return true', () => {
        const { searchTree } = searchParser('"random"');
        const result = shouldReturn({ object, searchTree });
        expect(result).toBe(true);
      });

      it('should not find the value and return false', () => {
        const { searchTree } = searchParser('"random something"');
        const result = shouldReturn({ object, searchTree });
        expect(result).toBe(false);
      });
    });

    describe('TAG search', () => {
      it('should find the value and return true', () => {
        const { searchTree } = searchParser('firstTag:string');
        const result = shouldReturn({ object, searchTree });
        expect(result).toBe(true);
      });

      it('should not find the value and return false', () => {
        const { searchTree } = searchParser('firstTag:random');
        const result = shouldReturn({ object, searchTree });
        expect(result).toBe(false);
      });

      describe('with TAG_NULL', () => {
        it('should not find the value and return true', () => {
          const { searchTree } = searchParser('invalidTag:NULL');
          const result = shouldReturn({ object, searchTree });
          expect(result).toBe(true);
        });

        it('should not find the value in a chaining tag and return true', () => {
          const { searchTree } = searchParser('secondTag.invalidTag:NULL');
          const result = shouldReturn({ object, searchTree });
          expect(result).toBe(true);
        });

        it('should find the value and return false', () => {
          const { searchTree } = searchParser('firstTag:NULL');
          const result = shouldReturn({ object, searchTree });
          expect(result).toBe(false);
        });
      });

      describe('with Range', () => {
        it('should find the value and return true', () => {
          const { searchTree } = searchParser(
            'fourthTag.someNumber1:range(45,55)',
          );
          const result = shouldReturn({ object, searchTree });
          expect(result).toBe(true);
        });

        it('should not find the value and return false', () => {
          const { searchTree } = searchParser(
            'fourthTag.someNumber2:range(45,55)',
          );
          const result = shouldReturn({ object, searchTree });
          expect(result).toBe(false);
        });

        it('should not find the value if passing a whole object and return false', () => {
          const { searchTree } = searchParser('fourthTag:range(45,55)');
          const result = shouldReturn({ object, searchTree });
          expect(result).toBe(false);
        });
      });

      describe('with DateRange', () => {
        it('should find the value and return true', () => {
          const { searchTree } = searchParser(
            'fourthTag.someDate:dateRange(2021-11-01,2022-01-01)',
          );
          const result = shouldReturn({ object, searchTree });
          expect(result).toBe(true);
        });

        it('should not find the value and return false', () => {
          const { searchTree } = searchParser(
            'fourthTag.someDate:dateRange(2019-11-01,2020-01-01)',
          );
          const result = shouldReturn({ object, searchTree });
          expect(result).toBe(false);
        });

        it('should not find the value if passing a whole object and return false', () => {
          const { searchTree } = searchParser(
            'fourthTag:daterange(2021-11-01,2022-01-01)',
          );
          const result = shouldReturn({ object, searchTree });
          expect(result).toBe(false);
        });

        describe('with dateFormat', () => {
          it('should find the value and return true', () => {
            const dateObject = { theDate: '05/01/2020' };
            const dateFormat: DateFormat = 'DD-MM-YYYY';
            const { searchTree } = searchParser(
              'theDate:daterange(03/01/2020,06/01/2020)',
              { dateFormat },
            );
            const result = shouldReturn({
              object: dateObject,
              searchTree,
              filterOptions: { dateFormat },
            });
            expect(result).toBe(true);
          });

          it('should not find the value and return false', () => {
            const dateObject = { theDate: '01/05/2020' };
            const dateFormat: DateFormat = 'MM-DD-YYYY';
            const { searchTree } = searchParser(
              'theDate:daterange(03/01/2020,06/01/2020)',
              { dateFormat },
            );
            const result = shouldReturn({
              object: dateObject,
              searchTree,
              filterOptions: { dateFormat },
            });
            expect(result).toBe(false);
          });
        });
      });
    });

    describe('NOT search', () => {
      it('should find the value and ignore because its also in NOT', () => {
        const { searchTree } = searchParser('random NOT(random something)');
        const result = shouldReturn({ object, searchTree });
        expect(result).toBe(false);
      });

      it('should find the value and return because NOT didnt find anything', () => {
        const { searchTree } = searchParser('random NOT(something)');
        const result = shouldReturn({ object, searchTree });
        expect(result).toBe(true);
      });
    });
  });

  describe('with indexing', () => {
    it('should return the index on empty search', () => {
      const { searchTree } = searchParser('');
      const result = shouldReturn({
        object,
        searchTree,
        filterOptions: { indexing: true },
      });
      expect(result).toBe(true);
    });

    describe('OR search', () => {
      it('should find the value and return the index', () => {
        const { searchTree } = searchParser('random');
        const result = shouldReturn({
          object,
          searchTree,
          filterOptions: { indexing: true },
        });
        expect(result).toBe(1);
      });

      it('should find the value and return the index even if not matching all words', () => {
        const { searchTree } = searchParser('random something');
        const result = shouldReturn({
          object,
          searchTree,
          filterOptions: { indexing: true },
        });
        expect(result).toBe(1);
      });

      it('should not find the value and return 0 as the index', () => {
        const { searchTree } = searchParser('StringThatShouldNotFind');
        const result = shouldReturn({
          object,
          searchTree,
          filterOptions: { indexing: true },
        });
        expect(result).toBe(0);
      });
    });

    describe('QUOTE search', () => {
      it('should find the value and return the index', () => {
        const { searchTree } = searchParser('"random"');
        const result = shouldReturn({
          object,
          searchTree,
          filterOptions: { indexing: true },
        });
        expect(result).toBe(3);
      });

      it('should not find the value and return 0 as the index', () => {
        const { searchTree } = searchParser('"random something"');
        const result = shouldReturn({
          object,
          searchTree,
          filterOptions: { indexing: true },
        });
        expect(result).toBe(0);
      });
    });

    describe('TAG search', () => {
      it('should find the value and return the index', () => {
        const { searchTree } = searchParser('firstTag:string');
        const result = shouldReturn({
          object,
          searchTree,
          filterOptions: { indexing: true },
        });
        expect(result).toBe(5);
      });

      it('should not find the value and return 0 as the index', () => {
        const { searchTree } = searchParser('firstTag:random');
        const result = shouldReturn({
          object,
          searchTree,
          filterOptions: { indexing: true },
        });
        expect(result).toBe(0);
      });

      describe('with TAG_NULL', () => {
        it('should not find the value and return the index', () => {
          const { searchTree } = searchParser('invalidTag:NULL');
          const result = shouldReturn({
            object,
            searchTree,
            filterOptions: { indexing: true },
          });
          expect(result).toBe(10);
        });

        it('should not find the value in a chaining tag and return the index', () => {
          const { searchTree } = searchParser('secondTag.invalidTag:NULL');
          const result = shouldReturn({
            object,
            searchTree,
            filterOptions: { indexing: true },
          });
          expect(result).toBe(10);
        });

        it('should find the value and return 0 as the index', () => {
          const { searchTree } = searchParser('firstTag:NULL');
          const result = shouldReturn({
            object,
            searchTree,
            filterOptions: { indexing: true },
          });
          expect(result).toBe(0);
        });
      });

      describe('with Range', () => {
        it('should find the value and return the index', () => {
          const { searchTree } = searchParser(
            'fourthTag.someNumber1:range(45,55)',
          );
          const result = shouldReturn({
            object,
            searchTree,
            filterOptions: { indexing: true },
          });
          expect(result).toBe(50);
        });

        it('should not find the value and return 0 as the index', () => {
          const { searchTree } = searchParser(
            'fourthTag.someNumber2:range(45,55)',
          );
          const result = shouldReturn({
            object,
            searchTree,
            filterOptions: { indexing: true },
          });
          expect(result).toBe(0);
        });

        it('should not find the value if passing a whole object and return 0 as the index', () => {
          const { searchTree } = searchParser('fourthTag:range(45,55)');
          const result = shouldReturn({
            object,
            searchTree,
            filterOptions: { indexing: true },
          });
          expect(result).toBe(0);
        });
      });

      describe('with DateRange', () => {
        it('should find the value and return the index', () => {
          const { searchTree } = searchParser(
            'fourthTag.someDate:dateRange(2021-11-01,2022-01-01)',
          );
          const result = shouldReturn({
            object,
            searchTree,
            filterOptions: { indexing: true },
          });
          expect(result).toBe(50);
        });

        it('should not find the value and return 0 as the index', () => {
          const { searchTree } = searchParser(
            'fourthTag.someDate:dateRange(2019-11-01,2020-01-01)',
          );
          const result = shouldReturn({
            object,
            searchTree,
            filterOptions: { indexing: true },
          });
          expect(result).toBe(0);
        });

        it('should not find the value if passing a whole object and return 0 as the index', () => {
          const { searchTree } = searchParser(
            'fourthTag:daterange(2021-11-01,2022-01-01)',
          );
          const result = shouldReturn({
            object,
            searchTree,
            filterOptions: { indexing: true },
          });
          expect(result).toBe(0);
        });

        describe('with dateFormat', () => {
          it('should find the value and return the index', () => {
            const dateObject = { theDate: '05/01/2020' };
            const dateFormat: DateFormat = 'DD-MM-YYYY';
            const { searchTree } = searchParser(
              'theDate:daterange(03/01/2020,06/01/2020)',
              { dateFormat },
            );
            const result = shouldReturn({
              object: dateObject,
              searchTree,
              filterOptions: { dateFormat, indexing: true },
            });
            expect(result).toBe(50);
          });

          it('should not find the value and return 0 as the index', () => {
            const dateObject = { theDate: '01/05/2020' };
            const dateFormat: DateFormat = 'MM-DD-YYYY';
            const { searchTree } = searchParser(
              'theDate:daterange(03/01/2020,06/01/2020)',
              { dateFormat },
            );
            const result = shouldReturn({
              object: dateObject,
              searchTree,
              filterOptions: { dateFormat, indexing: true },
            });
            expect(result).toBe(0);
          });
        });
      });
    });

    describe('NOT search', () => {
      it('should find the value and ignore because its also in NOT', () => {
        const { searchTree } = searchParser('random NOT(random something)');
        const result = shouldReturn({
          object,
          searchTree,
          filterOptions: { indexing: true },
        });
        expect(result).toBe(false);
      });

      it('should find the value and return because NOT didnt find anything', () => {
        const { searchTree } = searchParser('random NOT(something)');
        const result = shouldReturn({
          object,
          searchTree,
          filterOptions: { indexing: true },
        });
        expect(result).toBe(1);
      });
    });
  });
});
