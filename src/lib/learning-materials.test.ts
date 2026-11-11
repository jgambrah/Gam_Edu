import { describe, it, expect } from 'vitest';
import {
  MATERIAL_FILE_ACCEPT,
  MATERIAL_MAX_RECORD_BYTES,
  attachmentKind,
  attachmentStoragePath,
  checkMaterialFile,
  detectMaterialFileKind,
  estimateRecordBytes,
  filterMaterials,
  formatFileSize,
  materialClassIds,
  mergeMaterials,
  parseTags,
  parseWeek,
  removedStoragePaths,
} from './learning-materials';

const MB = 1024 * 1024;
const SCHOOL = 'schoolA';

describe('Learning materials — diverse file types', () => {
  it.each([
    ['Notes.pdf', 'PDF'],
    ['diagram.PNG', 'Image'],
    ['photo.jpeg', 'Image'],
    ['listening-lesson.mp3', 'Audio'],
    ['experiment.mp4', 'Video'],
    ['Lesson 3.pptx', 'Slides'],
    ['scores.xlsx', 'Spreadsheet'],
    ['data.csv', 'Spreadsheet'],
    ['worksheet.docx', 'Document'],
  ])('USE CASE: %s is accepted as %s', (name, kind) => {
    expect(detectMaterialFileKind(name)).toBe(kind);
    expect(checkMaterialFile({ name, size: 1 * MB })).toEqual({ ok: true, kind });
  });

  it.each(['virus.exe', 'page.html', 'script.js', 'archive.zip', 'drawing.svg', 'noextension', 'trick.pdf.exe'])(
    'USE CASE: %s is refused',
    (name) => {
      expect(detectMaterialFileKind(name)).toBeNull();
      const result = checkMaterialFile({ name, size: 1000 });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.title).toBe('File Type Not Allowed');
    }
  );

  it('USE CASE: a 60 MB video is accepted, but a 60 MB PDF and a 120 MB video are not', () => {
    expect(checkMaterialFile({ name: 'lesson.mp4', size: 60 * MB }).ok).toBe(true);

    const pdf = checkMaterialFile({ name: 'book.pdf', size: 60 * MB });
    expect(pdf.ok).toBe(false);
    if (!pdf.ok) expect(pdf.message).toContain('PDF files can be up to 25 MB');

    const video = checkMaterialFile({ name: 'film.mp4', size: 120 * MB });
    expect(video.ok).toBe(false);
    if (!video.ok) expect(video.message).toMatch(/up to 95 MB.*YouTube link/);
  });

  it('refuses an empty file', () => {
    expect(checkMaterialFile({ name: 'empty.pdf', size: 0 })).toMatchObject({ ok: false, title: 'Empty File' });
  });

  it('the file picker only offers allowed types', () => {
    expect(MATERIAL_FILE_ACCEPT).toContain('.pdf');
    expect(MATERIAL_FILE_ACCEPT).toContain('.mp4');
    expect(MATERIAL_FILE_ACCEPT).not.toContain('.exe');
  });

  it('USE CASE: older attachments saved as "Document" are shown by what they really are', () => {
    expect(attachmentKind({ name: 'cell.png', type: 'Document' })).toBe('Image');
    expect(attachmentKind({ name: 'song.mp3', type: 'Document' })).toBe('Audio');
    expect(attachmentKind({ name: 'old file', type: 'IMAGE' })).toBe('Image');
    expect(attachmentKind({ name: 'old file', type: 'DOC' })).toBe('Document');
    expect(attachmentKind({ name: 'Khan Academy', type: 'Link' })).toBe('Link');
  });

  it('shows file sizes in a readable way', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(300 * 1024)).toBe('300 KB');
    expect(formatFileSize(2.5 * MB)).toBe('2.5 MB');
    expect(formatFileSize(60 * MB)).toBe('60 MB');
    expect(formatFileSize(undefined)).toBe('');
  });
});

describe('Learning materials — cleaning up files that are no longer used', () => {
  const path = (n: string) => `schools/${SCHOOL}/learning_materials/jhs1/${n}`;
  const url = (p: string) =>
    `https://firebasestorage.googleapis.com/v0/b/app.appspot.com/o/${encodeURIComponent(p)}?alt=media&token=abc`;

  it('finds the storage path from the saved path or, for older files, from the download link', () => {
    expect(attachmentStoragePath({ storagePath: path('a.pdf') }, SCHOOL)).toBe(path('a.pdf'));
    expect(attachmentStoragePath({ url: url(path('b.pdf')) }, SCHOOL)).toBe(path('b.pdf'));
  });

  it("SAFETY: never returns another school's file, an outside link, or a path that climbs out of the folder", () => {
    expect(attachmentStoragePath({ storagePath: 'schools/schoolB/learning_materials/x.pdf' }, SCHOOL)).toBeNull();
    expect(attachmentStoragePath({ url: url('schools/schoolB/learning_materials/x.pdf') }, SCHOOL)).toBeNull();
    expect(attachmentStoragePath({ url: 'https://example.com/o/schools/schoolA/learning_materials/x.pdf' }, SCHOOL)).toBeNull();
    expect(attachmentStoragePath({ storagePath: `schools/${SCHOOL}/learning_materials/../assets/logo.png` }, SCHOOL)).toBeNull();
    expect(attachmentStoragePath({ storagePath: `schools/${SCHOOL}/assets/logo.png` }, SCHOOL)).toBeNull();
    expect(attachmentStoragePath({ url: 'https://youtube.com/watch?v=1' }, SCHOOL)).toBeNull();
    expect(attachmentStoragePath({ storagePath: path('a.pdf') }, '')).toBeNull();
  });

  it('USE CASE: a teacher removes one of three attachments — only that file is cleaned up', () => {
    const before = [{ storagePath: path('a.pdf') }, { storagePath: path('b.png') }, { url: url(path('c.mp3')) }];
    const after = [before[0], before[2]];
    expect(removedStoragePaths(before, after, SCHOOL)).toEqual([path('b.png')]);
  });

  it('USE CASE: deleting a topic cleans up all of its uploaded files but leaves outside links alone', () => {
    const before = [{ storagePath: path('a.pdf') }, { url: 'https://example.com/sheet.pdf', type: 'Link' }];
    expect(removedStoragePaths(before, [], SCHOOL)).toEqual([path('a.pdf')]);
  });

  it('nothing is cleaned up when nothing was removed', () => {
    const list = [{ storagePath: path('a.pdf') }];
    expect(removedStoragePaths(list, list, SCHOOL)).toEqual([]);
    expect(removedStoragePaths(undefined, list, SCHOOL)).toEqual([]);
  });
});

