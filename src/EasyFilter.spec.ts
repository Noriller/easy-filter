/* eslint-disable @typescript-eslint/no-var-requires */
import EasyFilter from './EasyFilter';
// const poke1 = require('../__Test__/pokeAPISlice1.json');
const poke10 = require('../__Test__/pokeAPISlice10.json');
// const poke151 = require('../__Test__/pokeAPISlice151.json');

describe('EasyFilter', () => {
  const ef = EasyFilter({ source: poke10 });

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
      const result = ef.search('id:range(1,3) options(limit:2)');
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

  describe('using tagAlias', () => {
    const tagAlias = {
      fullTag: ['moves.*.move.name'],
      firstPartTag: ['moves.*'],
      lastPartTag: ['move.name'],
      aliasWithMultipleValues: ['abilities.*.slot', 'id'],
    };

    it('should search using the alias for a full tag', () => {
      const efta = EasyFilter({ source: poke10, tagAlias });
      const result = efta.search('fullTag:swords-dance');
      expect(result).toHaveLength(6);
    });

    it('should search using the alias for a partial tag', () => {
      const efta = EasyFilter({ source: poke10, tagAlias });
      const result = efta.search('moves.*.lastPartTag:swords-dance');
      expect(result).toHaveLength(6);
    });

    it('should search using multiple alias', () => {
      const efta = EasyFilter({ source: poke10, tagAlias });
      const result = efta.search('firstPartTag.lastPartTag:swords-dance');
      expect(result).toHaveLength(6);
    });

    it('should search using one alias with multiple tags', () => {
      const efta = EasyFilter({ source: poke10, tagAlias });
      expect(efta.search('aliasWithMultipleValues:2')).toHaveLength(1);
      expect(efta.search('aliasWithMultipleValues:3')).toHaveLength(10);
    });
  });
});
