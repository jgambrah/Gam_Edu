// Verifies that installed dependency versions match package-lock.json (reproducible installs).
// Exit code 1 on any mismatch or missing package. Run after `npm ci`; locally it detects drifted node_modules.
// Usage: node scripts/audit/check-lockfile-sync.mjs [--direct-only]
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
const directOnly = process.argv.includes('--direct-only');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const direct = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})]);

const mismatches = [];
const missing = [];
let checked = 0;
for (const [key, meta] of Object.entries(lock.packages ?? {})) {
  if (!key.startsWith('node_modules/') || !meta.version) continue;
  if (meta.optional && meta.os) continue; // platform-specific optional binaries
  const name = key.replace(/^.*node_modules\//, '');
  if (directOnly && !(key === `node_modules/${name}` && direct.has(name))) continue;
  const file = path.join(root, key, 'package.json');
  if (!fs.existsSync(file)) {
    if (!meta.optional && !meta.peer && !meta.dev) missing.push(`${key}@${meta.version}`);
    continue;
  }
  checked++;
  const installed = JSON.parse(fs.readFileSync(file, 'utf8')).version;
  if (installed !== meta.version) mismatches.push(`${key}: lock ${meta.version} != installed ${installed}`);
}

console.log(`checked ${checked} installed packages against package-lock.json`);
if (missing.length) console.log(`missing (${missing.length}):\n  ` + missing.slice(0, 20).join('\n  '));
if (mismatches.length) console.log(`MISMATCHES (${mismatches.length}):\n  ` + mismatches.slice(0, 40).join('\n  '));
if (mismatches.length || missing.length) {
  console.error('Dependency drift detected: run `npm ci` to reproduce the locked install.');
  process.exit(1);
}
console.log('OK: installed versions match the lockfile.');
