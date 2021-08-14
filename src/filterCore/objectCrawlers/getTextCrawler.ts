export function getTextCrawler(object: unknown): string {
  if (object !== Object(object)) return object?.toString();

  return Object.values(object).flatMap(getTextCrawler).join(' ');
}
