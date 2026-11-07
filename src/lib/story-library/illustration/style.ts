import type { StyleBible } from './plan';

/**
 * The shared look for premium Story Spark illustrations ("cinematic 3D storybook"). One style bible for the whole series
 * keeps 65 stories visually coherent. It is a SPECIFICATION: no image has been generated from it yet.
 */
export const STORY_SPARK_CINEMATIC_3D: StyleBible = {
  id: 'story-spark-cinematic-3d-v1',
  name: 'Story Spark Cinematic 3D',
  summary: 'A warm, cinematic 3D-rendered children’s storybook illustration with soft global illumination, rounded appealing character design, expressive faces and richly detailed Ghanaian environments. Original design: not imitating any studio, film or existing character.',
  medium: 'High-quality 3D-rendered storybook illustration (soft-shaded, subtle subsurface skin scattering, gentle depth of field)',
  lighting: 'Warm, cinematic natural light: golden-hour or soft window light with gentle rim light; readable shadows; never harsh or frightening',
  camera: 'Child-eye or slightly low storybook camera at 35-50mm equivalent; clear foreground, midground and background; one clear focal point per image',
  palette: [
    { name: 'Laterite red', hex: '#B5532F', use: 'earth, walls, roofs' },
    { name: 'Golden groundnut', hex: '#E0A030', use: 'warm light, food, highlights' },
    { name: 'Forest green', hex: '#2F6B3F', use: 'plants, school details' },
    { name: 'Kente indigo', hex: '#2E3F8F', use: 'cloth accents, night scenes' },
    { name: 'Cream', hex: '#FBF1DD', use: 'paper, highlights, calm areas' },
    { name: 'Deep cocoa', hex: '#4A2C20', use: 'shadows, wood' },
  ],
  mustHave: [
    'consistent character designs matching their reference sheets',
    'authentic Ghanaian everyday details (clothing, market goods, school life) shown with dignity',
    'a visible, uncluttered focal point suited to the story moment',
    'natural variation in skin tones, hair and body types among background characters',
  ],
  mustAvoid: [
    'emoji, icons or clip-art style',
    'stereotyped, caricatured or demeaning depictions of people or places',
    'poverty or hardship shown as spectacle',
    'text, signs with readable words, logos, watermarks, brand names',
    'existing characters, mascots or recognisable studio styles',
    'frightening or violent imagery',
    'uncanny faces; extra or missing fingers; distorted hands',
  ],
  aspect: '4:3',
  delivery: {
    masterPx: [1600, 1200],
    webpWidths: [480, 960, 1440],
    maxBytesAt960: 90_000,
    maxBytesAt480: 30_000,
    lowBandwidthStoryBudgetBytes: 450_000,
    format: ['image/avif (preferred)', 'image/webp (fallback)'],
  },
};
