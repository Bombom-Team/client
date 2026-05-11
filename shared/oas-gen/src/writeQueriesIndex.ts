import { readFile, writeFile } from 'node:fs/promises';
import { toLowerCamel } from './utils/naming';

const START_MARKER = '// @oas-gen:start (do not edit)';
const END_MARKER = '// @oas-gen:end';

const buildBlock = (tags: string[]): string => {
  const importLines = tags
    .map(
      (t) =>
        `import { ${toLowerCamel(t)}Queries } from './${t.toLowerCase()}/${t.toLowerCase()}.query';`,
    )
    .join('\n');
  const spreadLines = tags
    .map((t) => `  ...${toLowerCamel(t)}Queries,`)
    .join('\n');
  return (
    `${START_MARKER}\n` +
    `/* eslint-disable import/order */\n` +
    importLines +
    `\nexport const oasGenQueries = {\n` +
    spreadLines +
    `\n};\n${END_MARKER}`
  );
};

export const writeQueriesIndex = async (
  indexPath: string,
  tags: string[],
): Promise<void> => {
  const tagsSorted = [...new Set(tags)].sort();
  const block = buildBlock(tagsSorted);

  let current = '';
  try {
    current = await readFile(indexPath, 'utf-8');
  } catch {
    current = '';
  }

  const hasStart = current.includes(START_MARKER);
  const hasEnd = current.includes(END_MARKER);

  let next: string;
  if (hasStart && hasEnd) {
    const startIdx = current.indexOf(START_MARKER);
    const endIdx = current.indexOf(END_MARKER) + END_MARKER.length;
    next = current.slice(0, startIdx) + block + current.slice(endIdx);
  } else {
    next = current.trimEnd() + (current ? '\n\n' : '') + block + '\n';
  }

  if (next !== current) {
    await writeFile(indexPath, next, 'utf-8');
  }
};
