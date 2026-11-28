// Builds a development-only browser harness that renders the REAL NarratedLessonPlayer (and therefore the real engines)
// from the preview fixtures in public/preview-fixtures, without Next.js, Firebase auth or the release gate.
// It verifies component rendering/interaction in real browsers; it does NOT exercise routing, middleware or the gate
// (those are covered by unit tests). next/dynamic and next/link are shimmed; every other import is the production source.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const esbuild = require(path.join(root, 'node_modules/esbuild'));
const outdir = path.join(here, 'dist');
fs.rmSync(outdir, { recursive: true, force: true });

const shimPlugin = {
  name: 'shims',
  setup(build) {
    build.onResolve({ filter: /^@\// }, (args) => {
      const base = path.join(root, 'src', args.path.slice(2));
      for (const ext of ['', '.ts', '.tsx', '/index.ts', '/index.tsx', '.json']) {
        if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) return { path: base + ext };
      }
      return undefined;
    });
    build.onResolve({ filter: /^next\/dynamic$/ }, () => ({ path: path.join(here, 'shims/dynamic.tsx') }));
    build.onResolve({ filter: /^next\/link$/ }, () => ({ path: path.join(here, 'shims/link.tsx') }));
  },
};

await esbuild.build({
  entryPoints: [path.join(here, 'entry.tsx')],
  bundle: true,
  splitting: true,
  format: 'esm',
  outdir,
  jsx: 'automatic',
  minify: true,
  sourcemap: false,
  target: 'es2020',
  define: { 'process.env.NODE_ENV': '"production"', 'process.env.NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED': '"false"' },
  loader: { '.json': 'json' },
  plugins: [shimPlugin],
  logLevel: 'warning',
  metafile: true,
}).then((r) => {
  fs.writeFileSync(path.join(outdir, 'metafile.json'), JSON.stringify(r.metafile));
  console.log('harness built:', Object.keys(r.metafile.outputs).length, 'files');
});
