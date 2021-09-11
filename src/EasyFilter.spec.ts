/* eslint-disable @typescript-eslint/no-var-requires */
import EasyFilter from './EasyFilter';
const poke10 = require('../__Test__/pokeAPISlice10.json');

describe('EasyFilter', () => {
  const ef = EasyFilter(poke10);

  it('should search a simple search', () => {
    const result = ef.search('bulba');
    expect(result).toHaveLength(1);
  });

  it('should search using a quote search', () => {
    const result = ef.search('"saur petal-blizzard"');
    expect(result).toHaveLength(1);
  });

  it('should search using tags', () => {
    const result = ef.search('moves.*.move.name:swords-dance');
    expect(result).toHaveLength(6);
  });

  it('should search using tags', () => {
    const result = ef.search('moves.*.move.name:swords-dance');
    expect(result).toHaveLength(6);
  });

  it('should search using ranges', () => {
    const result = ef.search('id:range(1,3)');
    expect(result).toHaveLength(3);
  });

  describe('using options', () => {
    it('should search using limit', () => {
      const result = ef.search('invalidTag:null options(limit:2)');
      expect(result).toHaveLength(2);
    });

    it('should search using normalization', () => {
      const result = ef.search('sãúr options(normalize)');
      expect(result).toHaveLength(3);
    });

    it('should search using index', () => {
      const result = ef.search('"saur petal-blizzard" options(index)');
      expect(result[0]._EasyFilterIndex).toBe(6);
    });
  });

  describe('using tagAliases', () => {
    const tagAliases = {
      fullTag: ['moves.*.move.name'],
      firstPartTag: ['moves.*'],
      lastPartTag: ['move.name'],
      aliasesWithMultipleValues: ['abilities.*.slot', 'id'],
    };

    it('should search using the aliases for a full tag', () => {
      const efta = EasyFilter(poke10, { tagAliases });
      const result = efta.search('fullTag:swords-dance');
      expect(result).toHaveLength(6);
    });

    it('should search using the aliases for a partial tag', () => {
      const efta = EasyFilter(poke10, { tagAliases });
      const result = efta.search('moves.*.lastPartTag:swords-dance');
      expect(result).toHaveLength(6);
    });

    it('should search using multiple aliases', () => {
      const efta = EasyFilter(poke10, { tagAliases });
      const result = efta.search('firstPartTag.lastPartTag:swords-dance');
      expect(result).toHaveLength(6);
    });

    it('should search using one aliases with multiple tags', () => {
      const efta = EasyFilter(poke10, { tagAliases });
      expect(efta.search('aliasesWithMultipleValues:2')).toHaveLength(1);
      expect(efta.search('aliasesWithMultipleValues:3')).toHaveLength(10);
    });
  });
});
