#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, '..');
const cliEntry = path.resolve(pkgRoot, 'src/cli.ts');

const result = spawnSync(
  process.execPath,
  ['--import', 'tsx', cliEntry, ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    cwd: pkgRoot,
    env: { ...process.env, OAS_GEN_CALLER_CWD: process.cwd() },
  },
);

process.exit(result.status ?? 1);
