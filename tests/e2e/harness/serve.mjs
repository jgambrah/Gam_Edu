// Static server for the engine harness: dist/ (built bundle) + public/ (preview fixtures and diagrams) on port 4180.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const built = spawnSync('node', [path.join(here, 'build.mjs')], { stdio: 'inherit' });
if (built.status !== 0) process.exit(1);

const types = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' };
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>GAM EDU engine harness</title>
<script src="https://cdn.tailwindcss.com/3.4.17"></script></head><body><div id="root"></div><script type="module" src="/dist/entry.js"></script></body></html>`;

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost:4180');
  if (url.pathname === '/' || url.pathname === '/index.html') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(html); }
  const candidates = [path.join(here, url.pathname), path.join(root, 'public', url.pathname)];
  for (const file of candidates) {
    const resolved = path.resolve(file);
    if (!resolved.startsWith(here) && !resolved.startsWith(path.join(root, 'public'))) continue; // no path traversal
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      res.writeHead(200, { 'content-type': types[path.extname(resolved)] || 'application/octet-stream', 'cache-control': 'no-store' });
      return fs.createReadStream(resolved).pipe(res);
    }
  }
  res.writeHead(404); res.end('not found');
}).listen(4180, () => console.log('engine harness on http://localhost:4180'));
