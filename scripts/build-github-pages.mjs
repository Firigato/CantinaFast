import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const output = 'dist/client/index.html';
const startedAt = Date.now();
const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const build = spawnSync(executable, ['vinext', 'build'], {
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

if (!existsSync(output) || statSync(output).mtimeMs < startedAt - 1000) {
  process.exit(build.status ?? 1);
}

const html = readFileSync(output, 'utf8')
  .replaceAll('"/_next/', '"/CantinaFast/_next/')
  .replaceAll('"/combo-cantina.png', '"/CantinaFast/combo-cantina.png')
  .replaceAll('"/favicon.svg', '"/CantinaFast/favicon.svg');

writeFileSync(output, html);
