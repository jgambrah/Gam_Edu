/**
 * Learning Materials — shared rules for files, classes, search and clean-up.
 *
 * Pure helpers (no Firebase, no React) so they can be unit tested. The page
 * src/app/dashboard/academics/learning-materials/page.tsx uses them.
 */

export type MaterialFileKind = 'PDF' | 'Image' | 'Audio' | 'Video' | 'Slides' | 'Spreadsheet' | 'Document';

const MB = 1024 * 1024;

/** Storage accepts files under 100 MB; video gets nearly all of that, everything else stays small. */
export const MATERIAL_FILE_LIMITS: Record<MaterialFileKind, number> = {
  PDF: 25 * MB,
  Image: 10 * MB,
  Audio: 25 * MB,
  Video: 95 * MB,
  Slides: 25 * MB,
  Spreadsheet: 25 * MB,
  Document: 25 * MB,
};

/** Only these file endings may be uploaded. Programs, scripts and web pages are refused. */
const EXTENSION_KINDS: Record<string, MaterialFileKind> = {
  pdf: 'PDF',
  jpg: 'Image', jpeg: 'Image', png: 'Image', gif: 'Image', webp: 'Image',
  mp3: 'Audio', m4a: 'Audio', wav: 'Audio', ogg: 'Audio', aac: 'Audio',
  mp4: 'Video', webm: 'Video', mov: 'Video', m4v: 'Video',
  ppt: 'Slides', pptx: 'Slides', odp: 'Slides',
  xls: 'Spreadsheet', xlsx: 'Spreadsheet', csv: 'Spreadsheet', ods: 'Spreadsheet',
  doc: 'Document', docx: 'Document', odt: 'Document', rtf: 'Document', txt: 'Document',
};

/** Value for the file picker's `accept` attribute. */
export const MATERIAL_FILE_ACCEPT = Object.keys(EXTENSION_KINDS).map((e) => `.${e}`).join(',');

export const MATERIAL_TERMS = ['Term 1', 'Term 2', 'Term 3'] as const;
export const MATERIAL_MAX_WEEK = 20;
export const MATERIAL_MAX_TAGS = 8;
export const MATERIAL_TOPICS_PER_PAGE = 20;

/** Firestore refuses a record over 1 MB; stop a little earlier with a clear message. */
export const MATERIAL_MAX_RECORD_BYTES = 900 * 1024;

export interface MaterialAttachmentLike {
  name?: string;
  url?: string;
  type?: string;
  storagePath?: string;
  size?: number;
  contentType?: string;
}

export interface MaterialLike {
  id?: string;
  topicTitle?: string;
  title?: string;
  content?: string;
  subject?: string;
  classId?: string;
  classIds?: string[];
  term?: string;
  week?: number | null;
  tags?: string[];
  attachments?: MaterialAttachmentLike[];
}

export function fileExtension(name: string): string {
  const match = /\.([A-Za-z0-9]+)$/.exec((name || '').trim());
  return match ? match[1].toLowerCase() : '';
}

/** The kind of an allowed file, or null when this file type may not be uploaded. */
export function detectMaterialFileKind(name: string): MaterialFileKind | null {
  return EXTENSION_KINDS[fileExtension(name)] ?? null;
}

