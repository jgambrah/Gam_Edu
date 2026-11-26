import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, it, expect } from 'vitest';

const REPO_ROOT = process.cwd();
const SRC_ROOT = path.join(REPO_ROOT, 'src');

const CORE_MANAGEMENT_ENTRYPOINTS = [
  'src/app/dashboard/finance',
  'src/app/dashboard/financials',
  'src/app/dashboard/accounts',
  'src/app/dashboard/attendance',
  'src/app/dashboard/admin',
  'src/app/dashboard/students',
  'src/app/dashboard/staff',
  'src/app/dashboard/payroll',
  'src/app/dashboard/layout.tsx',
];

const ENRICHMENT_ENGINE_PATH_RE =
  /[\\/](?:narrated-lessons|boolean-logic|sql-practice)[\\/]|[\\/](?:pseudocode-runner|python-runner|python-ch8-missions|python-academy-data)\.(?:ts|tsx)$/;

const IMPORT_SPECIFIER_RE =
  /(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function collectTsFiles(targetPath: string): string[] {
  const abs = path.resolve(REPO_ROOT, targetPath);
  if (!fs.existsSync(abs)) return [];
  const stat = fs.statSync(abs);
  if (stat.isFile()) return /\.(ts|tsx)$/.test(abs) ? [abs] : [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const full = path.join(abs, entry.name);
    if (entry.isDirectory()) out.push(...collectTsFiles(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function resolveImportToFile(fromFile: string, specifier: string): string | null {
  let base: string | null = null;
  if (specifier.startsWith('@/')) {
    base = path.join(SRC_ROOT, specifier.slice(2));
  } else if (specifier.startsWith('.')) {
    base = path.resolve(path.dirname(fromFile), specifier);
  } else {
    return null; // external npm package
  }

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  for (const cand of candidates) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) return cand;
  }
  return null;
}

function extractSpecifiers(filePath: string): string[] {
  const src = fs.readFileSync(filePath, 'utf8');
  const specs: string[] = [];
  let match: RegExpExecArray | null;
  IMPORT_SPECIFIER_RE.lastIndex = 0;
  while ((match = IMPORT_SPECIFIER_RE.exec(src)) !== null) {
    const spec = match[1] || match[2];
    if (spec) specs.push(spec);
  }
  return specs;
}

describe('GAM EDU Modular-Monolith Transitive Dependency Boundaries', () => {
  it('ensures core school management routes and dashboard layout have ZERO direct or transitive imports of student-enrichment engines', () => {
    const entryFiles = CORE_MANAGEMENT_ENTRYPOINTS.flatMap(collectTsFiles);
    expect(entryFiles.length).toBeGreaterThan(0);

    const violations: string[] = [];
    const globalVisited = new Set<string>();

    for (const entry of entryFiles) {
      const queue: Array<{ file: string; chain: string[] }> = [
        { file: entry, chain: [path.relative(REPO_ROOT, entry)] },
      ];
      const localVisited = new Set<string>([entry]);

      while (queue.length > 0) {
        const current = queue.shift()!;
        const specs = extractSpecifiers(current.file);
        for (const spec of specs) {
          const resolved = resolveImportToFile(current.file, spec);
          if (!resolved) continue;
          const relResolved = path.relative(REPO_ROOT, resolved);

          if (ENRICHMENT_ENGINE_PATH_RE.test(resolved)) {
            violations.push(`${current.chain.join(' -> ')} -> ${relResolved}`);
            continue;
          }

          if (!localVisited.has(resolved) && !globalVisited.has(resolved)) {
            localVisited.add(resolved);
            globalVisited.add(resolved);
            queue.push({ file: resolved, chain: [...current.chain, relResolved] });
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('ensures NarratedLessonPlayer lazy-loads heavy interactive labs and reviewer tools via next/dynamic', () => {
    const playerPath = path.resolve(REPO_ROOT, 'src/components/narrated-lessons/NarratedLessonPlayer.tsx');
    const src = fs.readFileSync(playerPath, 'utf8');
    const forbiddenStaticImports = [
      /^\s*import\s+[^;]*from\s+['"]\.\/InlineCodePlayground['"]/m,
      /^\s*import\s+[^;]*from\s+['"]\.\/BooleanCircuitLab['"]/m,
      /^\s*import\s+[^;]*from\s+['"]\.\/BooleanIntroInteractive['"]/m,
      /^\s*import\s+[^;]*from\s+['"]\.\/PointerCueEditor['"]/m,
    ];
    for (const re of forbiddenStaticImports) {
      expect(src).not.toMatch(re);
    }
    expect(src).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/InlineCodePlayground['"]\)/);
    expect(src).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/BooleanCircuitLab['"]\)/);
    expect(src).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/BooleanIntroInteractive['"]\)/);
    expect(src).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/PointerCueEditor['"]\)/);
  });

  it('ensures InteractiveEngineRegistry lazy-loads all interactive engines via next/dynamic', () => {
    const registryPath = path.resolve(
      REPO_ROOT,
      'src/components/narrated-lessons/InteractiveEngineRegistry.tsx',
    );
    const src = fs.readFileSync(registryPath, 'utf8');
    const forbiddenStaticImports = [
      /^\s*import\s+[^;]*from\s+['"]\.\/InlineCodePlayground['"]/m,
      /^\s*import\s+[^;]*from\s+['"]\.\/BooleanCircuitLab['"]/m,
      /^\s*import\s+[^;]*from\s+['"]\.\/construction\/ConstructionLabRouter['"]/m,
      /^\s*import\s+[^;]*from\s+['"]\.\/RuleExplorerEngine['"]/m,
      /^\s*import\s+[^;]*from\s+['"]\.\/GraphSliderEngine['"]/m,
      /^\s*import\s+[^;]*from\s+['"]\.\/ProcessStepperEngine['"]/m,
      /^\s*import\s+[^;]*from\s+['"]\.\/DiagramHotspotsEngine['"]/m,
    ];
    for (const re of forbiddenStaticImports) {
      expect(src).not.toMatch(re);
    }
    expect(src).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/InlineCodePlayground['"]\)/);
    expect(src).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/construction\/ConstructionLabRouter['"]\)/);
    expect(src).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/RuleExplorerEngine['"]\)/);
    expect(src).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/GraphSliderEngine['"]\)/);
    expect(src).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/ProcessStepperEngine['"]\)/);
    expect(src).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/DiagramHotspotsEngine['"]\)/);

    // Also verify ConstructionLabRouter independently lazy-loads every domain adapter
    const routerPath = path.resolve(
      REPO_ROOT,
      'src/components/narrated-lessons/construction/ConstructionLabRouter.tsx',
    );
    const routerSrc = fs.readFileSync(routerPath, 'utf8');
    expect(routerSrc).not.toMatch(/^\s*import\s+[^;]*from\s+['"]\.\.?\/.*Lab['"]/m);
    expect(routerSrc).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\.\/BooleanCircuitLab['"]\)/);
    expect(routerSrc).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/EquationBalancerLab['"]\)/);
    expect(routerSrc).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/ElectricalCircuitLab['"]\)/);
    expect(routerSrc).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/BioSequenceLab['"]\)/);
    expect(routerSrc).toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]\.\/DeclarativeBooleanCircuitAdapter['"]\)/);
  });
});
