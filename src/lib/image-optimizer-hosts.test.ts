// @vitest-environment node
/**
 * D-029: the Next.js image optimiser may only fetch hosts GAM EDU legitimately uses. Uses Next's own matcher, so this is
 * exactly how the optimiser decides at runtime.
 */
import { describe, expect, it } from 'vitest';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import { matchRemotePattern } from 'next/dist/shared/lib/match-remote-pattern';
import nextConfig from '../../next.config';

const patterns: any[] = (nextConfig as any).images.remotePatterns;
const allowed = (u: string) => patterns.some((p) => matchRemotePattern(p, new URL(u)));

describe('image optimiser host allow-list', () => {
  it('no wildcard host: the open-proxy pattern is gone', () => {
    expect(patterns.length).toBeGreaterThan(0);
    for (const p of patterns) {
      expect(p.hostname).not.toMatch(/\*/);
      expect(p.protocol).toBe('https');
    }
  });

  it('keeps every legitimate image host working (school logos, lessons, profile photos, thumbnails, avatars)', () => {
    for (const u of [
      'https://firebasestorage.googleapis.com/v0/b/gam-edu.appspot.com/o/logos%2Fschool.png?alt=media',
      'https://storage.googleapis.com/narrated-lessons-cdn/lesson/img-abc.webp',
      'https://lh3.googleusercontent.com/a/ACg8ocJxyz=s96-c',
      'https://images.unsplash.com/photo-123?w=800',
      'https://img.youtube.com/vi/abc123/hqdefault.jpg',
      'https://api.dicebear.com/7.x/bottts/svg?seed=DrGAM',
    ]) expect(allowed(u), u).toBe(true);
  });

  it('refuses unapproved hosts, look-alike hosts, other paths and non-https', () => {
    for (const u of [
      'https://evil.example.com/x.png',
      'https://firebasestorage.googleapis.com.evil.com/v0/b/x/o/y.png',
      'https://evilfirebasestorage.googleapis.com/v0/b/x/o/y.png',
      'https://firebasestorage.googleapis.com/other/path.png', // outside /v0/b/**
      'https://img.youtube.com/not-a-thumbnail.png', // outside /vi/**
      'http://firebasestorage.googleapis.com/v0/b/x/o/y.png', // not https
      'https://169.254.169.254/latest/meta-data',
      'https://localhost/admin.png',
      'https://attacker.googleusercontent.com/a.png',
    ]) expect(allowed(u), u).toBe(false);
  });
});
