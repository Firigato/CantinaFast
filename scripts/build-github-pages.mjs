import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const outputDirectory = 'dist/client';
const output = join(outputDirectory, 'index.html');
const basePath = '/CantinaFast/';
const startedAt = Date.now();
const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const build = spawnSync(executable, ['vinext', 'build'], {
  env: { ...process.env, VITE_BASE_PATH: basePath },
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

if (!existsSync(output) || statSync(output).mtimeMs < startedAt - 1000) {
  process.exit(build.status ?? 1);
}

const html = readFileSync(output, 'utf8');
const assetPrefix = `${basePath}_next/`;

if (!html.includes(assetPrefix)) {
  console.error(`GitHub Pages build is missing the ${assetPrefix} asset prefix.`);
  process.exit(1);
}

if (/\b(?:src|href)=["']\/_next\//.test(html)) {
  console.error('GitHub Pages build still contains root-relative Next assets.');
  process.exit(1);
}

const generatedAssets = [
  ...html.matchAll(/\b(?:src|href)=["'](?<path>\/CantinaFast\/_next\/[^"']+)/g),
];
const missingAssets = generatedAssets
  .map((match) => match.groups.path.slice(basePath.length))
  .filter((path) => !existsSync(join(outputDirectory, path)));

if (missingAssets.length > 0) {
  console.error(`GitHub Pages build references missing assets:\n${missingAssets.join('\n')}`);
  process.exit(1);
}

// Disable Jekyll so GitHub Pages publishes the generated _next directory.
writeFileSync(join(outputDirectory, '.nojekyll'), '');
