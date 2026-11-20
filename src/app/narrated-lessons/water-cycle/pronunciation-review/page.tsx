import type { Metadata } from 'next';
import manifestData from '@/lib/narrated-lessons/pronunciation-test-clips.json';
import {
  PronunciationReviewClient,
  type TestClipsManifest,
} from '@/components/narrated-lessons/PronunciationReviewClient';

export const metadata: Metadata = {
  title: 'Pronunciation Test Clip Review — Water Cycle Pilot',
  description:
    'Internal reviewer page for comparing Kore TTS pronunciation variants for Ghanaian names (Bosomtwe, Akosombo, Harmattan, Volta).',
};

export default function PronunciationReviewPage() {
  return <PronunciationReviewClient manifest={manifestData as unknown as TestClipsManifest} />;
}
