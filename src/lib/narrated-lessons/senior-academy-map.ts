/**
 * Bidirectional mapping between Narrated Lessons (GES / NaCCA) and
 * Senior Academy Topical Practice Labs (comprehensive notes, worked examples,
 * tiered topical drills, and past-question links).
 *
 * Adding a new mapping here automatically enables:
 *  1. Narrated Lesson -> Senior Academy deep-link (?view=topical&subject=...&topicId=...&level=...)
 *  2. Senior Academy TopicalLabRunner -> Narrated Lesson quick-jump pill(s)
 */

export type SeniorAcademySubject = 'science' | 'math' | 'english';
export type SeniorAcademyLevel = 'b7' | 'b8' | 'b9';

export interface LessonSeniorAcademyMapping {
  lessonId: string;
  lessonTitle: string;
  seniorTopicId: string;
  seniorSubject: SeniorAcademySubject;
  seniorLevel: SeniorAcademyLevel;
  seniorHubTitle: string;
}

export const NARRATED_TO_SENIOR_ACADEMY: readonly LessonSeniorAcademyMapping[] = [
  // STRAND 1: DIVERSITY OF MATTER — Materials
  {
    lessonId: 'b7-sci-t1-materials-solids-liquids-gases',
    lessonTitle: 'Materials (Solids, Liquids & Gases)',
    seniorTopicId: 'sci_strand1_materials',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Materials & Atomic Architecture',
  },
  {
    lessonId: 'b7-sci-t1-materials-states-periodic-table',
    lessonTitle: 'Materials, States of Matter & Periodic Table',
    seniorTopicId: 'sci_strand1_materials',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Materials & Atomic Architecture',
  },
  {
    lessonId: 'b8-sci-t1-mixtures-and-separation',
    lessonTitle: 'Mixtures, Solutions & Separation',
    seniorTopicId: 'sci_strand1_materials',
    seniorSubject: 'science',
    seniorLevel: 'b8',
    seniorHubTitle: 'Materials & Atomic Architecture',
  },
  {
    lessonId: 'b8-sci-t1-atoms-and-the-periodic-table',
    lessonTitle: 'Atoms & the Periodic Table',
    seniorTopicId: 'sci_strand1_materials',
    seniorSubject: 'science',
    seniorLevel: 'b8',
    seniorHubTitle: 'Materials & Atomic Architecture',
  },

  // STRAND 1: DIVERSITY OF MATTER — Living Cells
  {
    lessonId: 'b7-sci-t1-living-cells',
    lessonTitle: 'Living Cells: Animal & Plant Cells',
    seniorTopicId: 'sci_strand1_cells',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Living Cells & Cellular Organization',
  },
  {
    lessonId: 'b8-sci-t1-cells-prokaryotic-and-eukaryotic',
    lessonTitle: 'Prokaryotic & Eukaryotic Cells',
    seniorTopicId: 'sci_strand1_cells',
    seniorSubject: 'science',
    seniorLevel: 'b8',
    seniorHubTitle: 'Living Cells & Cellular Organization',
  },

  // STRAND 2: CYCLES — Earth Science (Water & Carbon Cycles)
  {
    lessonId: 'b7-sci-t2-cycles-earth-science',
    lessonTitle: 'The Water Cycle',
    seniorTopicId: 'sci_strand2_earth_cycles',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Earth Science (Water & Carbon Cycles)',
  },
  {
    lessonId: 'bs7-sci-t1-water-cycle',
    lessonTitle: 'The Water Cycle',
    seniorTopicId: 'sci_strand2_earth_cycles',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Earth Science (Water & Carbon Cycles)',
  },
  {
    lessonId: 'b7-sci-t2-water-cycle',
    lessonTitle: 'The Water Cycle',
    seniorTopicId: 'sci_strand2_earth_cycles',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Earth Science (Water & Carbon Cycles)',
  },
  {
    lessonId: 'b8-sci-t1-the-carbon-cycle',
    lessonTitle: 'The Carbon Cycle',
    seniorTopicId: 'sci_strand2_earth_cycles',
    seniorSubject: 'science',
    seniorLevel: 'b8',
    seniorHubTitle: 'Earth Science (Water & Carbon Cycles)',
  },

  // STRAND 2: CYCLES — Life Cycles
  {
    lessonId: 'b7-sci-t2-cycles-life-cycle-housefly',
    lessonTitle: 'Life Cycle of the Housefly',
    seniorTopicId: 'sci_strand2_life_cycles',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Life Cycle of Organisms',
  },
  {
    lessonId: 'b8-sci-t1-the-anopheles-mosquito-life-cycle',
    lessonTitle: 'The Anopheles Mosquito Life Cycle',
    seniorTopicId: 'sci_strand2_life_cycles',
    seniorSubject: 'science',
    seniorLevel: 'b8',
    seniorHubTitle: 'Life Cycle of Organisms',
  },

  // STRAND 2: CYCLES — Crop Production
  {
    lessonId: 'b7-sci-t2-cycles-crop-production',
    lessonTitle: 'Crop Production (Plant Nutrients & Fertilisers)',
    seniorTopicId: 'sci_strand2_crop_production',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Agricultural Crop Production Systems',
  },
  {
    lessonId: 'b8-sci-t1-seed-beds-and-planting-crops',
    lessonTitle: 'Seed Beds & Planting Crops',
    seniorTopicId: 'sci_strand2_crop_production',
    seniorSubject: 'science',
    seniorLevel: 'b8',
    seniorHubTitle: 'Agricultural Crop Production Systems',
  },

  // STRAND 2: CYCLES — Animal Production
  {
    lessonId: 'b7-sci-t2-cycles-animal-production',
    lessonTitle: 'Animal Production (Domestic Animals)',
    seniorTopicId: 'sci_strand2_animal_production',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Animal Production & Livestock Husbandry',
  },
  {
    lessonId: 'b8-sci-t1-animal-feed-and-water',
    lessonTitle: 'Animal Production: Feed & Water for Growth',
    seniorTopicId: 'sci_strand2_animal_production',
    seniorSubject: 'science',
    seniorLevel: 'b8',
    seniorHubTitle: 'Animal Production & Livestock Husbandry',
  },

  // STRAND 3: SYSTEMS
  {
    lessonId: 'b7-sci-t3-systems-human-body',
    lessonTitle: 'Human Body System (Food & Digestion)',
    seniorTopicId: 'sci_strand3_human_body',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'The Human Body Systems',
  },
  {
    lessonId: 'b7-sci-t3-systems-solar-system',
    lessonTitle: 'The Solar System (Inner Planets)',
    seniorTopicId: 'sci_strand3_solar_system',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'The Solar System',
  },
  {
    lessonId: 'b7-sci-t3-systems-ecosystem',
    lessonTitle: 'Ecosystem (Components & Interactions)',
    seniorTopicId: 'sci_strand3_ecosystems',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Ecosystems, Food Chains & Energy Flow',
  },
  {
    lessonId: 'b7-sci-t3-systems-farming-systems',
    lessonTitle: 'Farming Systems Used in Ghana',
    seniorTopicId: 'sci_strand3_farming_systems',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Farming Systems',
  },

  // STRAND 4: FORCES AND ENERGY
  {
    lessonId: 'b7-sci-t4-energy-forms-and-mechanical',
    lessonTitle: 'Energy (Forms, Uses & Mechanical Energy)',
    seniorTopicId: 'sci_strand4_energy_waves',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Energy, Heat, Light & Waves',
  },
  {
    lessonId: 'b7-sci-t4-energy-heat-and-light',
    lessonTitle: 'Energy (Heat & Light)',
    seniorTopicId: 'sci_strand4_energy_waves',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Energy, Heat, Light & Waves',
  },
  {
    lessonId: 'b7-sci-t4-conversion-and-conservation-of-energy',
    lessonTitle: 'Conversion & Conservation of Energy',
    seniorTopicId: 'sci_strand4_energy_waves',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Energy, Heat, Light & Waves',
  },
  {
    lessonId: 'b7-sci-t4-electricity-generation-and-environment',
    lessonTitle: 'Electricity Generation & the Environment',
    seniorTopicId: 'sci_strand4_electricity',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Electricity & Electronics',
  },
  {
    lessonId: 'b7-sci-t4-electronic-components-and-circuits',
    lessonTitle: 'Electronic Components & Circuits',
    seniorTopicId: 'sci_strand4_electricity',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Electricity & Electronics',
  },
  {
    lessonId: 'b7-sci-t4-forces-magnets-and-newtons-first-law',
    lessonTitle: "Forces, Newton's First Law & Magnets",
    seniorTopicId: 'sci_strand4_forces_mechanics',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Force, Motion & Simple Machines',
  },
  {
    lessonId: 'b7-sci-t4-simple-machines-and-efficiency',
    lessonTitle: 'Simple Machines, Levers & Efficiency',
    seniorTopicId: 'sci_strand4_forces_mechanics',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Force, Motion & Simple Machines',
  },
  {
    lessonId: 'b7-sci-t4-agricultural-tools-handling-and-maintenance',
    lessonTitle: 'Agricultural Tools (Handling & Maintenance)',
    seniorTopicId: 'sci_strand4_agricultural_tools',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Agricultural Tools',
  },

  // STRAND 5: HUMANS AND THE ENVIRONMENT
  {
    lessonId: 'b7-sci-t5-waste-management',
    lessonTitle: 'Waste Management Practices',
    seniorTopicId: 'sci_strand5_waste_management',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Waste Management',
  },
  {
    lessonId: 'b7-sci-t5-nutrients-and-deficiency-diseases',
    lessonTitle: 'Nutrients & Deficiency Diseases',
    seniorTopicId: 'sci_strand5_human_health',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Human Health & Diseases',
  },
  {
    lessonId: 'b7-sci-t5-viral-diseases',
    lessonTitle: 'Viral Diseases (COVID-19, Ebola & H1N1)',
    seniorTopicId: 'sci_strand5_human_health',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Human Health & Diseases',
  },
  {
    lessonId: 'b7-sci-t5-science-careers-and-scientists',
    lessonTitle: 'Careers in Science & Great Scientists',
    seniorTopicId: 'sci_strand5_science_industry',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Science & Industry',
  },
  {
    lessonId: 'b7-sci-t5-climate-change-and-sustainable-energy',
    lessonTitle: 'Climate Change & Sustainable Energy',
    seniorTopicId: 'sci_strand5_climate_change',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Climate Change & Green Economy',
  },
  {
    lessonId: 'b7-sci-t5-landforms-plants-and-animals',
    lessonTitle: "Plants & Animals of Ghana's Landforms",
    seniorTopicId: 'sci_strand5_soil_science',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Understanding the Environment',
  },
  {
    lessonId: 'b7-sci-t5-associations-among-plants-and-animals',
    lessonTitle: 'Associations Among Plants & Animals',
    seniorTopicId: 'sci_strand5_soil_science',
    seniorSubject: 'science',
    seniorLevel: 'b7',
    seniorHubTitle: 'Understanding the Environment',
  },
];

