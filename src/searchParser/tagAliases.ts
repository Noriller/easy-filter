import { ParsedPart, TagAliases, ParsedTag } from '../shared/shapes';

/**
 * addAliases is used to add aliases to the searchTree.
 *
 * This is used so only the needed aliases are passed to the filter.
 *
 * @returns returns the tree with any TAG node with the matching aliases added.
 */
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

/**
 * For each tag, returns the related aliases a key/value object.
 */
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
