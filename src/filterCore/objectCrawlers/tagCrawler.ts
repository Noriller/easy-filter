function tagCrawlerWrapper(object: unknown, tag: string): unknown {
  if (!tag || !object) return;
  const tags = tag.split('.');
  return tagCrawlerRecursion(object, tags);
}

function tagCrawlerRecursion(object: unknown, tags: string[]) {
  if (!tags || !object || tags.length === 0) return object;
  const [firstTag, ...restTags] = tags;
  return tagCrawlerRecursion(object[firstTag], restTags);
}

export { tagCrawlerWrapper as tagCrawler };
