import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  assertSafeSvg,
  auditSvgSecurity,
  MAX_SVG_BYTES,
  MAX_SVG_ELEMENTS,
  sanitizeSvg,
} from './svg-sanitizer';

describe('DOMPurify SVG Security Sanitizer (13 Attack Vectors + Educational Diagrams)', () => {
  it('1-12: neutralises script, event handlers, encoded URLs, namespaces, malformed SVG, mixed-case attrs, foreignObject, unsafe CSS, external refs, animations, nested SVG, and mXSS', () => {
    const attacks: Array<{ name: string; payload: string; mustNotContain: string[] }> = [
      {
        name: '1. Script injection',
        payload: '<svg viewBox="0 0 100 100"><script>alert(1)</script><rect width="40" height="40"/></svg>',
        mustNotContain: ['<script', 'alert(1)'],
      },
      {
        name: '2. Event-handler attributes',
        payload: '<svg viewBox="0 0 100 100" onload="alert(1)"><circle cx="50" cy="50" r="20" onclick="steal()"/></svg>',
        mustNotContain: ['onload', 'onclick', 'steal()'],
      },
      {
        name: '3. Encoded dangerous URLs',
        payload: '<svg viewBox="0 0 100 100"><a href="&#x6A;avascript:alert(1)"><text x="10" y="20">Hi</text></a></svg>',
        mustNotContain: ['javascript:', 'alert(1)', '<a '],
      },
      {
        name: '4. Namespace-based attacks',
        payload: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml"><xhtml:script>alert(1)</xhtml:script><rect width="20" height="20"/></svg>',
        mustNotContain: ['script', 'alert(1)'],
      },
      {
        name: '5. Malformed SVG with trailing script',
        payload: '<svg viewBox="0 0 100 100"><g><rect width="20" height="20"></g><script>alert(1)</script>',
        mustNotContain: ['<script', 'alert(1)'],
      },
      {
        name: '6. Mixed-case event attributes',
        payload: '<svg viewBox="0 0 100 100" OnLoAd="alert(1)"><rect OnMouseOver="evil()" width="20" height="20"/></svg>',
        mustNotContain: ['onload', 'onmouseover', 'evil()'],
      },
      {
        name: '7. Foreign objects with HTML',
        payload: '<svg viewBox="0 0 100 100"><foreignObject width="100" height="100"><body xmlns="http://www.w3.org/1999/xhtml"><img src="x" onerror="alert(1)"/></body></foreignObject></svg>',
        mustNotContain: ['foreignobject', 'onerror', '<img'],
      },
      {
        name: '8. Unsafe CSS in style tag and inline style',
        payload: '<svg viewBox="0 0 100 100"><style>@import url("https://evil.example/a.css");</style><rect style="fill:url(https://evil.example/x.svg#a)" width="20" height="20"/></svg>',
        mustNotContain: ['<style', '@import', 'https://evil.example'],
      },
      {
        name: '9. External <use> / <image> resources',
        payload: '<svg viewBox="0 0 100 100"><use href="https://evil.example/x.svg#p"/><image href="https://evil.example/i.png" width="50" height="50"/></svg>',
        mustNotContain: ['https://evil.example', '<image'],
      },
      {
        name: '10. Dangerous SMIL animation elements',
        payload: '<svg viewBox="0 0 100 100"><animate onbegin="alert(1)" attributeName="x"/><set attributeName="onmouseover" to="alert(1)"/><rect width="20" height="20"/></svg>',
        mustNotContain: ['<animate', '<set', 'onbegin', 'alert(1)'],
      },
      {
        name: '11. Nested <svg> with script/onload',
        payload: '<svg viewBox="0 0 100 100"><svg onload="alert(1)"><script>alert(2)</script><circle cx="10" cy="10" r="5"/></svg></svg>',
        mustNotContain: ['onload', '<script', 'alert('],
      },
      {
        name: '12. Mutation-based XSS (mXSS) via <desc>/<title> breakout',
        payload: '<svg viewBox="0 0 100 100"><desc><![CDATA[</desc><script>alert(1)</script>]]></desc><rect width="10" height="10"/></svg>',
        mustNotContain: ['<script', 'alert(1)'],
      },
    ];

    for (const tc of attacks) {
      const cleaned = sanitizeSvg(tc.payload).toLowerCase();
      for (const bad of tc.mustNotContain) {
        expect(cleaned, `${tc.name} leaked "${bad}"`).not.toContain(bad);
      }
    }

    // Verify publish-time static auditor also flags core attack classes
    expect(() => assertSafeSvg(attacks[0].payload, 'script')).toThrow(/SVG security check FAILED/);
    expect(() => assertSafeSvg(attacks[2].payload, 'encoded-url')).toThrow(/SVG security check FAILED/);
    expect(() => assertSafeSvg(attacks[6].payload, 'foreignObject')).toThrow(/SVG security check FAILED/);
    expect(() => assertSafeSvg(attacks[8].payload, 'external')).toThrow(/SVG security check FAILED/);
  });

  it('13: rejects excessive SVG byte size and element complexity', () => {
    const hugeSvg = `<svg viewBox="0 0 100 100">${'a'.repeat(MAX_SVG_BYTES + 100)}</svg>`;
    expect(auditSvgSecurity(hugeSvg).some((m) => /maximum allowed size/i.test(m))).toBe(true);
    expect(sanitizeSvg(hugeSvg)).toBe('');

    const tooManyNodes = `<svg viewBox="0 0 100 100">${'<rect width="1" height="1"/>'.repeat(MAX_SVG_ELEMENTS + 10)}</svg>`;
    expect(auditSvgSecurity(tooManyNodes).some((m) => /maximum allowed element complexity/i.test(m))).toBe(true);
    expect(sanitizeSvg(tooManyNodes)).toBe('');
  });

  it('preserves legitimate educational SVG features (gradients, markers/arrowheads, filters, internal #refs, math labels)', () => {
    const legit = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#0ea5e9"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#0f172a"/>
        </marker>
        <filter id="sh1"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.2"/></filter>
      </defs>
      <rect x="10" y="10" width="120" height="60" rx="8" fill="url(#g1)" filter="url(#sh1)"/>
      <line x1="130" y1="40" x2="250" y2="40" stroke="#0f172a" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="70" y="45" text-anchor="middle" font-size="16">Y = A ⊕ B</text>
    </svg>`;

    expect(auditSvgSecurity(legit)).toEqual([]);
    const cleaned = sanitizeSvg(legit);
    expect(cleaned).toContain('linearGradient');
    expect(cleaned).toContain('marker');
    expect(cleaned).toContain('url(#g1)');
    expect(cleaned).toContain('url(#arrow)');
    expect(cleaned).toContain('Y = A ⊕ B');
  });

  it('passes all real SVGs from seeded Boolean Logic 10A lesson with zero false positives', () => {
    const samplePath = path.resolve(process.cwd(), '.narrated-lesson-build/inbox/igcse-cs-boolean-logic-a.json');
    if (!fs.existsSync(samplePath)) return;
    const lesson = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
    const svgSlides = (lesson.slides || []).filter((s: any) => s.visual?.type === 'svg' && s.visual?.svgCode);
    expect(svgSlides.length).toBeGreaterThan(0);
    for (const s of svgSlides) {
      expect(auditSvgSecurity(s.visual.svgCode), `False positive on ${s.id}`).toEqual([]);
      const cleaned = sanitizeSvg(s.visual.svgCode);
      expect(cleaned).toContain('<svg');
      expect(cleaned.length).toBeGreaterThan(100);
    }
  });
});
