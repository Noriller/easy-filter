function tagCrawlerWrapper(
  object: unknown,
  tag: string,
  alias?: string[],
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
  alias: string[],
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

function aliasesTags(alias: string[], tag: string): string[] {
  return alias ? getAliasTags(alias, tag) : [];
}

function getAliasTags(alias: string[], tag: string): string[] {
  const fullMatch = alias[tag];
  return fullMatch ? fullMatch : [];
}

export { tagCrawlerWrapper as tagCrawler };
