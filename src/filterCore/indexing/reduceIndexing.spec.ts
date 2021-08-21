import { reduceIndexing } from './reduceIndexing';

describe('reduceIndexing', () => {
  it('should reduce an empty array', () => {
    expect(reduceIndexing([])).toBe(0);
  });

  it('should reduce an array of one element', () => {
    expect(reduceIndexing([1])).toBe(1);
  });

  it('should reduce an array of multiple elements', () => {
    expect(reduceIndexing([1, 2, 3, 0, 0, 0, 0, 1])).toBe(7);
  });
});
