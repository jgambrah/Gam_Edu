import { awardActivityXpAction, recordGamificationEventsAction } from '@/app/actions/gamification';
import { BADGE_CATALOG, type BadgeCatalogItem, type EarnedBadge, type GamificationEvent } from './badge-rules';

export { BADGE_CATALOG, computeBadgeUpdate } from './badge-rules';
export type { BadgeCatalogItem, EarnedBadge, GamificationEvent, GamificationEventType } from './badge-rules';

export function getGradeTier(gradeLevel?: string): 'preschool' | 'lower_primary' | 'upper_primary' | 'secondary' {
  if (!gradeLevel) return 'lower_primary';
  const str = gradeLevel.toLowerCase();

  // Guard against raw Firestore UIDs (15+ alphanumeric chars)
  if (/^[a-zA-Z0-9_-]{15,}$/.test(str) && !str.includes('nursery') && !str.includes('class') && !str.includes('primary')) {
    return 'lower_primary';
  }

  // Pre-school matching: Nursery, KG, Kindergarten, Creche, Reception, Pre-School
  if (/kg|nursery|creche|kindergarten|reception|pre-school/i.test(str)) return 'preschool';

  // Secondary / JHS / SHS matching: BS 7-9, JHS 1-3, SHS, Form, Year 7+
  if (/bs-?[7-9]|bs\s*[7-9]|jhs|shs|form|year\s*(?:[7-9]|1[0-2])|grade\s*(?:[7-9]|1[0-2])/i.test(str)) return 'secondary';

  // Upper Primary matching: BS 4-6, Class 4-6, Primary 4-6, Year 4-6, Grade 4-6, P4-6
  if (/bs-?[4-6]|bs\s*[4-6]|class\s*[4-6]|primary\s*[4-6]|year\s*[4-6]|grade\s*[4-6]|\bp[4-6]\b/i.test(str)) return 'upper_primary';

  // Lower Primary matching: BS 1-3, Class 1-3, Primary 1-3, Year 1-3, Grade 1-3, P1-3
  if (/bs-?[1-3]|bs\s*[1-3]|class\s*[1-3]|primary\s*[1-3]|year\s*[1-3]|grade\s*[1-3]|\bp[1-3]\b/i.test(str)) return 'lower_primary';

  return 'lower_primary';
}

export function calculateStudentLevel(totalXp: number = 0, gradeLevel?: string) {
  const tier = getGradeTier(gradeLevel);

  const titles = {
    preschool: ['Junior Explorer', 'Star Cadet', 'Bright Adventurer', 'Little Mastermind'],
    lower_primary: ['Young Scholar', 'Rising Star', 'Academic Pathfinder', 'Primary Champion'],
    upper_primary: ['Academic Pioneer', 'Knowledge Achiever', 'Honor Scholar', 'Grand Mastermind'],
    secondary: ['Junior Fellow', 'Distinction Scholar', 'Honor Vanguard', 'Academic Laureate'],
  }[tier];

  if (totalXp >= 1000) return { level: 4, title: titles[3], minXp: 1000, maxXp: 2000, badgeColor: 'bg-purple-600', badgeText: 'text-purple-600' };
  if (totalXp >= 500) return { level: 3, title: titles[2], minXp: 500, maxXp: 999, badgeColor: 'bg-indigo-600', badgeText: 'text-indigo-600' };
  if (totalXp >= 200) return { level: 2, title: titles[1], minXp: 200, maxXp: 499, badgeColor: 'bg-blue-600', badgeText: 'text-blue-600' };
  return { level: 1, title: titles[0], minXp: 0, maxXp: 199, badgeColor: 'bg-emerald-600', badgeText: 'text-emerald-600' };
}

// Events raised in the same moment (e.g. saving a whole attendance register) go to the server together.
type PendingEvent = { studentId: string; event: GamificationEvent; done: () => void };
let pendingEvents: PendingEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function flushEvents() {
  flushTimer = null;
  const batch = pendingEvents;
  pendingEvents = [];
  if (batch.length === 0) return;
  recordGamificationEventsAction(batch.map(b => ({ studentId: b.studentId, event: b.event })))
    .then(results => {
      results.forEach((r, i) => { if (r && !r.success && r.error) console.warn('Badge event not recorded:', batch[i]?.studentId, r.error); });
    })
    .catch(err => console.error('Error triggering student badge events:', err))
    .finally(() => batch.forEach(b => b.done()));
}

/**
 * Event-Driven Badge Evaluator.
 * Called during write events (attendance mark, quiz submit, library return, activities). The badge rules
 * now run on the server, which checks who is asking: students and parents can only record their own
 * learning activities, and attendance / manual awards come from school staff. (Before, any signed-in
 * user could write XP and badges straight into any student's record.)
 * The `firestore` argument is kept so existing callers do not change.
 */
export async function triggerStudentBadgeEvent(
  firestore: any,
  studentId: string,
  event: GamificationEvent
) {
  if (!studentId || !event?.type) return;
  await new Promise<void>(resolve => {
    pendingEvents.push({ studentId, event, done: resolve });
    if (!flushTimer) flushTimer = setTimeout(flushEvents, 50);
  });
}

/**
 * Direct Activity XP Awarder
 * Awards XP to a student for completing module-specific activities (Science Club, Maths Club, ELA, Think Tank, Senior Academy).
 * Runs on the server with a per-activity and a daily limit for self-earned XP.
 */
export async function awardActivityXP(
  firestore: any,
  studentId: string,
  xpAmount: number,
  activityName?: string,
  badgeId?: string
) {
  if (!studentId || !(xpAmount > 0)) return;
  try {
    const res = await awardActivityXpAction(studentId, xpAmount, activityName, badgeId);
    if (!res.success && res.error) console.warn('XP not awarded:', res.error);
  } catch (err) {
    console.error('Error awarding activity XP:', err);
  }
}
