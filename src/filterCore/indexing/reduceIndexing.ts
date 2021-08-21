export function reduceIndexing(modeResult: number[], multiplier = 1) {
  return modeResult.reduce((acc, r) => acc + r, 0) * multiplier;
}
