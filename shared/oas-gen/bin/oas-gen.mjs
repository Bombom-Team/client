#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const cliEntry = path.resolve(here, '../src/cli.ts');

const result = spawnSync(
  process.execPath,
  ['--import', 'tsx', cliEntry, ...process.argv.slice(2)],
  { stdio: 'inherit' },
);

process.exit(result.status ?? 1);
