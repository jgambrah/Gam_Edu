/**
 * Cross-browser verification of the REAL python-runner.ts sandbox against a synthetic victim and attacker (audit D-035).
 * Safe outcomes in every browser are either (a) Python runs inside the sandbox and every probe is blocked, or (b) Python is
 * refused with an explicit message. An insecure third outcome (a probe succeeds, or the attacker server is contacted) fails.
 */
import { expect, test } from '@playwright/test';

const ATTACKER_LOG = 'http://localhost:4175/';

test.beforeEach(async ({ page, request }) => {
  await request.get(`${ATTACKER_LOG}reset`);
  await page.goto('/e2e.html');
  await page.evaluate(() => (window as any).seedState());
});

const attackerHits = async (request: any) => (await (await request.get(ATTACKER_LOG)).json()) as any[];

test('credential isolation: every capability probe is blocked and the attacker never hears from the sandbox', async ({ page, request, browserName }, info) => {
  const first = await page.evaluate(async () => {
    const r = await (window as any).PR.runPython('print("boot")', { timeoutMs: 90_000 });
    return { ok: r.ok, output: r.output, error: r.error };
  });
  test.info().annotations.push({ type: 'python-started', description: String(first.ok) });
  if (!first.ok) {
    // Fail-safe branch: unsupported browser must refuse, never run unsafely.
    expect(first.error).toMatch(/disabled|could not start|too long|safe/i);
    expect(await attackerHits(request)).toHaveLength(0);
    return;
  }
  const result = await page.evaluate(async () => {
    const r = await (window as any).PR.runPython((window as any).PROBE_SRC, { timeoutMs: 90_000 });
    return { ok: r.ok, output: r.output, error: r.error };
  });
  expect(result.ok, result.error).toBe(true);
  const probes = JSON.parse(result.output.trim().split('\n').pop()!) as Record<string, string>;
  info.attach('probe-results.json', { body: JSON.stringify({ browserName, probes }, null, 2), contentType: 'application/json' });

  for (const key of ['same_origin_api_with_cookie', 'cross_origin_exfil', 'indexedDB_read_auth_record', 'cache_read', 'xhr_sync_same_origin']) {
    expect(probes[key], `${key} must be blocked`).toMatch(/^BLOCKED\/ERR/);
  }
  expect(JSON.stringify(probes)).not.toMatch(/SYNTHETIC-(SESSION|REFRESH)|CACHE-SECRET|LS-SECRET/);
  expect(probes.websocket).not.toMatch(/readyState=1\b/); // never OPEN
  expect(probes.dynamic_import).not.toMatch(/resolved/);
  expect(await attackerHits(request)).toHaveLength(0);
});

test('message source validation: forged results from the page itself are ignored', async ({ page }) => {
  const out = await page.evaluate(async () => {
    const PR = (window as any).PR;
    const run = PR.runPython('import time\ntime.sleep(2)\nprint("REAL")', { timeoutMs: 90_000 });
    // Forge a "result" for the pending run id and for neighbours, from the page (not from the sandbox frame).
    for (let id = 1; id <= 30; id++) window.postMessage({ type: 'result', id, ok: true, output: 'FORGED', passed: true }, '*');
    const r = await run;
    return { ok: r.ok, output: r.output };
  });
  expect(out.ok).toBe(true);
  expect(out.output.trim()).toBe('REAL');
});

test('functional: print, input (strict and legacy), validation, error line numbers, isolation between runs', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const PR = (window as any).PR;
    const o: Record<string, any> = {};
    o.print = (await PR.runPython('print("hello pupils")', { timeoutMs: 90_000 })).output.trim();
    o.strict = (await PR.runPython('n=int(input())\nprint(n*2)', { stdin: '21', strictInput: true })).output.trim();
    o.strictTwo = (await PR.runPython('a=input()\nb=input()\nprint(a+"|"+b)', { stdin: 'x\ny', strictInput: true })).output.trim();
    const eof = await PR.runPython('input()', { strictInput: true });
    o.eof = { ok: eof.ok, err: eof.error };
    o.legacy = (await PR.runPython('n=int(input())\nprint(n*2)', { stdin: '21' })).output.trim();
    o.validTrue = (await PR.runPython('x = 5', { validation: 'x == 5' })).passed;
    o.validFalse = (await PR.runPython('x = 4', { validation: 'x == 5' })).passed;
    const ne = await PR.runPython('a = 1\nprint(b)');
    o.nameError = ne.error;
    await PR.runPython('secret_value = 99');
    o.leak = (await PR.runPython('print(secret_value)')).error;
    return o;
  });
  expect(r.print).toBe('hello pupils');
  expect(r.strict).toBe('42');
  expect(r.strictTwo).toBe('x|y');
  expect(r.eof.ok).toBe(false);
  expect(r.eof.err).toMatch(/EOF/);
  expect(r.legacy).toBe('42');
  expect(r.validTrue).toBe(true);
  expect(r.validFalse).toBe(false);
  expect(r.nameError).toMatch(/NameError.*line 2/);
  expect(r.leak).toMatch(/NameError/);
});

test('resources: infinite loop stopped and runtime restarts; output flood capped; memory bomb recovers; oversize refused', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const PR = (window as any).PR;
    const o: Record<string, any> = {};
    const loop = await PR.runPython('while True:\n    pass', { timeoutMs: 1500 });
    o.loopTimedOut = loop.timedOut === true;
    o.afterLoop = (await PR.runPython('print("alive again")', { timeoutMs: 90_000 })).output.trim();
    const flood = await PR.runPython('for i in range(3000000):\n    print("x"*60)', { timeoutMs: 5000 });
    o.floodChars = flood.output.length;
    const bomb = await PR.runPython('x = bytearray(3 * 10**9)\nprint(len(x))', { timeoutMs: 30_000 });
    o.bombPrintedHuge = /^3000000000/.test(bomb.output.trim());
    o.afterBomb = (await PR.runPython('print("recovered")', { timeoutMs: 90_000 })).output.trim();
    const big = await PR.runPython('x = 1\n'.repeat(30000));
    o.oversize = big.error;
    return o;
  });
  expect(r.loopTimedOut).toBe(true);
  expect(r.afterLoop).toBe('alive again');
  expect(r.floodChars).toBeLessThanOrEqual(200_200);
  expect(r.bombPrintedHuge).toBe(false);
  expect(r.afterBomb).toBe('recovered');
  expect(r.oversize).toMatch(/too long/);
});

test('educational functionality: matplotlib figure and pygame stub work inside the sandbox', async ({ page }) => {
  test.slow();
  const r = await page.evaluate(async () => {
    const PR = (window as any).PR;
    const plot = await PR.runPython('import matplotlib.pyplot as plt\nplt.plot([1,2,3],[1,4,9])', { timeoutMs: 120_000 });
    const pg = await PR.runPython('import pygame\nprint("pygame ok")', { timeoutMs: 60_000 });
    return { plotOk: plot.ok, png: typeof plot.image === 'string' && plot.image.startsWith('iVBOR') && plot.image.length > 1000, pygame: pg.output.trim() };
  });
  expect(r.plotOk).toBe(true);
  expect(r.png).toBe(true);
  expect(r.pygame).toBe('pygame ok');
});
