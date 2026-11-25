import { readdir, readFile, stat, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
const root = resolve('dist');
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(root);
await access(join(root, 'index.html'));
for (const file of files) {
  if ((await stat(file)).size > 25 * 1024 * 1024) throw new Error(`Cloudflare Pages: file exceeds 25 MiB: ${file}`);
  if (file.endsWith('.html')) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/(?:src|href|poster|data-src|data-mobile-src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      if (match[1].startsWith('//')) continue;
      const target = join(root, match[1]);
      const info = await stat(target);
      if (info.isDirectory()) await access(join(target, 'index.html'));
    }
  }
}
execFileSync(process.execPath, ['--check', join(root, 'app.js')], { stdio: 'inherit' });
console.log(`Validated ${files.length} files: local references, JavaScript syntax and Cloudflare asset sizes.`);
