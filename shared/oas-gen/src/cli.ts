import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import {
  loadSpec,
  normalizeOperations,
  groupByTag,
} from './utils/parseSpec';
import { runOrval } from './runOrval';
import { postProcessOrvalOutput } from './postProcess';
import { generateQueryFile } from './generateQuery';
import { writeQueriesIndex } from './writeQueriesIndex';

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, '..');
const repoRoot = path.resolve(pkgRoot, '..', '..');

type CliOptions = {
  spec: string;
  apisDir: string;
  queriesIndex: string;
  dryRun: boolean;
};

const parseArgs = (argv: string[]): CliOptions => {
  const args = new Map<string, string>();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq > -1) {
        args.set(a.slice(2, eq), a.slice(eq + 1));
      } else {
        const next = argv[i + 1];
        if (next && !next.startsWith('--')) {
          args.set(a.slice(2), next);
          i++;
        } else {
          args.set(a.slice(2), 'true');
        }
      }
    }
  }

  const spec = args.get('spec') ?? process.env.OPEN_API_DOCS;
  if (!spec) {
    throw new Error(
      '[oas-gen] --spec or OPEN_API_DOCS env is required (yaml URL or local path)',
    );
  }
  const apisDir = path.resolve(
    repoRoot,
    args.get('out') ?? 'web/src/apis',
  );
  const queriesIndex = path.resolve(
    apisDir,
    args.get('queries-index') ?? 'queries.ts',
  );
  const dryRun = args.get('dry-run') === 'true';

  return { spec, apisDir, queriesIndex, dryRun };
};

const main = async () => {
  const opts = parseArgs(process.argv.slice(2));
  console.log(`[oas-gen] spec: ${opts.spec}`);
  console.log(`[oas-gen] out:  ${opts.apisDir}`);

  const spec = await loadSpec(opts.spec);
  const operations = normalizeOperations(spec);
  const tagGroups = groupByTag(operations);

  if (operations.length === 0) {
    console.warn('[oas-gen] no operations found in spec — exiting');
    return;
  }

  console.log(
    `[oas-gen] ${operations.length} operations across ${tagGroups.size} tag(s)`,
  );

  const tmpDir = path.resolve(opts.apisDir, '__oas_tmp__');

  if (opts.dryRun) {
    console.log('[oas-gen] --dry-run: skipping orval + file writes');
    for (const [tag, ops] of tagGroups) {
      console.log(`  tag=${tag} ops=${ops.map((o) => o.operationId).join(', ')}`);
      const queryFile = generateQueryFile(tag, ops);
      if (queryFile) {
        console.log(
          `  --- ${tag.toLowerCase()}.query.ts ---\n${queryFile}\n  ---`,
        );
      }
    }
    return;
  }

  // 1) orval run → tmpDir
  await runOrval(path.resolve(pkgRoot, 'orval.config.ts'), {
    OPEN_API_DOCS: opts.spec,
    OAS_GEN_OUTPUT_DIR: tmpDir,
  });

  // 2) move tag files into <apisDir>/<tag>/<tag>.api.ts
  const emittedTags = await postProcessOrvalOutput(tmpDir, opts.apisDir);
  console.log(`[oas-gen] emitted .api.ts for tags: ${emittedTags.join(', ')}`);

  // 3) generate .query.ts per tag (only those that exist after orval emit)
  const writtenQueryTags: string[] = [];
  for (const [tag, ops] of tagGroups) {
    const lowerTag = tag.toLowerCase();
    if (!emittedTags.includes(lowerTag)) continue;
    const content = generateQueryFile(tag, ops);
    if (!content) continue;
    const queryPath = path.resolve(
      opts.apisDir,
      lowerTag,
      `${lowerTag}.query.ts`,
    );
    await mkdir(path.dirname(queryPath), { recursive: true });
    await writeFile(queryPath, content, 'utf-8');
    writtenQueryTags.push(tag);
  }
  console.log(
    `[oas-gen] emitted .query.ts for tags: ${writtenQueryTags
      .map((t) => t.toLowerCase())
      .join(', ')}`,
  );

  // 4) maintain queries.ts marker block
  await writeQueriesIndex(opts.queriesIndex, writtenQueryTags);
  console.log(`[oas-gen] updated ${opts.queriesIndex}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
