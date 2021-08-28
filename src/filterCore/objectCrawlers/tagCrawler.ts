import { TagAlias } from '../../shared/shapes';

function tagCrawlerWrapper(
  object: unknown,
  tag: string,
  alias?: TagAlias,
): unknown[] {
  if (!tag || !object) return [];

  const baseTags = tag.split('.');

  return [
    tagCrawlerRecursion(object, alias, baseTags),
    aliasesTags(alias, tag).map((aliasTag) =>
      tagCrawlerWrapper(object, aliasTag, alias),
    ),
  ]
    .flat(Infinity)
    .filter(Boolean);
}

function tagCrawlerRecursion(
  object: unknown,
  alias: TagAlias,
  tags: string[],
): unknown {
  if (!tags || !object || tags.length === 0) return object;
  const [firstTag, ...restTags] = tags;

  if (firstTag === '*' && Array.isArray(object)) {
    return object
      .map((ea) => tagCrawlerRecursion(ea, alias, restTags))
      .filter(Boolean);
  }

  return [
    tagCrawlerRecursion(object[firstTag], alias, restTags),
    aliasesTags(alias, firstTag).map((aliasTag) =>
      tagCrawlerWrapper(object, aliasTag, alias),
    ),
  ];
}

function aliasesTags(alias: TagAlias, tag: string): string[] {
  return alias ? getAliasTags(alias, tag) : [];
}

function getAliasTags(alias: TagAlias, tag: string): string[] {
  const fullMatch = alias[tag];
  return fullMatch ? fullMatch : [];
}

export { tagCrawlerWrapper as tagCrawler };
