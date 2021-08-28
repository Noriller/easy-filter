import { ParsedPart, TagAlias, ParsedTag } from '../shared/shapes';

export function addAliases(node: ParsedPart, tagAlias: TagAlias): ParsedPart {
  if (node.mode === 'TAG' || node.mode === 'TAG_NULL') {
    (<ParsedTag>node).alias = getAliases({
      tag: (<ParsedTag>node).tag,
      tagAlias,
    });
  }
  node.childs = node.childs?.map((c) => addAliases(c, tagAlias));
  return node;
}

function getAliases({
  tag,
  tagAlias,
}: {
  tag: string;
  tagAlias: TagAlias;
}): TagAlias {
  const aliasArr = Object.entries(tagAlias)
    .map(([key, value]) =>
      tag.includes(key) ? ({ [key]: value } as TagAlias) : undefined,
    )
    .filter(Boolean);
  return aliasArr.reduce(
    (acc, alias) => ({ ...acc, ...alias }),
    {} as TagAlias,
  );
}
