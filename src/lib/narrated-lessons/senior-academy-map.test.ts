import { describe, it, expect } from 'vitest';
import {
  NARRATED_TO_SENIOR_ACADEMY,
  getSeniorAcademyLinkForLesson,
  getNarratedLessonsForSeniorTopic,
} from './senior-academy-map';

describe('senior-academy-map (bidirectional Narrated Lessons <-> Senior Academy)', () => {
  it('maps Living Cells (B7) to Senior Academy sci_strand1_cells at level b7 and back', () => {
    const link = getSeniorAcademyLinkForLesson('b7-sci-t1-living-cells');
    expect(link).not.toBeNull();
    expect(link?.seniorTopicId).toBe('sci_strand1_cells');
    expect(link?.seniorLevel).toBe('b7');
    expect(link?.href).toBe(
      '/dashboard/senior-academy?view=topical&subject=science&topicId=sci_strand1_cells&level=b7',
    );

    const reverse = getNarratedLessonsForSeniorTopic('sci_strand1_cells', 'b7');
    expect(reverse.length).toBeGreaterThanOrEqual(2);
    expect(reverse[0].lessonId).toBe('b7-sci-t1-living-cells');
    expect(reverse[0].href).toBe('/dashboard/narrated-lessons/b7-sci-t1-living-cells');
  });

  it('prioritizes B8 narrated lessons when viewing B8 level in Senior Academy', () => {
    const reverseB8 = getNarratedLessonsForSeniorTopic('sci_strand1_cells', 'b8');
    expect(reverseB8[0].lessonId).toBe('b8-sci-t1-cells-prokaryotic-and-eukaryotic');
    expect(reverseB8[0].level).toBe('b8');
  });

  it('deduplicates legacy water-cycle aliases when resolving from Senior Academy', () => {
    const waterLessons = getNarratedLessonsForSeniorTopic('sci_strand2_earth_cycles', 'b7');
    const b7Water = waterLessons.filter((l) => l.level === 'b7');
    expect(b7Water).toHaveLength(1);
    expect(b7Water[0].lessonId).toBe('b7-sci-t2-cycles-earth-science');
  });

  it('covers all 19 JHS Science Senior Academy hubs', () => {
    const uniqueHubs = new Set(NARRATED_TO_SENIOR_ACADEMY.map((m) => m.seniorTopicId));
    expect(uniqueHubs.size).toBe(19);
  });

  it('returns null for unmapped Cambridge lessons', () => {
    expect(getSeniorAcademyLinkForLesson('igcse-cs-algorithm-design-problem-solving')).toBeNull();
  });
});
