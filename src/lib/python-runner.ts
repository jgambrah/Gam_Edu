/**
 * Runs pupils' Python in the browser (Pyodide) inside a Web Worker.
 *
 * - Free: no AI credits, no server, no Firestore reads.
 * - Real results: the output is what Python actually prints.
 * - Safe for the page: a never-ending loop is stopped after a time limit
 *   (the worker is thrown away and a fresh one is started), so the tab never freezes.
 * - Each run starts with a clean set of variables, so an old run cannot make a new answer "pass".
 */

const PYODIDE_VERSION = '0.25.1';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

export type PythonRunOptions = {
  /** Lines fed to input(), one per call. When they run out, input() gets an empty line... then EOF. */
  stdin?: string;
  /** A Python expression checked after the program runs, in the program's own variables. */
  validation?: string;
  /** Folder to start in (os.getcwd()). */
  cwd?: string;
  /** Stop the program after this long (milliseconds), not counting package downloads. */
  timeoutMs?: number;
};

export type PythonRunResult = {
  ok: boolean;
  /** Everything the program printed (stdout + stderr), newline-joined. */
  output: string;
  /** A short, pupil-friendly error ("NameError: name 'x' is not defined (line 2)"). */
  error?: string;
  /** Result of `validation` (null when none was given or the program failed). */
  passed: boolean | null;
  /** PNG (base64) of the current Matplotlib figure, if the program drew one. */
  image: string | null;
  timedOut?: boolean;
};

const WORKER_SOURCE = `
importScripts('${PYODIDE_BASE}pyodide.js');
let py = null;
const ready = loadPyodide({ indexURL: '${PYODIDE_BASE}' }).then(p => { py = p; postMessage({ type: 'ready' }); })
  .catch(e => { postMessage({ type: 'failed', error: String(e && e.message || e) }); });

function friendlyError(msg) {
  const text = String(msg || '');
  const lines = text.split('\\n').map(l => l.trimEnd()).filter(Boolean);
  let lineNo = null;
  for (const l of lines) { const m = l.match(/File "<exec>", line (\\d+)/); if (m) lineNo = m[1]; }
  const last = lines.length ? lines[lines.length - 1] : text;
  return lineNo ? last + ' (line ' + lineNo + ')' : last;
}

onmessage = async (e) => {
  const msg = e.data || {};
  if (msg.type !== 'run') return;
  const { id, code, stdin, validation, cwd } = msg;
  await ready;
  if (!py) { postMessage({ type: 'result', id, ok: false, output: '', error: 'Python could not start. Check your internet connection and reload.', passed: null, image: null }); return; }
  const out = [];
  py.setStdout({ batched: s => out.push(s) });
  py.setStderr({ batched: s => out.push(s) });
  const inputs = (stdin || '').split('\\n');
  let next = 0;
  py.setStdin({ stdin: () => (next < inputs.length ? inputs[next++] : undefined) });
  let ns = null;
  try {
    await py.loadPackagesFromImports(code);
    const usesPlot = /matplotlib/.test(code);
    if (validation) await py.loadPackagesFromImports(validation);
    postMessage({ type: 'started', id });
    ns = py.globals.get('dict')();
    if (usesPlot) await py.runPythonAsync("import matplotlib\\nmatplotlib.use('Agg')\\nimport matplotlib.pyplot as plt\\nplt.close('all')\\nplt.show = lambda *a, **k: None", { globals: ns });
    py.runPython('import os\\ntry:\\n    os.chdir(' + JSON.stringify(cwd || '/home/pyodide') + ')\\nexcept Exception:\\n    pass', { globals: ns });
    await py.runPythonAsync(code, { globals: ns });
    let passed = null;
    if (validation) {
      try {
        const r = py.runPython(validation, { globals: ns });
        passed = !!(r && typeof r === 'object' && r.toJs ? r.toJs() : r);
        if (r && typeof r === 'object' && r.destroy) r.destroy();
      } catch (ve) { passed = false; }
    }
    let image = null;
    if (usesPlot) {
      image = py.runPython("import io, base64\\nimport matplotlib.pyplot as plt\\n_gam_buf = io.BytesIO()\\nif plt.get_fignums():\\n    plt.savefig(_gam_buf, format='png', bbox_inches='tight')\\nbase64.b64encode(_gam_buf.getvalue()).decode() if _gam_buf.getvalue() else ''", { globals: ns }) || null;
    }
    postMessage({ type: 'result', id, ok: true, output: out.join('\\n'), passed, image });
  } catch (err) {
    postMessage({ type: 'result', id, ok: false, output: out.join('\\n'), error: friendlyError(err && err.message || err), passed: null, image: null });
  } finally {
    try { if (ns) ns.destroy(); } catch (_) {}
  }
};
`;

