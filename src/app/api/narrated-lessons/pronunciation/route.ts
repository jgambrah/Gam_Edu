import * as fs from 'node:fs';
import * as path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import lessonData from '@/lib/narrated-lessons/bs7-sci-t1-water-cycle.json';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { buildTtsText } from '@/lib/narrated-lessons/pronunciation';

const LESSON_JSON_PATH = path.join(
  process.cwd(),
  'src',
  'lib',
  'narrated-lessons',
  'bs7-sci-t1-water-cycle.json',
);

export async function POST(req: NextRequest) {
  // Dev-only route: production hosts are read-only and must never accept unauthenticated file writes.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        error:
          'Direct saving is disabled in production. Use "Export Review JSON" and apply choices with npm run lesson:publish.',
      },
      { status: 403 },
    );
  }

  try {
    const body = (await req.json().catch(() => null)) as {
      choices?: Record<string, string>;
    } | null;

    const choices = body?.choices;
    if (!choices || typeof choices !== 'object' || Object.keys(choices).length === 0) {
      return NextResponse.json({ error: 'No respelling choices provided.' }, { status: 400 });
    }

    // Clone current lesson JSON (read from disk if available, else bundled copy)
    let lesson: NarratedLesson;
    if (fs.existsSync(LESSON_JSON_PATH)) {
      lesson = JSON.parse(fs.readFileSync(LESSON_JSON_PATH, 'utf8')) as NarratedLesson;
    } else {
      lesson = JSON.parse(JSON.stringify(lessonData)) as NarratedLesson;
    }

    const updatedTerms: string[] = [];
    for (const entry of lesson.pronunciationGuide) {
      const chosen = choices[entry.term];
      if (typeof chosen === 'string' && chosen.trim().length > 0) {
        entry.respelling = chosen.trim();
        updatedTerms.push(entry.term);
      }
    }

    // Recompute ttsText for every slide using the updated pronunciationGuide (never alters script)
    for (const slide of lesson.slides) {
      slide.narration.ttsText = buildTtsText(slide.narration.script, lesson.pronunciationGuide);
    }

    let persistedToDisk = false;
    try {
      fs.writeFileSync(LESSON_JSON_PATH, JSON.stringify(lesson, null, 2), 'utf8');
      persistedToDisk = true;
    } catch {
      // Production serverless filesystem (Vercel) is read-only; caller still gets updated guide for export
      persistedToDisk = false;
    }

    return NextResponse.json({
      ok: true,
      persistedToDisk,
      updatedTerms,
      pronunciationGuide: lesson.pronunciationGuide,
    });
  } catch (err) {
    console.error('[narrated-lessons/pronunciation] error:', err);
    return NextResponse.json({ error: 'Could not save pronunciation choices.' }, { status: 500 });
  }
}
