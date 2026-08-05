import { doc, updateDoc, arrayUnion, increment, getDoc, serverTimestamp } from 'firebase/firestore';

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

export function calculateStudentLevel(totalXp: number = 0) {
  if (totalXp >= 1000) return { level: 4, title: 'Master Scholar', minXp: 1000, maxXp: 2000, badgeColor: 'bg-purple-600', badgeText: 'text-purple-600' };
  if (totalXp >= 500) return { level: 3, title: 'Honor Student', minXp: 500, maxXp: 999, badgeColor: 'bg-indigo-600', badgeText: 'text-indigo-600' };
  if (totalXp >= 200) return { level: 2, title: 'Rising Scholar', minXp: 200, maxXp: 499, badgeColor: 'bg-blue-600', badgeText: 'text-blue-600' };
  return { level: 1, title: 'Junior Explorer', minXp: 0, maxXp: 199, badgeColor: 'bg-emerald-600', badgeText: 'text-emerald-600' };
}

/**
 * Event-Driven Badge Evaluator (0 Extra Reads Overhead)
 * Called ONLY during write events (Attendance mark, Quiz submit, Library return)
 */
export async function triggerStudentBadgeEvent(
  firestore: any,
  studentId: string,
  event: {
    type: 'ATTENDANCE_PRESENT' | 'ATTENDANCE_TARDY' | 'QUIZ_SUBMITTED' | 'LIBRARY_BOOK_RETURNED' | 'MANUAL_TEACHER_AWARD';
    quizScorePercent?: number;
    customBadgeId?: string;
  }
) {
  if (!firestore || !studentId) return;

  try {
    const studentRef = doc(firestore, 'students', studentId);
    const snap = await getDoc(studentRef);
    if (!snap.exists()) return;

    const studentData = snap.data();
    const existingBadges: EarnedBadge[] = studentData.earnedBadges || [];
    const hasBadge = (badgeId: string) => existingBadges.some(b => b.id === badgeId);

    const updatePayload: Record<string, any> = {};
    const newBadgesToAward: BadgeCatalogItem[] = [];

    let currentAttendanceStreak = Number(studentData.attendanceStreak || 0);
    let currentQuizStreak90 = Number(studentData.quizStreak90 || 0);
    let currentBooksCount = Number(studentData.booksReadCount || 0);

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

    // 4. MANUAL TEACHER AWARD
    if (event.type === 'MANUAL_TEACHER_AWARD' && event.customBadgeId) {
      const cat = BADGE_CATALOG.find(b => b.id === event.customBadgeId);
      if (cat && !hasBadge(cat.id)) {
        newBadgesToAward.push(cat);
      }
    }

    // Apply unlocks and atomic field updates
    if (newBadgesToAward.length > 0) {
      let extraXp = 0;
      const formattedEarned: EarnedBadge[] = newBadgesToAward.map(b => {
        extraXp += b.xpReward;
        return {
          id: b.id,
          title: b.title,
          category: b.category,
          unlockedAt: new Date().toISOString(),
          xpAwarded: b.xpReward
        };
      });

      updatePayload.earnedBadges = arrayUnion(...formattedEarned);
      updatePayload.totalPoints = increment(extraXp);
    }

    if (Object.keys(updatePayload).length > 0) {
      updatePayload.lastGamificationUpdate = serverTimestamp();
      await updateDoc(studentRef, updatePayload);
    }
  } catch (err) {
    console.error('Error triggering student badge event:', err);
  }
}
