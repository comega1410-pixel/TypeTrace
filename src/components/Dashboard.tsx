import React from 'react';
import { UserStats, TypingSession } from '../types';
import { ALL_BADGES } from '../data/badges';
import { getDashboardCoachTip } from '../utils/coach';
import {
  Flame,
  Award,
  Zap,
  Target,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  TrendingUp,
  History,
  Lock,
  CheckCircle,
} from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
  sessions: TypingSession[];
  onStartPractice: (mode?: string) => void;
  onSelectLevel: (levelId: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  sessions,
  onStartPractice,
  onSelectLevel,
}) => {
  const coachTip = getDashboardCoachTip(stats);
  const recentSessions = sessions.slice(0, 7);

  // SVG Trend Chart data calculations
  const chartSessions = [...sessions].slice(0, 15).reverse();
  const maxWpm = Math.max(...chartSessions.map((s) => s.wpm), 40);

  const formatPracticeTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = (mins / 60).toFixed(1);
    return `${hours}h`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8 animate-in fade-in duration-300">
      {/* 1. Coach Recommendation Banner ("What should I practice next?") */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 sm:p-7 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coach Insight & Next Step</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {coachTip.headline}
            </h2>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              {coachTip.message}
            </p>
          </div>

          <button
            onClick={() => onStartPractice()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all duration-150 shadow-md shadow-emerald-500/20 active:scale-95 shrink-0"
          >
            <span>{coachTip.actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Grid ("How am I doing?") */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>How Am I Doing?</span>
          </h3>
          <span className="text-xs text-slate-500">Live progress snapshot</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Best WPM */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span className="uppercase tracking-wider">Top Speed</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.bestWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Avg: {stats.avgWpm} WPM
            </div>
          </div>

          {/* Average Accuracy */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span className="uppercase tracking-wider">Accuracy</span>
              <Target className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.avgAccuracy || 100}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Across {stats.sessionsCount} sessions
            </div>
          </div>

          {/* Practice Streak */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span className="uppercase tracking-wider">Practice Streak</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.currentStreak} <span className="text-xs font-normal text-slate-400">days</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Best: {stats.bestStreak} days
            </div>
          </div>

          {/* Practice Time */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span className="uppercase tracking-wider">Total Practice</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatPracticeTime(stats.totalTimeSeconds)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats.totalWords.toLocaleString()} words typed
            </div>
          </div>
        </div>
      </div>

      {/* 3. Progress Visualizer ("Am I improving?") */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Speed & Consistency Progression</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual history of your recent practice runs
            </p>
          </div>
          {chartSessions.length > 1 && (
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> WPM
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Accuracy %
              </span>
            </div>
          )}
        </div>

        {chartSessions.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
            Complete your first session to see your progress curve here!
          </div>
        ) : (
          <div className="space-y-4">
            {/* SVG Line / Bar Chart */}
            <div className="h-44 w-full flex items-end gap-2 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-slate-800">
              {chartSessions.map((s, idx) => {
                const heightPercent = Math.max(12, Math.min(100, (s.wpm / maxWpm) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group relative h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-1 rounded bg-slate-950 text-white text-[10px] pointer-events-none whitespace-nowrap z-20 shadow">
                      {s.wpm} WPM &middot; {s.accuracy}%
                    </div>

                    {/* Bar */}
                    <div
                      className="w-full max-w-[28px] rounded-t-md bg-emerald-500/80 group-hover:bg-emerald-400 transition-all duration-300 relative overflow-hidden"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div
                        className="absolute bottom-0 inset-x-0 bg-blue-500/40"
                        style={{ height: `${s.accuracy}%` }}
                      />
                    </div>

                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                      {s.wpm}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 px-2">
              <span>Earlier runs</span>
              <span>Latest session</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Recent Sessions ("What did I practice?") */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-500" />
            <span>Recent Sessions</span>
          </h3>
          <span className="text-xs text-slate-500">
            {sessions.length} total logged
          </span>
        </div>

        {recentSessions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            No practice sessions recorded yet. Start your first exercise above!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="py-3 flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono text-xs font-bold">
                    {session.wpm}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                      {session.modeDetail || `${session.mode} practice`}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &middot; {session.durationSeconds}s &middot; {session.wordsCount} words
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    session.accuracy >= 95
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {session.accuracy}% acc
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {session.errors === 0 ? 'No typos' : `${session.errors} typos`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Gentle Gamification: Badges & Achievements */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Milestone Badges</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Gentle personal achievements unlocked through relaxed consistency
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {stats.unlockedBadgeIds.length} / {ALL_BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30 text-slate-800 dark:text-slate-100'
                    : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800/80 opacity-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">
                      {isUnlocked ? (
                        <CheckCircle className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      {badge.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
