import { TagAliases } from '../../shared/shapes';

function tagCrawlerWrapper(
  object: unknown,
  tag: string,
  aliases?: TagAliases,
): unknown[] {
  if (!tag || object === undefined || object === null) return [];

  const baseTags = tag.split('.');

  return [
    tagCrawlerRecursion(object, aliases, baseTags),
    aliasesTags(aliases, tag).map((aliasesTag) =>
      tagCrawlerWrapper(object, aliasesTag, aliases),
    ),
  ]
    .flat(Infinity)
    .filter((x) => x !== undefined && x !== null);
}

function tagCrawlerRecursion(
  object: unknown,
  aliases: TagAliases,
  tags: string[],
): unknown {
  if (!tags || object === undefined || object === null || tags.length === 0)
    return object;

  const [firstTag, ...restTags] = tags;

  if (firstTag === '*' && Array.isArray(object)) {
    return object
      .map((ea) => tagCrawlerRecursion(ea, aliases, restTags))
      .filter(Boolean);
  }

  return [
    tagCrawlerRecursion(object[firstTag], aliases, restTags),
    aliasesTags(aliases, firstTag).map((aliasesTag) =>
      tagCrawlerWrapper(object, aliasesTag, aliases),
    ),
  ];
}

function aliasesTags(aliases: TagAliases, tag: string): string[] {
  return aliases ? getAliasesTags(aliases, tag) : [];
}

function getAliasesTags(aliases: TagAliases, tag: string): string[] {
  const fullMatch = aliases[tag];
  return fullMatch ? fullMatch : [];
}

export { tagCrawlerWrapper as tagCrawler };
