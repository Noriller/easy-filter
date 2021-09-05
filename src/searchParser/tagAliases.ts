import { ParsedPart, TagAliases, ParsedTag } from '../shared/shapes';

export function addAliases(
  node: ParsedPart,
  tagAliases: TagAliases,
): ParsedPart {
  if (node.mode === 'TAG' || node.mode === 'TAG_NULL') {
    (<ParsedTag>node).aliases = getAliases({
      tag: (<ParsedTag>node).tag,
      tagAliases,
    });
  }
  node.childs = node.childs?.map((c) => addAliases(c, tagAliases));
  return node;
}

function getAliases({
  tag,
  tagAliases,
}: {
  tag: string;
  tagAliases: TagAliases;
}): TagAliases {
  const aliasesArr = Object.entries(tagAliases)
    .map(([key, value]) =>
      tag.includes(key) ? ({ [key]: value } as TagAliases) : undefined,
    )
    .filter(Boolean);
  return aliasesArr.reduce(
    (acc, aliases) => ({ ...acc, ...aliases }),
    {} as TagAliases,
  );
}