export function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes <= 0 || !Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / MB).toFixed(bytes < 10 * MB ? 1 : 0)} MB`;
}

export type MaterialFileCheck =
  | { ok: true; kind: MaterialFileKind }
  | { ok: false; title: string; message: string };

/** Checks a file before upload: allowed type, not empty, and within the size limit for its type. */
export function checkMaterialFile(file: { name: string; size: number }): MaterialFileCheck {
  const kind = detectMaterialFileKind(file.name);
  if (!kind) {
    return {
      ok: false,
      title: 'File Type Not Allowed',
      message: 'You can attach PDF, Word, PowerPoint, Excel/CSV, text, image (JPG, PNG, GIF, WebP), audio (MP3, M4A, WAV, OGG) and video (MP4, WebM, MOV) files.',
    };
  }
  if (!file.size) {
    return { ok: false, title: 'Empty File', message: 'This file is empty. Please choose another file.' };
  }
  const limit = MATERIAL_FILE_LIMITS[kind];
  if (file.size > limit) {
    return {
      ok: false,
      title: 'File Too Large',
      message: `${kind} files can be up to ${formatFileSize(limit)}. This one is ${formatFileSize(file.size)}.${kind === 'Video' ? ' For longer videos, add a YouTube link instead.' : ''}`,
    };
  }
  return { ok: true, kind };
}

/**
 * How to show a saved attachment. Older attachments were all labelled "Document" (or "IMAGE"/"AUDIO"/"DOC"),
 * so the file name decides when it can.
 */
export function attachmentKind(att: MaterialAttachmentLike): MaterialFileKind | 'Link' {
  const fromName = detectMaterialFileKind(att.name || '');
  if (fromName) return fromName;
  const t = (att.type || '').toLowerCase();
  if (t === 'pdf') return 'PDF';
  if (t === 'image') return 'Image';
  if (t === 'audio') return 'Audio';
  if (t === 'video') return 'Video';
  if (t === 'slides') return 'Slides';
  if (t === 'spreadsheet') return 'Spreadsheet';
  if (t === 'link') return 'Link';
  return 'Document';
}

/**
 * The storage path of an uploaded attachment, but only when it sits inside this school's learning-materials
 * folder — clean-up must never touch another school's files or an outside link.
 */
export function attachmentStoragePath(att: MaterialAttachmentLike, schoolId: string): string | null {
  if (!schoolId) return null;
  const folder = `schools/${schoolId}/learning_materials/`;
  let path = typeof att.storagePath === 'string' ? att.storagePath : '';
  if (!path && typeof att.url === 'string') {
    const match = /\/o\/([^?#]+)/.exec(att.url);
    if (match && /firebasestorage|storage\.googleapis/.test(att.url)) {
      try { path = decodeURIComponent(match[1]); } catch { path = ''; }
    }
  }
  if (!path.startsWith(folder) || path.includes('..')) return null;
  return path;
}

/** Storage files that were attached before an edit and are no longer attached after it. */
export function removedStoragePaths(
  before: MaterialAttachmentLike[] | undefined,
  after: MaterialAttachmentLike[] | undefined,
  schoolId: string
): string[] {
  const kept = new Set((after || []).map((a) => attachmentStoragePath(a, schoolId)).filter(Boolean) as string[]);
  const removed = new Set<string>();
  for (const a of before || []) {
    const path = attachmentStoragePath(a, schoolId);
    if (path && !kept.has(path)) removed.add(path);
  }
  return Array.from(removed);
}

/** The classes a topic belongs to. Older topics have only `classId`. */
export function materialClassIds(m: MaterialLike): string[] {
  const list = Array.isArray(m.classIds) ? m.classIds.filter((c) => typeof c === 'string' && c) : [];
  if (list.length > 0) return Array.from(new Set(list));
  return m.classId ? [m.classId] : [];
}

/** Joins the results of the "old" and "new" class queries without showing a topic twice. */
export function mergeMaterials<T extends { id?: string }>(...lists: (T[] | null | undefined)[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const list of lists) {
    for (const item of list || []) {
      const id = item.id || '';
      if (id && seen.has(id)) continue;
      if (id) seen.add(id);
      out.push(item);
    }
  }
  return out;
}

/** "Fractions, revision ,, BECE" → ["fractions", "revision", "bece"] */
export function parseTags(input: string): string[] {
  const tags: string[] = [];
  for (const raw of (input || '').split(/[,;\n]/)) {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 30);
    if (tag && !tags.includes(tag)) tags.push(tag);
    if (tags.length >= MATERIAL_MAX_TAGS) break;
  }
  return tags;
}

/** A week number from 1 to MATERIAL_MAX_WEEK, or null when left empty or invalid. */
export function parseWeek(input: string | number | null | undefined): number | null {
  const n = Math.floor(Number(input));
  if (!Number.isFinite(n) || n < 1 || n > MATERIAL_MAX_WEEK) return null;
  return n;
}

export interface MaterialFilter {
  search?: string;
  term?: string;
}

/** Search by title, notes, tags, term or "week 3"; and filter by term. Every search word must match. */
export function filterMaterials<T extends MaterialLike>(materials: T[], filter: MaterialFilter): T[] {
  const words = (filter.search || '').toLowerCase().split(/\s+/).filter(Boolean);
  const term = filter.term && filter.term !== 'all' ? filter.term : '';
  return materials.filter((m) => {
    if (term && (m.term || '') !== term) return false;
    if (words.length === 0) return true;
    const haystack = [
      m.topicTitle || m.title || '',
      m.content || '',
      (m.tags || []).join(' '),
      m.term || '',
      m.week ? `week ${m.week}` : '',
    ].join(' ').toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

/** Rough size of the record that will be saved (UTF-8 bytes of its JSON). */
export function estimateRecordBytes(data: unknown): number {
  try {
    return new TextEncoder().encode(JSON.stringify(data ?? null)).length;
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
}