type Pending = {
  resolve: (r: PythonRunResult) => void;
  timeoutMs: number;
  timer: ReturnType<typeof setTimeout> | null;
};

let worker: Worker | null = null;
let readyPromise: Promise<void> | null = null;
let readyListeners: ((ok: boolean) => void)[] = [];
let runSeq = 0;
const pending = new Map<number, Pending>();

function startWorker() {
  const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const w = new Worker(url);
  URL.revokeObjectURL(url);
  readyPromise = new Promise<void>((resolve, reject) => {
    w.onmessage = (e: MessageEvent) => {
      const m = e.data || {};
      if (m.type === 'ready') { resolve(); readyListeners.forEach(f => f(true)); return; }
      if (m.type === 'failed') { reject(new Error(m.error)); readyListeners.forEach(f => f(false)); return; }
      const p = pending.get(m.id);
      if (!p) return;
      if (m.type === 'started') {
        // The clock starts once packages are downloaded.
        p.timer = setTimeout(() => stopRun(m.id), p.timeoutMs);
        return;
      }
      if (m.type === 'result') {
        if (p.timer) clearTimeout(p.timer);
        pending.delete(m.id);
        p.resolve({ ok: !!m.ok, output: m.output || '', error: m.error, passed: m.passed ?? null, image: m.image || null });
      }
    };
    w.onerror = (ev) => {
      ev.preventDefault?.();
      reject(new Error('Python worker failed to load'));
      readyListeners.forEach(f => f(false));
    };
  });
  readyPromise.catch(() => {});
  worker = w;
}

function stopRun(id: number) {
  const p = pending.get(id);
  if (!p) return;
  pending.delete(id);
  // The only way to stop a running Python loop is to end the worker; start a fresh one for next time.
  try { worker?.terminate(); } catch {}
  worker = null;
  readyPromise = null;
  p.resolve({
    ok: false, output: '', passed: null, image: null, timedOut: true,
    error: 'Your program ran for too long and was stopped. Is there a loop that never ends?',
  });
  pending.forEach(other => { if (other.timer) clearTimeout(other.timer); other.resolve({ ok: false, output: '', passed: null, image: null, error: 'Stopped.' }); });
  pending.clear();
}

/** Start loading Python in the background. Resolves when ready; rejects if it cannot load. */
export function preparePython(): Promise<void> {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') return Promise.reject(new Error('Python needs a browser'));
  if (!worker || !readyPromise) startWorker();
  return readyPromise!;
}

/** Called with true/false each time a (re)started Python finishes loading. */
export function onPythonReady(fn: (ok: boolean) => void) {
  readyListeners.push(fn);
  return () => { readyListeners = readyListeners.filter(f => f !== fn); };
}

export async function runPython(code: string, opts: PythonRunOptions = {}): Promise<PythonRunResult> {
  try {
    await preparePython();
  } catch {
    return { ok: false, output: '', passed: null, image: null, error: 'Python could not start. Check your internet connection and reload the page.' };
  }
  const id = ++runSeq;
  return new Promise<PythonRunResult>((resolve) => {
    pending.set(id, { resolve, timeoutMs: opts.timeoutMs ?? 8000, timer: null });
    worker!.postMessage({ type: 'run', id, code, stdin: opts.stdin ?? '', validation: opts.validation, cwd: opts.cwd });
  });
}

/** Compare program output with the goal: same lines, ignoring trailing spaces and blank lines at the ends. */
export function outputMatches(actual: string, expected: string): boolean {
  const norm = (s: string) => s.replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();
  const a = norm(actual), e = norm(expected);
  if (a === e) return true;
  // Forgive spacing differences only ("Hello  Python" vs "Hello Python"); never extra or missing text.
  return a.replace(/\s+/g, ' ') === e.replace(/\s+/g, ' ');
}
