// @vitest-environment jsdom
/**
 * Regression tests for the Python sandbox (audit D-010). The real browser behaviour was verified with a synthetic
 * victim/attacker harness; these tests pin the invariants so the isolation cannot be silently weakened.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  PYTHON_SANDBOX_CSP,
  PYTHON_SANDBOX_LIMITS,
  PYTHON_WORKER_SOURCE_FOR_TESTS,
  canRunPythonSafely,
  preparePython,
  resetPythonSandbox,
  runPython,
} from './python-runner';

afterEach(() => {
  resetPythonSandbox();
  vi.unstubAllGlobals();
});

describe('python sandbox isolation invariants', () => {
  it('is disabled (fails closed) when the browser cannot provide workers', () => {
    expect(typeof (globalThis as any).Worker).toBe('undefined'); // jsdom has no Worker
    expect(canRunPythonSafely()).toBe(false);
  });

  it('runs inside an iframe with sandbox="allow-scripts" and NEVER allow-same-origin', async () => {
    vi.stubGlobal('Worker', class {}); // jsdom has no Worker; the real one is exercised in the browser harness
    // jsdom may not implement the sandbox/srcdoc IDL properties; reflect them to attributes like a real browser.
    const proto = HTMLIFrameElement.prototype as any;
    if (!('sandbox' in proto)) {
      Object.defineProperty(proto, 'sandbox', { configurable: true, get() { return this.getAttribute('sandbox') ?? ''; } });
    }
    if (!('srcdoc' in proto)) {
      Object.defineProperty(proto, 'srcdoc', {
        configurable: true,
        get() { return this.getAttribute('srcdoc') ?? ''; },
        set(v: string) { this.setAttribute('srcdoc', v); },
      });
    }
    expect(canRunPythonSafely()).toBe(true);
    void preparePython().catch(() => {}); // boot cannot finish in jsdom; we only inspect the frame
    const frame = document.querySelector('iframe[title="Python sandbox"]') as HTMLIFrameElement;
    expect(frame).toBeTruthy();
    expect(frame.getAttribute('sandbox')).toBe('allow-scripts');
    const tokens = (frame.getAttribute('sandbox') ?? '').split(/\s+/);
    for (const forbidden of ['allow-same-origin', 'allow-top-navigation', 'allow-popups', 'allow-forms', 'allow-modals', 'allow-downloads']) {
      expect(tokens).not.toContain(forbidden);
    }
    expect(frame.getAttribute('referrerpolicy')).toBe('no-referrer');
    expect(frame.srcdoc).toContain('Content-Security-Policy');
    expect(frame.srcdoc).toContain("worker-src blob:");
  });

  it('CSP only lets the sandbox talk to the Pyodide CDN path', () => {
    const csp = PYTHON_SANDBOX_CSP;
    expect(csp).toContain("default-src 'none'");
    expect(csp).toMatch(/connect-src https:\/\/cdn\.jsdelivr\.net\/pyodide\/(;|$)/);
    expect(csp).not.toMatch(/connect-src[^;]*(\*|'self'|http:|ws:|wss:)/);
    expect(csp).toMatch(/worker-src blob:(;|$)/);
    expect(csp).not.toMatch(/frame-ancestors|allow-same-origin/);
    expect(csp).toContain("form-action 'none'");
    expect(csp).toContain("base-uri 'none'");
  });

  it('the worker refuses to start unless it has an opaque origin (fail closed)', () => {
    expect(PYTHON_WORKER_SOURCE_FOR_TESTS).toMatch(/if \(self\.origin !== 'null'\)/);
    expect(PYTHON_WORKER_SOURCE_FOR_TESTS.indexOf("self.origin !== 'null'")).toBeLessThan(PYTHON_WORKER_SOURCE_FOR_TESTS.indexOf('importScripts('));
  });

  it('refuses oversized code, stdin and validation before anything runs', async () => {
    const L = PYTHON_SANDBOX_LIMITS;
    const big = await runPython('x'.repeat(L.maxCodeChars + 1));
    expect(big.ok).toBe(false);
    expect(big.error).toMatch(/too long/);
    expect((await runPython('print(1)', { stdin: 'x'.repeat(L.maxStdinChars + 1) })).ok).toBe(false);
    expect((await runPython('print(1)', { validation: 'x'.repeat(L.maxValidationChars + 1) })).ok).toBe(false);
    expect(document.querySelector('iframe[title="Python sandbox"]')).toBeNull(); // nothing was even started
  });
});

describe('Python bootstrap text sent into the runtime (audit: strict-input bug)', () => {
  it('the strict-input shim is valid Python: no raw CR/LF inside string literals, and rstrip gets the escape text', () => {
    const m = /py\.runPython\('(import sys\\ndef input\(prompt=""\):[^']*)'/.exec(PYTHON_WORKER_SOURCE_FOR_TESTS);
    expect(m, 'strict-input shim not found in worker source').toBeTruthy();
    // Decode exactly as the worker's JavaScript engine would, to get the Python source Pyodide receives.
    const python = new Function(`return '${m![1]}';`)() as string;
    expect(python).toContain('line.rstrip("\\r\\n")'); // literal backslash-r backslash-n inside a Python string
    for (const line of python.split('\n')) {
      expect(line.includes('\r'), `raw carriage return in Python line: ${JSON.stringify(line)}`).toBe(false);
      const quotes = (line.match(/(?<!\\)"/g) ?? []).length;
      expect(quotes % 2, `unbalanced quotes in Python line: ${line}`).toBe(0);
    }
  });
});