const BY_LESSON_ID = new Map<string, LessonSeniorAcademyMapping>(
  NARRATED_TO_SENIOR_ACADEMY.map((m) => [m.lessonId, m]),
);

export interface SeniorAcademyDeepLink {
  href: string;
  seniorTopicId: string;
  seniorSubject: SeniorAcademySubject;
  seniorLevel: SeniorAcademyLevel;
  seniorHubTitle: string;
}

/**
 * Returns the deep-link URL into Senior Academy's corresponding Topical Lab
 * for a given Narrated Lesson ID, or null if not mapped.
 */
export function getSeniorAcademyLinkForLesson(lessonId: string): SeniorAcademyDeepLink | null {
  const m = BY_LESSON_ID.get(lessonId);
  if (!m) return null;
  const params = new URLSearchParams({
    view: 'topical',
    subject: m.seniorSubject,
    topicId: m.seniorTopicId,
    level: m.seniorLevel,
  });
  return {
    href: `/dashboard/senior-academy?${params.toString()}`,
    seniorTopicId: m.seniorTopicId,
    seniorSubject: m.seniorSubject,
    seniorLevel: m.seniorLevel,
    seniorHubTitle: m.seniorHubTitle,
  };
}

export interface NarratedLessonDeepLink {
  lessonId: string;
  title: string;
  level: SeniorAcademyLevel;
  href: string;
}