describe('Learning materials — one topic for several classes', () => {
  it('USE CASE: a topic shared with JHS 1A and JHS 1B lists both classes', () => {
    expect(materialClassIds({ classId: 'jhs1a', classIds: ['jhs1a', 'jhs1b'] })).toEqual(['jhs1a', 'jhs1b']);
  });

  it('USE CASE: an older topic with a single class still works', () => {
    expect(materialClassIds({ classId: 'jhs1a' })).toEqual(['jhs1a']);
    expect(materialClassIds({ classId: 'jhs1a', classIds: [] })).toEqual(['jhs1a']);
    expect(materialClassIds({})).toEqual([]);
  });

  it('a topic found by both the old and the new class search is shown once', () => {
    const a = { id: '1', topicTitle: 'Fractions' };
    const b = { id: '2', topicTitle: 'Decimals' };
    expect(mergeMaterials([a, b], [{ ...a }], null, undefined)).toEqual([a, b]);
  });
});

describe('Learning materials — term, week, tags and search', () => {
  const topics = [
    { id: '1', topicTitle: 'Diversity of Matter', content: 'Solids, liquids and gases', term: 'Term 1', week: 3, tags: ['matter', 'bece'] },
    { id: '2', topicTitle: 'Photosynthesis', content: 'How plants make food', term: 'Term 2', week: 1, tags: ['plants'] },
    { id: '3', topicTitle: 'Old topic with no term', content: 'Legacy notes about plants' },
  ];

  it('USE CASE: search by title, notes or tag', () => {
    expect(filterMaterials(topics, { search: 'photo' }).map((t) => t.id)).toEqual(['2']);
    expect(filterMaterials(topics, { search: 'plants' }).map((t) => t.id)).toEqual(['2', '3']);
    expect(filterMaterials(topics, { search: 'BECE' }).map((t) => t.id)).toEqual(['1']);
    expect(filterMaterials(topics, { search: 'week 3' }).map((t) => t.id)).toEqual(['1']);
    expect(filterMaterials(topics, { search: 'plants food' }).map((t) => t.id)).toEqual(['2']);
    expect(filterMaterials(topics, { search: 'zebra' })).toEqual([]);
  });

  it('USE CASE: filter by term, alone or together with a search', () => {
    expect(filterMaterials(topics, { term: 'Term 1' }).map((t) => t.id)).toEqual(['1']);
    expect(filterMaterials(topics, { term: 'all' })).toHaveLength(3);
    expect(filterMaterials(topics, { term: 'Term 2', search: 'matter' })).toEqual([]);
    expect(filterMaterials(topics, {})).toHaveLength(3);
  });

  it('cleans up tags typed by a teacher', () => {
    expect(parseTags(' Fractions, revision ,, BECE; fractions\nExam  Prep ')).toEqual(['fractions', 'revision', 'bece', 'exam prep']);
    expect(parseTags('a,b,c,d,e,f,g,h,i,j')).toHaveLength(8);
    expect(parseTags('')).toEqual([]);
  });

  it('accepts week 1 to 20 only', () => {
    expect(parseWeek('3')).toBe(3);
    expect(parseWeek(12)).toBe(12);
    expect(parseWeek('')).toBeNull();
    expect(parseWeek('0')).toBeNull();
    expect(parseWeek('21')).toBeNull();
    expect(parseWeek('abc')).toBeNull();
  });
});

describe('Learning materials — record size guard', () => {
  it('USE CASE: an ordinary topic is well within the limit', () => {
    const topic = { topicTitle: 'Fractions', content: 'x'.repeat(20_000), practiceQuestions: new Array(20).fill({ question: 'q', options: ['a', 'b', 'c', 'd'] }) };
    expect(estimateRecordBytes(topic)).toBeLessThan(MATERIAL_MAX_RECORD_BYTES);
  });

  it('USE CASE: a topic with far too much pasted text is caught before saving', () => {
    expect(estimateRecordBytes({ content: 'x'.repeat(1_000_000) })).toBeGreaterThan(MATERIAL_MAX_RECORD_BYTES);
  });

  it('counts non-English characters by their real size', () => {
    expect(estimateRecordBytes('ɛɔ')).toBeGreaterThan(estimateRecordBytes('eo'));
  });
});
