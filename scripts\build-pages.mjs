import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repository = (process.env.GITHUB_REPOSITORY || process.env.PAGES_REPOSITORY || 'khanu-learning').split('/').at(-1);
const basePath = process.env.VITE_BASE_PATH || (repository.endsWith('.github.io') ? '/' : `/${repository}/`);
const env = {
  ...process.env,
  VITE_BASE_PATH: basePath,
  VITE_STATIC_DEMO: process.env.VITE_STATIC_DEMO || 'true',
};
const vite = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const result = spawnSync(process.execPath, [vite, 'build', 'frontend', '--config', 'frontend/vite.config.js'], { cwd: root, env, stdio: 'inherit' });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
