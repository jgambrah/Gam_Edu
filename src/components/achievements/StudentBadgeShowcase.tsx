'use client';

import { useMemo } from 'react';
import { BADGE_CATALOG, calculateStudentLevel, EarnedBadge } from '@/lib/achievement-utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, Star, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StudentBadgeShowcaseProps {
  studentName?: string;
  gradeLevel?: string;
  totalPoints?: number;
  earnedBadges?: EarnedBadge[];
  compact?: boolean;
}

export function StudentBadgeShowcase({
  studentName,
  gradeLevel,
  totalPoints = 0,
  earnedBadges = [],
  compact = false
}: StudentBadgeShowcaseProps) {
  const levelInfo = useMemo(() => calculateStudentLevel(totalPoints, gradeLevel), [totalPoints, gradeLevel]);
  const xpProgress = useMemo(() => {
    const range = levelInfo.maxXp - levelInfo.minXp;
    const currentInRange = totalPoints - levelInfo.minXp;
    return Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));
  }, [totalPoints, levelInfo]);

  const isBadgeUnlocked = (catalogId: string, catalogTitle: string) => {
    return (earnedBadges || []).some((eb: any) => {
      if (!eb) return false;
      if (eb.id && (eb.id === catalogId || eb.id.startsWith(`${catalogId}_`))) return true;
      if (eb.title && eb.title.toLowerCase() === catalogTitle.toLowerCase()) return true;
      return false;
    });
  };

  const getEarnedBadge = (catalogId: string, catalogTitle: string) => {
    return (earnedBadges || []).find((eb: any) => {
      if (!eb) return false;
      if (eb.id && (eb.id === catalogId || eb.id.startsWith(`${catalogId}_`))) return true;
      if (eb.title && eb.title.toLowerCase() === catalogTitle.toLowerCase()) return true;
      return false;
    });
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-4 rounded-2xl shadow-md border border-indigo-700/50">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400 animate-pulse" />
            <span className="font-extrabold text-sm tracking-wide">
              {studentName ? `${studentName}'s Gamification Profile` : 'Student Achievements'}
            </span>
          </div>
          <Badge className={`${levelInfo.badgeColor} text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-sm`}>
            Level {levelInfo.level} • {levelInfo.title}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="text-indigo-200">Total Reward Points: <strong className="text-amber-300 font-mono text-sm">{totalPoints} XP</strong></span>
          <span className="text-indigo-300 font-mono text-[10px]">{totalPoints} / {levelInfo.maxXp} XP</span>
        </div>
        <Progress value={xpProgress} className="h-2 bg-indigo-950/60" />

        <div className="mt-3 pt-3 border-t border-indigo-800/60 flex items-center gap-2 overflow-x-auto pb-1">
          {BADGE_CATALOG.map(b => {
            const isUnlocked = isBadgeUnlocked(b.id, b.title);
            return (
              <TooltipProvider key={b.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`shrink-0 h-9 w-9 rounded-xl flex items-center justify-center text-lg border transition-all ${
                      isUnlocked 
                        ? `${b.badgeBg} ${b.badgeBorder} shadow-sm scale-105` 
                        : 'bg-indigo-950/40 border-indigo-800/50 opacity-40 grayscale'
                    }`}>
                      {b.icon}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 text-white border-slate-700 text-xs p-2 max-w-xs">
                    <p className="font-bold flex items-center gap-1">{b.icon} {b.title} {isUnlocked ? '✅' : '🔒'}</p>
                    <p className="text-[11px] text-slate-300">{b.description}</p>
                    <p className="text-[10px] text-amber-400 font-mono mt-1">+{b.xpReward} XP</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Card className="border border-slate-100 shadow-md rounded-2xl overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-400" />
              <CardTitle className="text-xl font-black tracking-tight">
                {studentName ? `${studentName}'s Achievements` : 'Student Gamification Hub'}
              </CardTitle>
            </div>
            <CardDescription className="text-indigo-200 text-xs mt-1">
              Level up by attending class, taking quizzes, and completing library reading goals!
            </CardDescription>
          </div>
          <Badge className={`${levelInfo.badgeColor} text-white font-extrabold text-sm px-4 py-1.5 rounded-full shadow-md`}>
            Level {levelInfo.level} • {levelInfo.title}
          </Badge>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-indigo-200">Total Points Accumulation:</span>
            <span className="text-amber-300 font-mono">{totalPoints} / {levelInfo.maxXp} XP</span>
          </div>
          <Progress value={xpProgress} className="h-2.5 bg-indigo-950/80" />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-purple-600" /> Digital Badges Catalog ({(earnedBadges || []).length}/{BADGE_CATALOG.length} Unlocked)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {BADGE_CATALOG.map(badge => {
              const earned = getEarnedBadge(badge.id, badge.title);
              const isUnlocked = !!earned;

              return (
                <div 
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isUnlocked 
                      ? `${badge.badgeBg} ${badge.badgeBorder} shadow-sm` 
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-3xl">{badge.icon}</span>
                      {isUnlocked ? (
                        <Badge className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Unlocked
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-400 border-slate-300 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Locked
                        </Badge>
                      )}
                    </div>
                    <h5 className="font-extrabold text-slate-900 text-sm">{badge.title}</h5>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">{badge.description}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-200/60 flex justify-between items-center text-[10px] font-bold">
                    <span className="text-purple-700 font-mono">+{badge.xpReward} XP</span>
                    {isUnlocked && (
                      <span className="text-slate-400 font-mono">
                        {new Date(earned.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
