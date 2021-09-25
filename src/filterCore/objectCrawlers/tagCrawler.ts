import { TagAliases } from '@noriller/easy-filter-parser';

function tagCrawlerWrapper(
  object: unknown,
  tag: string,
  aliases?: TagAliases,
): unknown[] {
  // Don't refactor to "!object" since it would return falsy values as empty array.
  if (!tag || object === undefined || object === null) return [];

  const baseTags = tag.split('.');

  // This will try first using the baseTags then again with aliases
  // While gives a better coverage of what is checked, but probably makes affects performance and might cause conflits because of returns.
  // This would be a prime place to check and probably refactor.
  return (
    [
      tagCrawlerRecursion(object, aliases, baseTags),
      aliasesTags(aliases, tag).map((aliasesTag) =>
        tagCrawlerWrapper(object, aliasesTag, aliases),
      ),
    ]
      /* this ensures the result is a array without sub arrays */
      .flat(Infinity)
      /* don't refactor to "!x" or "Boolean", since it would remove falsy values*/
      .filter((x) => x !== undefined && x !== null)
  );
}

function tagCrawlerRecursion(
  object: unknown,
  aliases: TagAliases,
  tags: string[],
): unknown {
  // Don't refactor to "!object" since it would return falsy values as empty array.
  if (!tags || object === undefined || object === null || tags.length === 0)
    return object;

  const [firstTag, ...restTags] = tags;

  if (firstTag === '*' && Array.isArray(object)) {
    return object
      .map((ea) => tagCrawlerRecursion(ea, aliases, restTags))
      .filter((x) => x !== undefined && x !== null);
  }

  // Same comment as tagCrawlerWrapper return annotation.
  return [
    tagCrawlerRecursion(object[firstTag], aliases, restTags),
    aliasesTags(aliases, firstTag).map((aliasesTag) =>
      tagCrawlerWrapper(object, aliasesTag, aliases),
    ),
  ];
}

/**
 * Check if there's aliases, then try to return the corresponding aliases or empty array.
 */
function aliasesTags(aliases: TagAliases, tag: string): string[] {
  return aliases ? getAliasesTags(aliases, tag) : [];
}

/**
 * Returns the aliases if any, else empty array.
 */
function getAliasesTags(aliases: TagAliases, tag: string): string[] {
  const fullMatch = aliases[tag];
  return fullMatch ? fullMatch : [];
}

export { tagCrawlerWrapper as tagCrawler };
