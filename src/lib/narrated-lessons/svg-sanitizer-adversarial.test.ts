// @vitest-environment jsdom
/**
 * Additional adversarial battery for the SVG sanitizer (comprehensive audit). These vectors are NOT in
 * svg-sanitizer.test.ts. A deterministic mutation fuzzer then asserts no dangerous construct ever survives.
 */
import { describe, expect, it } from 'vitest';
import { sanitizeSvg } from './svg-sanitizer';

const clean = (svg: string): string => {
  const out: any = sanitizeSvg(svg);
  return typeof out === 'string' ? out : (out?.svg ?? out?.sanitized ?? String(out ?? ''));
};

/**
 * Inspect the sanitized output as a real DOM, not with string regexes: text such as `javascript:` or ` onload="x()"`
 * that survives only as an inert TEXT NODE is harmless and must not count. Only live elements/attributes matter.
 */
const dangerous = (out: string): string[] => {
  const hits: string[] = [];
  const doc = new DOMParser().parseFromString(`<!doctype html><body>${out}`, 'text/html');
  const BAD_ELEMENTS = new Set(['script', 'iframe', 'object', 'embed', 'foreignobject', 'link', 'meta', 'base', 'form', 'math', 'template', 'animate', 'set', 'animatetransform', 'animatemotion', 'noscript', 'style', 'image', 'use']);
  const URL_ATTRS = ['href', 'xlink:href', 'src', 'action', 'formaction', 'data', 'srcdoc'];
  doc.body.querySelectorAll('*').forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (BAD_ELEMENTS.has(tag)) hits.push(`element <${tag}>`);
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.toLowerCase().replace(/[\s\u0000-\u001f]+/g, '');
      if (name.startsWith('on')) hits.push(`handler ${name}`);
      if (URL_ATTRS.includes(name) && /^(javascript|vbscript|data:text\/html|data:image\/svg)/.test(value)) hits.push(`dangerous ${name}`);
      if (URL_ATTRS.includes(name) && /^(https?:)?\/\//.test(value)) hits.push(`external ${name}`);
      if (name === 'style' && /expression\(|behavior:|-moz-binding|url\(/.test(value)) hits.push('dangerous inline style');
      if (name === 'filter' && /url\(\s*['"]?(https?:)?\/\//.test(value)) hits.push('external filter');
    }
  });
  return hits;
};

const vectors: Array<[string, string]> = [
  ['tab-split javascript: URL', '<svg viewBox="0 0 10 10"><a href="java\tscript:alert(1)"><text>x</text></a></svg>'],
  ['newline-split javascript: URL', '<svg viewBox="0 0 10 10"><a xlink:href="jav&#x0A;ascript:alert(1)"><text>x</text></a></svg>'],
  ['xlink:href javascript on <a>', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10"><a xlink:href="javascript:alert(1)"><rect width="5" height="5"/></a></svg>'],
  ['data:image/svg+xml in <use>', '<svg viewBox="0 0 10 10"><use href="data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+"/></svg>'],
  ['data:text/html in <image>', '<svg viewBox="0 0 10 10"><image href="data:text/html,<script>alert(1)</script>"/></svg>'],
  ['animate href to javascript:', '<svg viewBox="0 0 10 10"><a href="#"><animate attributeName="href" values="javascript:alert(1)"/><text>x</text></a></svg>'],
  ['set onclick', '<svg viewBox="0 0 10 10"><rect width="5" height="5"><set attributeName="onclick" to="alert(1)"/></rect></svg>'],
  ['iframe srcdoc', '<svg viewBox="0 0 10 10"><iframe srcdoc="<script>alert(1)</script>"></iframe></svg>'],
  ['object/embed', '<svg viewBox="0 0 10 10"><object data="https://evil.example/x"></object><embed src="https://evil.example/y"/></svg>'],
  ['link stylesheet', '<svg viewBox="0 0 10 10"><link rel="stylesheet" href="https://evil.example/a.css"/><rect width="5" height="5"/></svg>'],
  ['CSS expression/behavior', '<svg viewBox="0 0 10 10"><rect style="width:expression(alert(1));behavior:url(#x);-moz-binding:url(https://evil.example/x)" width="5" height="5"/></svg>'],
  ['CDATA script', '<svg viewBox="0 0 10 10"><![CDATA[<script>alert(1)</script>]]><rect width="5" height="5"/></svg>'],
  ['mXSS via noscript/style', '<svg viewBox="0 0 10 10"><noscript><p title="</noscript><img src=x onerror=alert(1)>"></noscript></svg>'],
  ['mXSS math/mglyph', '<svg viewBox="0 0 10 10"><math><mtext><table><mglyph><style><img src=x onerror=alert(1)></style></mglyph></table></mtext></math></svg>'],
  ['template element', '<svg viewBox="0 0 10 10"><template><script>alert(1)</script></template></svg>'],
  ['form action javascript', '<svg viewBox="0 0 10 10"><foreignObject><form action="javascript:alert(1)"><input type="submit"/></form></foreignObject></svg>'],
  ['uppercase tags and attrs', '<SVG viewBox="0 0 10 10"><SCRIPT>alert(1)</SCRIPT><RECT ONCLICK="x()" width="5" height="5"/></SVG>'],
  ['null byte in handler name', '<svg viewBox="0 0 10 10"><rect on\u0000click="alert(1)" width="5" height="5"/></svg>'],
  ['external image via style url()', '<svg viewBox="0 0 10 10"><rect style="fill:url(//evil.example/x.svg#a);background:url(https://evil.example/p.png)" width="5" height="5"/></svg>'],
  ['filter with external feImage', '<svg viewBox="0 0 10 10"><filter id="f"><feImage href="https://evil.example/i.png"/></filter><rect filter="url(#f)" width="5" height="5"/></svg>'],
];

describe('SVG sanitizer — extra adversarial vectors', () => {
  for (const [name, payload] of vectors) {
    it(`neutralises: ${name}`, () => {
      const out = clean(payload);
      expect(dangerous(out), `output was: ${out}`).toEqual([]);
    });
  }

  it('keeps ordinary educational shapes intact', () => {
    const out = clean('<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="#0d9488"/><text x="10" y="90">Nucleus</text></svg>');
    expect(out).toContain('<circle');
    expect(out).toContain('Nucleus');
  });

  it('deterministic mutation fuzzing: 1,500 spliced payloads never leave a dangerous construct', () => {
    let seed = 20260528;
    const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
    const pieces = [
      '<script>alert(1)</script>', ' onload="x()"', ' onclick="x()"', '<a href="javascript:alert(1)">', '</a>',
      '<foreignObject><img src=x onerror=alert(1)></foreignObject>', '<iframe src="javascript:alert(1)"></iframe>',
      '<style>@import "https://evil.example/a.css";</style>', ' style="background:url(https://evil.example/p)"',
      '<use href="https://evil.example/x#a"/>', '<image href="data:text/html,<script>1</script>"/>',
      '<animate attributeName="href" values="javascript:alert(1)"/>', '<set attributeName="onclick" to="x()"/>',
      '<math><mtext><style><img src=x onerror=alert(1)></style></mtext></math>', '<![CDATA[<script>x</script>]]>',
      '<rect width="5" height="5"/>', '<g>', '</g>', '<text>t</text>', '<circle r="2"/>', '&#x6A;avascript:', '\t', '\n', '\u0000',
    ];
    const failures: string[] = [];
    for (let i = 0; i < 1500; i++) {
      const n = 3 + Math.floor(rnd() * 8);
      let body = '';
      for (let k = 0; k < n; k++) body += pieces[Math.floor(rnd() * pieces.length)];
      const payload = `<svg viewBox="0 0 10 10"${rnd() < 0.3 ? ' onload="x()"' : ''}>${body}</svg>`;
      const out = clean(payload);
      const hits = dangerous(out);
      if (hits.length) failures.push(`${hits.join(',')} :: IN=${JSON.stringify(payload).slice(0, 700)} OUT=${JSON.stringify(out).slice(0, 700)}`);
    }
    if (process.env.FUZZ_DUMP) require('node:fs').writeFileSync(process.env.FUZZ_DUMP, failures.join('\n'));
    expect(failures.slice(0, 5)).toEqual([]);
  });
});
