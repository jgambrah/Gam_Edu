// Starts the synthetic victim/attacker harness for the Python sandbox end-to-end tests (Playwright webServer).
// 1. bundles the REAL src/lib/python-runner.ts (esbuild) into the harness folder, 2. starts the servers.
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const esbuild = require(path.join(root, 'node_modules/esbuild'));

await esbuild.build({
  entryPoints: [path.join(root, 'src/lib/python-runner.ts')],
  bundle: true,
  format: 'iife',
  globalName: 'PR',
  outfile: path.join(here, 'python-runner.sandbox.bundle.js'),
  logLevel: 'warning',
});
console.log('bundled python-runner.ts');
require(path.join(here, 'server.js')); // listens on 4173 (victim), 4174 (attacker), 4175 (attacker log)
