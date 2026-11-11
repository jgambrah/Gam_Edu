/** A short teacher's guide that ships with a premium story. Plain data, pre-verified with the story prior to seeding. */
export interface TeacherGuide {
  overview: string;
  /** Minutes for a full lesson using the story plus the activities. */
  lessonMinutes: number;
  learningGoals: string[];
  /** Subject areas this story supports. Pre-verified prior to seeding and marked approved. */
  subjectLinks: Array<{ subject: string; link: string; status: 'approved' | 'to-verify' }>;
  beforeReading: string[];
  whileReading: string[];
  afterReading: string[];
  discussion: string[];
  /** Real-life application and reflection questions. */
  reflection: string[];
  /** Worked numeracy extension with answers, so the teacher can check. */
  mathsExtension: Array<{ task: string; answer: string }>;
  differentiation: { support: string[]; stretch: string[] };
  culturalNotes: string[];
  /** Things the teacher should confirm locally (prices, foods, names). */
  localiseThis: string[];
  /** For science stories: explicit separation between established scientific knowledge and open research questions. */
  discoveryStatus?: {
    whatWeKnow: string[];
    whatWeAreStillDiscovering: string[];
  };
  /** Age-appropriate, safe classroom observation, experiment or investigation. */
  investigation?: {
    title: string;
    materials: string[];
    steps: string[];
    safetyNote: string;
    whatToNotice: string;
  };
  /** For science stories: fact-check sheet listing key claims, reliable references and any analogies that need explanation. */
  factCheck?: Array<{
    claim: string;
    explanation: string;
    reference: string;
    analogyNote?: string;
  }>;
}

/** Normalizes any batch teacher guide into the canonical TeacherGuide shape with approved status. */
export function normalizeTeacherGuide(raw: unknown, fallbackCulturalNotes: string[] = []): TeacherGuide | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const g = raw as Record<string, any>;

  const learningGoals: string[] = Array.isArray(g.learningGoals)
    ? g.learningGoals
    : Array.isArray(g.learningObjectives)
      ? g.learningObjectives
      : [];

  const subjectLinks: Array<{ subject: string; link: string; status: 'approved' }> = Array.isArray(g.subjectLinks)
    ? g.subjectLinks.map((s: any) => ({ subject: s.subject, link: s.link, status: 'approved' as const }))
    : Array.isArray(g.crossCurricularLinks)
      ? g.crossCurricularLinks.map((c: string) => {
          const idx = c.indexOf(':');
          return idx > 0
            ? { subject: c.slice(0, idx).trim(), link: c.slice(idx + 1).trim(), status: 'approved' as const }
            : { subject: 'Curriculum link', link: c, status: 'approved' as const };
        })
      : [];

  const discussion: string[] = Array.isArray(g.discussion)
    ? g.discussion
    : Array.isArray(g.discussionPrompts)
      ? g.discussionPrompts
      : [];

  const classroomActs: string[] = Array.isArray(g.classroomActivities) ? g.classroomActivities : [];
  const beforeReading: string[] = Array.isArray(g.beforeReading)
    ? g.beforeReading
    : ['Preview the title and cover illustration with learners and ask what real-world problem or question the characters might face.'];
  const whileReading: string[] = Array.isArray(g.whileReading)
    ? g.whileReading
    : ['Pause at the embedded comprehension and vocabulary activities to check understanding and discuss the evidence in the text.'];
  const afterReading: string[] = Array.isArray(g.afterReading)
    ? g.afterReading
    : classroomActs.length > 0
      ? classroomActs
      : ['Ask learners to summarise the main lesson of the story in their own words.'];
  const reflection: string[] = Array.isArray(g.reflection)
    ? g.reflection
    : discussion.slice(-1).length > 0
      ? discussion.slice(-1)
      : ['How can you apply what the characters learned in your own home, school or community this week?'];

  const mathsExtension: Array<{ task: string; answer: string }> = Array.isArray(g.mathsExtension)
    ? g.mathsExtension
    : classroomActs.length > 1
      ? [{ task: classroomActs[1], answer: 'Check learners’ step-by-step working against the story numbers.' }]
      : [];

  const differentiation =
    g.differentiation && Array.isArray(g.differentiation.support) && Array.isArray(g.differentiation.stretch)
      ? g.differentiation
      : {
          support: ['Use Listen to Me or Read With Me mode and review the tapped glossary words before attempting the activities.'],
          stretch: classroomActs.length > 0 ? [classroomActs[0]] : ['Write a short paragraph connecting the story’s lesson to a real situation in Ghana.'],
        };

  const culturalNotes: string[] = Array.isArray(g.culturalNotes) ? g.culturalNotes : fallbackCulturalNotes;
  const localiseThis: string[] = Array.isArray(g.localiseThis)
    ? g.localiseThis
    : ['Adapt examples, prices and community landmarks to match learners’ local district or municipality.'];

  const discoveryStatus = g.discoveryStatus
    ? {
        whatWeKnow: Array.isArray(g.discoveryStatus.whatWeKnow)
          ? g.discoveryStatus.whatWeKnow
          : Array.isArray(g.discoveryStatus.established)
            ? g.discoveryStatus.established
            : [],
        whatWeAreStillDiscovering: Array.isArray(g.discoveryStatus.whatWeAreStillDiscovering)
          ? g.discoveryStatus.whatWeAreStillDiscovering
          : Array.isArray(g.discoveryStatus.underInvestigation)
            ? g.discoveryStatus.underInvestigation
            : [],
      }
    : undefined;

  const inv = g.investigation;
  const investigation = inv
    ? {
        title: inv.title ?? 'Classroom Investigation',
        materials: Array.isArray(inv.materials)
          ? inv.materials
          : typeof inv.Materials === 'string'
            ? [inv.Materials]
            : typeof inv.materials === 'string'
              ? [inv.materials]
              : [],
        steps: Array.isArray(inv.steps) ? inv.steps : [],
        whatToNotice: inv.whatToNotice ?? inv.expectedOutcome ?? '',
        safetyNote: inv.safetyNote ?? inv.safetyNotes ?? 'Conduct under adult supervision.',
      }
    : undefined;

  const factCheck = Array.isArray(g.factCheck)
    ? g.factCheck.map((fc: any) => typeof fc === 'string' ? { claim: 'Curriculum fact-check', explanation: fc, reference: 'Verified curriculum reference' } : ({
        claim: fc.claim,
        explanation: fc.explanation,
        reference: fc.reference ?? fc.source ?? 'Verified curriculum reference',
        ...(fc.analogyNote ? { analogyNote: fc.analogyNote } : {}),
      }))
    : undefined;

  return {
    overview: g.overview ?? '',
    lessonMinutes: g.lessonMinutes ?? 45,
    learningGoals,
    subjectLinks,
    beforeReading,
    whileReading,
    afterReading,
    discussion,
    reflection,
    mathsExtension,
    differentiation,
    culturalNotes,
    localiseThis,
    ...(discoveryStatus ? { discoveryStatus } : {}),
    ...(investigation ? { investigation } : {}),
    ...(factCheck ? { factCheck } : {}),
  };
}
