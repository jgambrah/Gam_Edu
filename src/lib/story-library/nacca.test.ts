import { describe, expect, it } from 'vitest';
import { extractNaccaCodes, matchesNaccaFocus, naccaCodesFromSubjectLinks } from './nacca';

describe('NaCCA codes', () => {
  it('finds distinct 4 and 5 part codes anywhere in the text', () => {
    expect(extractNaccaCodes('Science (NaCCA B4.2.2.1.1)', 'also B1.5.1.1 and B4.2.2.1.1 again')).toEqual(['B4.2.2.1.1', 'B1.5.1.1']);
    expect(extractNaccaCodes('Science (NaCCA B2.2.1.4.2, B3.2.1.4.2)')).toEqual(['B2.2.1.4.2', 'B3.2.1.4.2']);
  });
  it('ignores text without codes, partial codes and undefined', () => {
    expect(extractNaccaCodes('Our World Our People', undefined, null, 'B4.2', 'AB4.2.2.1')).toEqual([]);
  });
  it('reads subject links in their normalised shape', () => {
    expect(naccaCodesFromSubjectLinks([{ subject: 'Science (NaCCA B3.5.2.1.2)', link: 'Illnesses in the air' }, { subject: 'English', link: 'Rhyme' }])).toEqual(['B3.5.2.1.2']);
    expect(naccaCodesFromSubjectLinks(undefined)).toEqual([]);
  });
  it('matches a focus by exact code or dot-boundary prefix only', () => {
    const codes = ['B4.2.2.1.1'];
    expect(matchesNaccaFocus(codes, ['B4'])).toBe(true);
    expect(matchesNaccaFocus(codes, ['B4.2'])).toBe(true);
    expect(matchesNaccaFocus(codes, ['b4.2.2.1.1'])).toBe(true);
    expect(matchesNaccaFocus(codes, ['B4.20'])).toBe(false);
    expect(matchesNaccaFocus(codes, ['B3'])).toBe(false);
    expect(matchesNaccaFocus(['B4.20.1.1'], ['B4.2'])).toBe(false);
    expect(matchesNaccaFocus(undefined, ['B4'])).toBe(false);
    expect(matchesNaccaFocus(codes, [])).toBe(false);
    expect(matchesNaccaFocus(codes, [' '])).toBe(false);
  });
});
