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

  it('should work while typing', () => {
    const result = ef.search('not(');
    expect(result).toHaveLength(0);
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

  describe('case sensitivity', () => {
    it('should search while ignoring case sensitivity', () => {
      const result = ef.search('BULBA');
      expect(result).toHaveLength(1);
    });

    it('should search tags ignoring case sensitivity', () => {
      const result = ef.search('ID:10');
      expect(result).toHaveLength(1);
    });
  });
});

describe('EasyFilterIssues', () => {
  describe('using NOT operator alone returns an empty array | issue: #8', () => {
    const ef = EasyFilter(poke10);
    it('should search using NOT operator', () => {
      const result = ef.search('not(id:2)');
      expect(result).not.toHaveLength(0);
      expect(result).toHaveLength(9);
    });

    it('should search using NOT operator and other operator', () => {
      const result = ef.search('not(id:2) id:3');
      expect(result).toHaveLength(1);
    });

    it('should search using NOT operator with index', () => {
      const ef_index = EasyFilter(poke10, {
        filterOptions: {
          indexing: true,
        },
      });

      const result = ef_index.search('not(id:2)');
      expect(result).not.toHaveLength(0);
      expect(result).toHaveLength(9);
    });

    it('should search using NOT operator and other operator with index', () => {
      const ef_index = EasyFilter(poke10, {
        filterOptions: {
          indexing: true,
        },
      });

      const result = ef_index.search('not(id:2) id:3');
      expect(result).toHaveLength(1);
    });
  });
});
