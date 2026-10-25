import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TypingSession, UserStats } from '../types';
import { getCoachingInsight } from '../utils/coach';
import { RotateCcw, ArrowRight, BarChart2, Sparkles, CheckCircle2, Award, Zap, Clock, ShieldAlert } from 'lucide-react';

interface ResultsModalProps {
  session: TypingSession;
  stats: UserStats;
  isPersonalBest: boolean;
  onRestart: () => void;
  onNextLesson?: () => void;
  onGoToDashboard: () => void;
  onClose: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  session,
  stats,
  isPersonalBest,
  onRestart,
  onNextLesson,
  onGoToDashboard,
  onClose,
}) => {
  const coachInsight = getCoachingInsight(session, stats, isPersonalBest);

  useEffect(() => {
    if (isPersonalBest || session.accuracy >= 98) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#6366f1'],
          disableForReducedMotion: true,
        });
      } catch {}
    }
  }, [isPersonalBest, session.accuracy]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Header with Coach Insight */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            {isPersonalBest ? (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personal Best Achieved!</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Session Complete</span>
              </>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {coachInsight.headline}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            {coachInsight.advice}
          </p>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* WPM */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 text-center">
            <span className="text-xs uppercase font-medium tracking-wider text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              WPM
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              {session.wpm}
            </div>
            {stats.bestWpm > 0 && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                Best: {stats.bestWpm}
              </span>
            )}
          </div>

          {/* Accuracy */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 text-center">
            <span className="text-xs uppercase font-medium tracking-wider text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              Accuracy
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              {session.accuracy}%
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {session.accuracy >= 95 ? 'Great control' : 'Keep practicing'}
            </span>
          </div>

          {/* Time */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 text-center">
            <span className="text-xs uppercase font-medium tracking-wider text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Time
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {session.durationSeconds}s
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {session.wordsCount} words
            </span>
          </div>

          {/* Errors */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 text-center">
            <span className="text-xs uppercase font-medium tracking-wider text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Typos
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {session.errors}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {session.errors === 0 ? 'Clean run' : 'Natural to make'}
            </span>
          </div>
        </div>

        {/* Comparison with Average */}
        {stats.sessionsCount > 1 && (
          <div className="p-3 mb-6 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between border border-slate-200/50 dark:border-slate-700/40">
            <span>Overall Average: <strong>{stats.avgWpm} WPM</strong> &middot; <strong>{stats.avgAccuracy}% Accuracy</strong></span>
            <span className="text-emerald-500 font-medium">
              {session.wpm >= stats.avgWpm ? `+${session.wpm - stats.avgWpm} above avg` : 'Keep rhythm steady'}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white transition-all shadow-sm shadow-emerald-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            Practice Again
          </button>

          {onNextLesson && (
            <button
              onClick={onNextLesson}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 active:scale-[0.99] text-white transition-all"
            >
              <span>Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onGoToDashboard}
            className="py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
          >
            <BarChart2 className="w-4 h-4" />
            <span className="hidden sm:inline">Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
