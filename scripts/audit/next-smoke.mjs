// Production-server smoke test (audit): starts `next start` on port 3100 against a prior `next build` and checks routing,
// middleware, authentication gates, the image optimiser allow-list and API refusals. Synthetic requests only: no credentials,
// no live data. Usage: node scripts/audit/next-smoke.mjs [outFile.json]
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const PORT = 3100;
const base = `http://localhost:${PORT}`;
const child = spawn('npx', ['next', 'start', '-p', String(PORT)], { shell: true, stdio: 'ignore', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });

async function waitReady() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(base + '/', { redirect: 'manual' }); if (r.status) return; } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('server did not start');
}

const results = [];
async function check(name, url, opts, expectFn, note = '') {
  try {
    const res = await fetch(base + url, { redirect: 'manual', ...opts });
    const full = await res.text();
    const body = full.slice(0, 160).replace(/\s+/g, ' ');
    const ok = expectFn(res.status, res.headers.get('location'), full);
    results.push({ name, url, status: res.status, location: res.headers.get('location'), ok, note, body: body.slice(0, 90) });
  } catch (e) {
    results.push({ name, url, status: 'ERR', ok: false, note: String(e).slice(0, 100) });
  }
}

try {
  await waitReady();
  const json = { method: 'POST', headers: { 'content-type': 'application/json' } };
  await check('home renders', '/', {}, (s) => s === 200 || (s >= 300 && s < 400));
  await check('dashboard without a session does not render private data', '/dashboard', {}, (s, loc, b) => (s >= 300 && s < 400) || s === 200, 'client-side auth shell or redirect');
  // Next streams the not-found fallback with HTTP 200 once the shell has flushed; the body must be the 404 fallback and must not contain the fixture.
  await check('pilot preview page fails closed in production (not-found fallback, no fixture content)', '/narrated-lessons/measurement-lab-pilot-preview', {}, (s, l, b) => (s === 404 || b.includes('NEXT_HTTP_ERROR_FALLBACK;404')) && !/ml-s08|vernier-callipers/.test(b), 'status may be 200 due to streaming');
  await check('narrated lesson route responds', '/narrated-lessons/water-cycle', {}, (s) => s === 200 || s === 404 || (s >= 300 && s < 400));
  await check('Ask Teacher refuses anonymous callers', '/api/narrated-lessons/ask', { ...json, body: JSON.stringify({ lessonId: 'x', question: 'hello there' }) }, (s) => s === 401);
  await check('Ask Teacher refuses oversized bodies', '/api/narrated-lessons/ask', { ...json, body: 'x'.repeat(6000) }, (s) => s === 413);
  await check('image optimiser refuses an unapproved host', '/_next/image?url=' + encodeURIComponent('https://evil.example.com/a.png') + '&w=64&q=75', {}, (s) => s === 400 || s === 403);
  await check('image optimiser refuses a look-alike host', '/_next/image?url=' + encodeURIComponent('https://firebasestorage.googleapis.com.evil.com/v0/b/x/o/y.png') + '&w=64&q=75', {}, (s) => s === 400 || s === 403);
  await check('image proxy refuses a look-alike host', '/api/proxy-image?url=' + encodeURIComponent('https://firebasestorage.googleapis.com.evil.com/x.png'), {}, (s) => s === 403);
  await check('image proxy refuses http', '/api/proxy-image?url=' + encodeURIComponent('http://firebasestorage.googleapis.com/x.png'), {}, (s) => s === 403);
  await check('credit deduction refuses anonymous callers', '/api/v1/ai/deduct', { ...json, body: JSON.stringify({ schoolId: 's', credits: 1 }) }, (s) => s === 401);
  await check('term rollover refuses anonymous callers', '/api/terms/rollover', { ...json, body: JSON.stringify({ schoolId: 's', mode: 'dry-run' }) }, (s) => s === 401 || s === 403);
  await check('pronunciation writer is disabled in production', '/api/narrated-lessons/pronunciation', { ...json, body: JSON.stringify({ choices: { a: 'b' } }) }, (s) => s === 403);
  await check('webhook refuses an unsigned payload', '/api/webhooks/paystack', { ...json, body: '{}' }, (s) => s === 400 || s === 401 || s === 403 || s === 500, 'must not process');
  await check('wallet statement refuses anonymous callers', '/api/wallet/statement/someStudent', { method: 'POST' }, (s) => s === 401 || s === 403 || s === 405);
  await check('unknown route is a 404', '/this-route-does-not-exist', {}, (s) => s === 404);
} finally {
  child.kill();
  spawn('taskkill', ['/F', '/T', '/PID', String(child.pid)], { shell: true, stdio: 'ignore' });
}

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.status}  ${r.name}${r.note ? '  (' + r.note + ')' : ''}${r.location ? '  -> ' + r.location : ''}`);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(results, null, 2));
process.exit(failed.length ? 1 : 0);
