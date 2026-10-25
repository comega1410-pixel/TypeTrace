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
          colors: ['#00d49a', '#38bdf8', '#fbbf24', '#818cf8'],
          disableForReducedMotion: true,
        });
      } catch {}
    }
  }, [isPersonalBest, session.accuracy]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-[#0f1728]/95 backdrop-blur-xl border border-white/15 shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Header with Coach Insight */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00d49a]/20 text-[#00d49a] border border-[#00d49a]/40 mb-3 shadow-sm">
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
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
            {coachInsight.headline}
          </h2>
          <p className="text-sm text-slate-200 mt-2 max-w-md mx-auto leading-relaxed">
            {coachInsight.advice}
          </p>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* WPM */}
          <div className="p-4 rounded-xl bg-[#162238]/90 border border-white/10 text-center shadow-md">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-300 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              WPM
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1 drop-shadow-sm">
              {session.wpm}
            </div>
            {stats.bestWpm > 0 && (
              <span className="text-[11px] text-slate-400 mt-0.5 block font-medium">
                Best: {stats.bestWpm}
              </span>
            )}
          </div>

          {/* Accuracy */}
          <div className="p-4 rounded-xl bg-[#162238]/90 border border-white/10 text-center shadow-md">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-300 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#00d49a]" />
              Accuracy
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1 drop-shadow-sm">
              {session.accuracy}%
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block font-medium">
              {session.accuracy >= 95 ? 'Great control' : 'Keep practicing'}
            </span>
          </div>

          {/* Time */}
          <div className="p-4 rounded-xl bg-[#162238]/90 border border-white/10 text-center shadow-md">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-300 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Time
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 drop-shadow-sm">
              {session.durationSeconds}s
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block font-medium">
              {session.wordsCount} words
            </span>
          </div>

          {/* Typos */}
          <div className="p-4 rounded-xl bg-[#162238]/90 border border-white/10 text-center shadow-md">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-300 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Typos
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 drop-shadow-sm">
              {session.errors}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block font-medium">
              {session.errors === 0 ? 'Clean run' : 'Natural to make'}
            </span>
          </div>
        </div>

        {/* Comparison with Average */}
        {stats.sessionsCount > 1 && (
          <div className="p-3 mb-6 rounded-xl bg-[#162238]/80 text-xs text-slate-200 flex items-center justify-between border border-white/10 shadow-sm">
            <span>
              Overall Average: <strong className="text-white font-bold">{stats.avgWpm} WPM</strong> &middot;{' '}
              <strong className="text-white font-bold">{stats.avgAccuracy}% Accuracy</strong>
            </span>
            <span className="text-[#00d49a] font-bold">
              {session.wpm >= stats.avgWpm ? `+${session.wpm - stats.avgWpm} above avg` : 'Keep rhythm steady'}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-[#00d49a] hover:bg-[#00d49a]/90 active:scale-[0.99] text-[#0b0f14] transition-all shadow-md shadow-[#00d49a]/30 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Practice Again
          </button>

          {onNextLesson && (
            <button
              onClick={onNextLesson}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-[#162238] hover:bg-[#203150] active:scale-[0.99] text-white transition-all border border-white/10 cursor-pointer"
            >
              <span>Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onGoToDashboard}
            className="py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-[#162238] hover:bg-[#203150] text-slate-300 hover:text-white transition-all border border-white/10 cursor-pointer"
          >
            <BarChart2 className="w-4 h-4" />
            <span className="hidden sm:inline">Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
