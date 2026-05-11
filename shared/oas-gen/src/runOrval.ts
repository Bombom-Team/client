import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

export const runOrval = async (configPath: string, env: NodeJS.ProcessEnv) => {
  return new Promise<void>((resolve, reject) => {
    const cwd = path.resolve(here, '..');
    const child = spawn(
      'pnpm',
      ['exec', 'orval', '--config', configPath],
      {
        cwd,
        stdio: 'inherit',
        env: { ...process.env, ...env },
      },
    );
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`orval exited with code ${code}`));
    });
  });
};
