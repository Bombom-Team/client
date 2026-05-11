import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import {
  loadSpec,
  normalizeOperations,
  groupByTag,
} from './utils/parseSpec';
import { generateApiFile } from './generateApi';
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
  const apisDir = path.resolve(repoRoot, args.get('out') ?? 'web/src/apis');
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

  if (opts.dryRun) {
    console.log('[oas-gen] --dry-run: skipping file writes\n');
    for (const [tag, ops] of tagGroups) {
      const lowerTag = tag.toLowerCase();
      console.log(
        `  tag=${tag} (${lowerTag}) ops=${ops.map((o) => o.operationId).join(', ')}`,
      );
      const apiFile = generateApiFile(tag, ops);
      console.log(`  --- ${lowerTag}.api.ts ---\n${apiFile}  ---`);
      const queryFile = generateQueryFile(tag, ops);
      if (queryFile) {
        console.log(`  --- ${lowerTag}.query.ts ---\n${queryFile}  ---`);
      }
    }
    return;
  }

  const writtenTags: string[] = [];
  for (const [tag, ops] of tagGroups) {
    const lowerTag = tag.toLowerCase();
    const apiContent = generateApiFile(tag, ops);
    const queryContent = generateQueryFile(tag, ops);

    const apiPath = path.resolve(opts.apisDir, lowerTag, `${lowerTag}.api.ts`);
    await mkdir(path.dirname(apiPath), { recursive: true });
    await writeFile(apiPath, apiContent, 'utf-8');

    if (queryContent) {
      const queryPath = path.resolve(
        opts.apisDir,
        lowerTag,
        `${lowerTag}.query.ts`,
      );
      await writeFile(queryPath, queryContent, 'utf-8');
      writtenTags.push(tag);
    }
  }

  console.log(
    `[oas-gen] wrote .api.ts for ${tagGroups.size} tag(s); .query.ts for ${writtenTags.length} tag(s)`,
  );

  await writeQueriesIndex(opts.queriesIndex, writtenTags);
  console.log(`[oas-gen] updated ${opts.queriesIndex}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
