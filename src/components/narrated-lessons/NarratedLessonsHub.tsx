'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  FileText,
  Globe2,
  GraduationCap,
  HelpCircle,
  Layers,
  Loader2,
  PlayCircle,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  CAMBRIDGE_CLASS_BANDS,
  CLASS_BANDS,
  cdnObjectUrl,
  classDisplayLabel,
  fetchLessonCatalogue,
  normalizeCambridgeLevel,
  normalizeClassLevel,
  type CurriculumSystem,
  type LessonCatalogue,
  type LessonCatalogueEntry,
} from '@/lib/narrated-lessons/catalogue';
import { useRole } from '@/context/role-context';

interface NarratedLessonsHubProps {
  /** Base path for opening a lesson, e.g. '/dashboard/narrated-lessons' or '/dashboard/cambridge-lessons' */
  basePath?: string;
  /** Which curriculum space to show: 'ges' (default) or 'cambridge' */
  curriculum?: CurriculumSystem;
}

const CURRICULUM_STORAGE_KEY = 'gam_edu_narrated_curriculum';

export function NarratedLessonsHub({
  basePath,
  curriculum = 'ges',
}: NarratedLessonsHubProps) {
  const [activeCurriculum, setActiveCurriculum] = useState<CurriculumSystem>(curriculum);
  const isCambridge = activeCurriculum === 'cambridge';
  const effectiveBasePath =
    basePath ?? (isCambridge ? '/dashboard/cambridge-lessons' : '/dashboard/narrated-lessons');
  const classBands = isCambridge ? CAMBRIDGE_CLASS_BANDS : CLASS_BANDS;
  const { profile, role } = useRole();
  const [catalogue, setCatalogue] = useState<LessonCatalogue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedTerm, setSelectedTerm] = useState<number | 'ALL'>('ALL');
  const [query, setQuery] = useState('');

  // Restore last-selected curriculum when visiting the shared /dashboard/narrated-lessons hub;
  // direct /dashboard/cambridge-lessons links always open straight into Cambridge.
  useEffect(() => {
    if (curriculum === 'cambridge') {
      setActiveCurriculum('cambridge');
      try {
        window.localStorage.setItem(CURRICULUM_STORAGE_KEY, 'cambridge');
      } catch {
        // Ignore storage errors in private browsing
      }
      return;
    }
    try {
      const saved = window.localStorage.getItem(CURRICULUM_STORAGE_KEY);
      if (saved === 'cambridge' || saved === 'ges') {
        setActiveCurriculum(saved);
      }
    } catch {
      // Ignore storage errors
    }
  }, [curriculum]);

  const handleCurriculumSwitch = (next: CurriculumSystem) => {
    if (next === activeCurriculum) return;
    setActiveCurriculum(next);
    setSelectedClass('ALL');
    setSelectedSubject('ALL');
    setSelectedTerm('ALL');
    setQuery('');
    try {
      window.localStorage.setItem(CURRICULUM_STORAGE_KEY, next);
    } catch {
      // Ignore storage errors
    }
  };

  // Auto-select the signed-in student's class when available
  useEffect(() => {
    if (role?.toLowerCase() === 'student' && profile) {
      const p = profile as Record<string, unknown>;
      const rawClass =
        (typeof p.className === 'string' && p.className) ||
        (typeof p.class === 'string' && p.class) ||
        (typeof p.grade === 'string' && p.grade) ||
        null;
      const norm = isCambridge ? normalizeCambridgeLevel(rawClass) : normalizeClassLevel(rawClass);
      if (norm) setSelectedClass(norm);
    }
  }, [profile, role, isCambridge]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchLessonCatalogue()
      .then((cat) => {
        if (!active) return;
        setCatalogue(cat);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Could not load narrated lessons.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const curriculumCounts = useMemo(() => {
    const all = catalogue?.entries ?? [];
    let ges = 0;
    let cambridge = 0;
    for (const e of all) {
      if ((e.curriculum ?? 'ges') === 'cambridge') cambridge++;
      else ges++;
    }
    return { ges, cambridge };
  }, [catalogue]);

  const entries = useMemo(() => {
    const all = catalogue?.entries ?? [];
    return all.filter((e) => (e.curriculum ?? 'ges') === activeCurriculum);
  }, [catalogue, activeCurriculum]);

  const countByClass = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of entries) {
      m.set(e.class, (m.get(e.class) ?? 0) + 1);
    }
    return m;
  }, [entries]);

  const classScopedEntries = useMemo(() => {
    if (selectedClass === 'ALL') return entries;
    return entries.filter((e) => e.class === selectedClass);
  }, [entries, selectedClass]);

  const subjects = useMemo(() => {
    const set = new Set<string>();
    for (const e of classScopedEntries) set.add(e.subject);
    return [...set].sort();
  }, [classScopedEntries]);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classScopedEntries.filter((e) => {
      if (selectedSubject !== 'ALL' && e.subject !== selectedSubject) return false;
      if (selectedTerm !== 'ALL' && e.term !== selectedTerm) return false;
      if (!q) return true;
      const hay = [
        e.title,
        e.summary,
        e.subject,
        e.class,
        e.contentStandard,
        ...(e.indicators ?? []),
        e.strand ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [classScopedEntries, query, selectedSubject, selectedTerm]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      {/* Curriculum Switcher (GES / NaCCA vs Cambridge International) */}
      <div
        role="tablist"
        aria-label="Curriculum System"
        className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-100/90 p-1.5 shadow-2xs sm:inline-grid sm:w-auto"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!isCambridge}
          onClick={() => handleCurriculumSwitch('ges')}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
            !isCambridge
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
          }`}
        >
          <BookOpen className="h-4 w-4 shrink-0" />
          <span>GES / NaCCA</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
              !isCambridge ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
            }`}
          >
            {curriculumCounts.ges}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isCambridge}
          onClick={() => handleCurriculumSwitch('cambridge')}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
            isCambridge
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
          }`}
        >
          <Globe2 className="h-4 w-4 shrink-0" />
          <span>Cambridge International</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
              isCambridge ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
            }`}
          >
            {curriculumCounts.cambridge}
          </span>
        </button>
      </div>

      {/* Hero Banner */}
      <section
        className={`overflow-hidden rounded-2xl p-6 text-white shadow-sm ${
          isCambridge
            ? 'bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700'
            : 'bg-gradient-to-br from-sky-700 via-sky-600 to-teal-600'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              {isCambridge
                ? 'Cambridge International Curriculum · Year 1 to A Level'
                : 'GES / NaCCA Interactive Audio-Visual Lessons · Creche to JHS 3'}
            </div>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {isCambridge ? 'Cambridge Lessons Library' : 'Narrated Lessons Library'}
            </h1>
            <p className={`mt-1.5 text-sm ${isCambridge ? 'text-indigo-100' : 'text-sky-100'}`}>
              {isCambridge
                ? 'Choose your Cambridge stage (Primary, Lower Secondary, IGCSE, or AS & A Level) for narrated lessons, study notes, and worked question series.'
                : 'Choose your class, pick a subject, and learn step-by-step with Teacher Kore, interactive concept checks, and Ask Teacher.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="rounded-xl bg-white/15 px-4 py-2.5 text-right backdrop-blur-xs">
              <p className={`text-[11px] font-medium ${isCambridge ? 'text-indigo-100' : 'text-sky-100'}`}>
                Available Topics
              </p>
              <p className="text-xl font-extrabold leading-tight">{entries.length}</p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mt-5 max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isCambridge
                ? 'Search by topic, subject, or syllabus code (e.g. IGCSE Biology, Year 6, A Level Chemistry)...'
                : 'Search by topic, subject, or NaCCA code (e.g. Water Cycle, Science, B7.2.1.1)...'
            }
            className="w-full rounded-xl border-0 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>
      </section>

      {/* Class / Stage Selector */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className={`h-4 w-4 ${isCambridge ? 'text-indigo-600' : 'text-sky-600'}`} />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              {isCambridge
                ? '1. Select Cambridge Level (Year 1 – A Level)'
                : '1. Select Class (Creche – JHS 3)'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedClass('ALL');
              setSelectedSubject('ALL');
            }}
            className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
              selectedClass === 'ALL'
                ? isCambridge
                  ? 'bg-indigo-600 text-white'
                  : 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isCambridge ? `All Levels (${entries.length})` : `All Classes (${entries.length})`}
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {classBands.map((band) => (
            <div key={band.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                {band.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {band.classes.map((cls) => {
                  const count = countByClass.get(cls) ?? 0;
                  const active = selectedClass === cls;
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => {
                        setSelectedClass(cls);
                        setSelectedSubject('ALL');
                      }}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                        active
                          ? 'border-sky-600 bg-sky-600 text-white shadow-2xs'
                          : count > 0
                            ? 'border-sky-200 bg-white text-slate-800 hover:border-sky-400 hover:bg-sky-50'
                            : 'border-slate-200 bg-white/60 text-slate-400 hover:bg-white'
                      }`}
                    >
                      <span>{cls}</span>
                      {count > 0 && (
                        <span
                          className={`rounded-full px-1.5 text-[10px] font-bold ${
                            active ? 'bg-white/25 text-white' : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subject & Term Filters */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-bold uppercase tracking-wide text-slate-500">Subject:</span>
          <button
            type="button"
            onClick={() => setSelectedSubject('ALL')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              selectedSubject === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            All Subjects
          </button>
          {subjects.map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => setSelectedSubject(subj)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                selectedSubject === subj
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Term:</span>
          {(['ALL', 1, 2, 3] as const).map((t) => (
            <button
              key={String(t)}
              type="button"
              onClick={() => setSelectedTerm(t)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                selectedTerm === t
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t === 'ALL' ? 'All' : `Term ${t}`}
            </button>
          ))}
        </div>
      </section>

      {/* Lessons Grid */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-16 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
          Loading lessons from central library...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-800">
          {error}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-800">
            No lessons published yet for this selection
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {selectedClass !== 'ALL'
              ? `Lessons for ${classDisplayLabel(selectedClass)} are being prepared. Switch to "All Classes" to explore published topics.`
              : 'Try clearing your search or term filter.'}
          </p>
          {selectedClass !== 'ALL' && (
            <button
              type="button"
              onClick={() => {
                setSelectedClass('ALL');
                setSelectedSubject('ALL');
                setSelectedTerm('ALL');
                setQuery('');
              }}
              className="mt-4 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700"
            >
              Show All Published Lessons
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => (
            <LessonCard key={entry.lessonId} entry={entry} basePath={effectiveBasePath} />
          ))}
        </div>
      )}
    </div>
  );
}

function LessonCard({ entry, basePath }: { entry: LessonCatalogueEntry; basePath: string }) {
  const coverUrl = entry.coverImagePath ? cdnObjectUrl(entry.coverImagePath) : null;
  const href = `${basePath}/${encodeURIComponent(entry.lessonId)}`;
  const hasNotes = Boolean(entry.notesPath);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md">
      <Link href={href} className="flex flex-1 flex-col">
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={entry.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-teal-100">
              <BookOpen className="h-10 w-10 text-sky-600" />
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-xs">
            {classDisplayLabel(entry.class)}
            {entry.term > 0 ? ` · Term ${entry.term}` : ''}
          </span>
          {hasNotes && (
            <span className="absolute right-3 top-3 rounded-full bg-emerald-600/95 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
              + Notes &amp; Q&amp;A
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4 pb-3">
          <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wide text-sky-700">
            <span>{entry.subject}</span>
            <span
              title={`Content Standard: ${entry.contentStandard}`}
              className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600"
            >
              {entry.indicators?.length ? entry.indicators.join(' · ') : entry.contentStandard}
            </span>
          </div>

          <h3 className="mt-1.5 text-base font-extrabold text-slate-900 group-hover:text-sky-700">
            {entry.title}
          </h3>
          <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-600">
            {entry.summary}
          </p>
        </div>
      </Link>

      <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
        {hasNotes ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                {entry.slideCount} slides
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />~{entry.estimatedTotalMinutes}m
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <Link
                href={href}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-sky-600 px-2 py-1.5 text-[11px] font-bold text-white transition hover:bg-sky-700"
              >
                <PlayCircle className="h-3.5 w-3.5 shrink-0" />
                Listen
              </Link>
              <Link
                href={`${href}?stage=notes`}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2 py-1.5 text-[11px] font-bold text-teal-800 transition hover:bg-teal-100"
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                Notes
              </Link>
              <Link
                href={`${href}?stage=questions`}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1.5 text-[11px] font-bold text-indigo-800 transition hover:bg-indigo-100"
              >
                <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                Questions
              </Link>
            </div>
          </div>
        ) : (
          <Link href={href} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                {entry.slideCount} slides
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />~{entry.estimatedTotalMinutes}m
              </span>
            </div>
            <span className="inline-flex items-center gap-1 font-bold text-sky-600">
              <PlayCircle className="h-4 w-4" />
              Start
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
