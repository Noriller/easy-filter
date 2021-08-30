import { TagAliases } from '../../shared/shapes';

function tagCrawlerWrapper(
  object: unknown,
  tag: string,
  aliases?: TagAliases,
): unknown[] {
  if (!tag || !object) return [];

  const baseTags = tag.split('.');

  return [
    tagCrawlerRecursion(object, aliases, baseTags),
    aliasesTags(aliases, tag).map((aliasesTag) =>
      tagCrawlerWrapper(object, aliasesTag, aliases),
    ),
  ]
    .flat(Infinity)
    .filter(Boolean);
}

function tagCrawlerRecursion(
  object: unknown,
  aliases: TagAliases,
  tags: string[],
): unknown {
  if (!tags || !object || tags.length === 0) return object;
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
  return aliases ? getaliasesTags(aliases, tag) : [];
}

function getaliasesTags(aliases: TagAliases, tag: string): string[] {
  const fullMatch = aliases[tag];
  return fullMatch ? fullMatch : [];
}

export { tagCrawlerWrapper as tagCrawler };