/**
 * Returns all Narrated Lessons mapped to a Senior Academy Topical Lab
 * (matching topicId or any of its aliases). Deduplicates legacy water-cycle aliases
 * and prioritizes lessons matching `activeLevel` (b7 / b8 / b9) first.
 */
export function getNarratedLessonsForSeniorTopic(
  topicIdOrAliases: string | string[],
  activeLevel?: string,
): NarratedLessonDeepLink[] {
  const ids = new Set(
    (Array.isArray(topicIdOrAliases) ? topicIdOrAliases : [topicIdOrAliases])
      .filter(Boolean)
      .map((s) => s.toLowerCase()),
  );

  // Deduplicate legacy water-cycle alias IDs so Senior Academy shows one clean Water Cycle pill
  const HIDDEN_LEGACY_IDS = new Set(['bs7-sci-t1-water-cycle', 'b7-sci-t2-water-cycle']);

  const matches = NARRATED_TO_SENIOR_ACADEMY.filter(
    (m) => ids.has(m.seniorTopicId.toLowerCase()) && !HIDDEN_LEGACY_IDS.has(m.lessonId),
  );

  const normalizedLevel = (activeLevel || '').toLowerCase();
  const sorted = [...matches].sort((a, b) => {
    const aMatch = a.seniorLevel === normalizedLevel ? 0 : 1;
    const bMatch = b.seniorLevel === normalizedLevel ? 0 : 1;
    if (aMatch !== bMatch) return aMatch - bMatch;
    return a.seniorLevel.localeCompare(b.seniorLevel);
  });

  return sorted.map((m) => ({
    lessonId: m.lessonId,
    title: m.lessonTitle,
    level: m.seniorLevel,
    href: `/dashboard/narrated-lessons/${encodeURIComponent(m.lessonId)}`,
  }));
}
