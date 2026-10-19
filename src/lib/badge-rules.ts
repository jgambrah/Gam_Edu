/**
 * Badge catalogue and badge rules — no Firebase imports, so both the browser and the server can use them.
 * (Moved out of achievement-utils.ts so that XP and badges are awarded on the server.)
 */
export interface EarnedBadge {
  id: string;
  title: string;
  category: 'attendance' | 'academics' | 'reading' | 'character';
  unlockedAt: string;
  xpAwarded: number;
}

export interface BadgeCatalogItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'attendance' | 'academics' | 'reading' | 'character';
  xpReward: number;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const BADGE_CATALOG: BadgeCatalogItem[] = [
  {
    id: 'attendance_streak_30',
    title: 'Attendance Titan',
    description: 'Maintained 30 days of 100% perfect school attendance.',
    icon: '🛡️',
    category: 'attendance',
    xpReward: 200,
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200'
  },
  {
    id: 'punctuality_pro',
    title: 'Punctuality Pro',
    description: 'Arrived early with zero tardiness logs.',
    icon: '⚡',
    category: 'attendance',
    xpReward: 150,
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    badgeBorder: 'border-blue-200'
  },
  {
    id: 'quiz_master_90',
    title: 'Quiz Master',
    description: 'Scored 90% or higher on an academic quiz.',
    icon: '🎯',
    category: 'academics',
    xpReward: 100,
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-200'
  },
  {
    id: 'quiz_streak_3',
    title: 'Triple Star Scholar',
    description: 'Achieved 90%+ scores on 3 consecutive quizzes.',
    icon: '🌟',
    category: 'academics',
    xpReward: 250,
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200'
  },
  {
    id: 'bookworm',
    title: 'Avid Reader',
    description: 'Borrowed and completed 5 or more library books.',
    icon: '📚',
    category: 'reading',
    xpReward: 150,
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200'
  },
  {
    id: 'stem_explorer',
    title: 'STEM Pioneer',
    description: 'Completed coding, maths, or science club challenges.',
    icon: '🔬',
    category: 'academics',
    xpReward: 150,
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-800',
    badgeBorder: 'border-cyan-200'
  },
  {
    id: 'honor_roll',
    title: 'Honor Roll Star',
    description: 'Achieved an overall gradebook average of 85% or higher.',
    icon: '🏆',
    category: 'academics',
    xpReward: 300,
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-800',
    badgeBorder: 'border-yellow-200'
  },
  {
    id: 'kindness_hero',
    title: 'Kindness Ambassador',
    description: 'Awarded by teachers for exceptional character and leadership.',
    icon: '🤝',
    category: 'character',
    xpReward: 100,
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-200'
  }
];

export type GamificationEventType = 'ATTENDANCE_PRESENT' | 'ATTENDANCE_TARDY' | 'QUIZ_SUBMITTED' | 'LIBRARY_BOOK_RETURNED' | 'STEM_CHALLENGE_COMPLETED' | 'MANUAL_TEACHER_AWARD';
export interface GamificationEvent {
  type: GamificationEventType;
  quizScorePercent?: number;
  customBadgeId?: string;
}

/**
 * Pure badge rules: given the student's current document and an event, returns the counter fields to
 * set and the badges newly earned. Used by the server (src/app/actions/gamification.ts), which applies them.
 */
export function computeBadgeUpdate(studentData: any, event: GamificationEvent): { fields: Record<string, number>; newBadges: BadgeCatalogItem[] } {
  studentData = studentData || {};
  const existingBadges: EarnedBadge[] = studentData.earnedBadges || [];
  const hasBadge = (badgeId: string) => existingBadges.some(b => b.id === badgeId || (b.id && b.id.startsWith(`${badgeId}_`)));

  const updatePayload: Record<string, any> = {};
  const newBadgesToAward: BadgeCatalogItem[] = [];

  let currentAttendanceStreak = Number(studentData.attendanceStreak || 0);
  let currentQuizStreak90 = Number(studentData.quizStreak90 || 0);
  let currentBooksCount = Number(studentData.booksReadCount || 0);
  let currentStemCount = Number(studentData.stemCount || 0);

  // 1. ATTENDANCE EVENT
  if (event.type === 'ATTENDANCE_PRESENT') {
    currentAttendanceStreak += 1;
    updatePayload.attendanceStreak = currentAttendanceStreak;

    if (currentAttendanceStreak >= 30 && !hasBadge('attendance_streak_30')) {
      const cat = BADGE_CATALOG.find(b => b.id === 'attendance_streak_30');
      if (cat) newBadgesToAward.push(cat);
    }
  } else if (event.type === 'ATTENDANCE_TARDY') {
    updatePayload.attendanceStreak = 0; // Reset streak on absence/tardy
  }

  // 2. QUIZ EVENT
  if (event.type === 'QUIZ_SUBMITTED' && typeof event.quizScorePercent === 'number') {
    if (event.quizScorePercent >= 90) {
      currentQuizStreak90 += 1;
      updatePayload.quizStreak90 = currentQuizStreak90;

      if (!hasBadge('quiz_master_90')) {
        const cat = BADGE_CATALOG.find(b => b.id === 'quiz_master_90');
        if (cat) newBadgesToAward.push(cat);
      }
      if (currentQuizStreak90 >= 3 && !hasBadge('quiz_streak_3')) {
        const cat = BADGE_CATALOG.find(b => b.id === 'quiz_streak_3');
        if (cat) newBadgesToAward.push(cat);
      }
    } else {
      updatePayload.quizStreak90 = 0;
    }
  }

  // 3. LIBRARY EVENT
  if (event.type === 'LIBRARY_BOOK_RETURNED') {
    currentBooksCount += 1;
    updatePayload.booksReadCount = currentBooksCount;

    if (currentBooksCount >= 5 && !hasBadge('bookworm')) {
      const cat = BADGE_CATALOG.find(b => b.id === 'bookworm');
      if (cat) newBadgesToAward.push(cat);
    }
  }

  // 4. STEM / CYBER LOGIC ARCADE EVENT
  if (event.type === 'STEM_CHALLENGE_COMPLETED') {
    currentStemCount += 1;
    updatePayload.stemCount = currentStemCount;

    if (!hasBadge('stem_explorer')) {
      const cat = BADGE_CATALOG.find(b => b.id === 'stem_explorer');
      if (cat) newBadgesToAward.push(cat);
    }
  }

  // 5. MANUAL TEACHER AWARD (Always cumulative)
  if (event.type === 'MANUAL_TEACHER_AWARD' && event.customBadgeId) {
    const cat = BADGE_CATALOG.find(b => b.id === event.customBadgeId);
    if (cat) {
      newBadgesToAward.push(cat);
    }
  }

  const fields: Record<string, number> = {};
  Object.entries(updatePayload).forEach(([k, v]) => { if (typeof v === 'number') fields[k] = v; });
  return { fields, newBadges: newBadgesToAward };
}
