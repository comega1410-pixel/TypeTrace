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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-[#0f1728] border border-[#1e293b] shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Header with Coach Insight */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00d49a]/10 text-[#00d49a] border border-[#00d49a]/30 mb-3">
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
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {coachInsight.headline}
          </h2>
          <p className="text-sm text-[#cbd5e1] mt-2 max-w-md mx-auto leading-relaxed">
            {coachInsight.advice}
          </p>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* WPM */}
          <div className="p-4 rounded-xl bg-[#151f32] border border-[#22324d] text-center">
            <span className="text-xs uppercase font-medium tracking-wider text-[#94a3b8] flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              WPM
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              {session.wpm}
            </div>
            {stats.bestWpm > 0 && (
              <span className="text-[11px] text-[#64748b] mt-0.5 block">
                Best: {stats.bestWpm}
              </span>
            )}
          </div>

          {/* Accuracy */}
          <div className="p-4 rounded-xl bg-[#151f32] border border-[#22324d] text-center">
            <span className="text-xs uppercase font-medium tracking-wider text-[#94a3b8] flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#00d49a]" />
              Accuracy
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              {session.accuracy}%
            </div>
            <span className="text-[11px] text-[#64748b] mt-0.5 block">
              {session.accuracy >= 95 ? 'Great control' : 'Keep practicing'}
            </span>
          </div>

          {/* Time */}
          <div className="p-4 rounded-xl bg-[#151f32] border border-[#22324d] text-center">
            <span className="text-xs uppercase font-medium tracking-wider text-[#94a3b8] flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Time
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-2">
              {session.durationSeconds}s
            </div>
            <span className="text-[11px] text-[#64748b] mt-0.5 block">
              {session.wordsCount} words
            </span>
          </div>

          {/* Errors */}
          <div className="p-4 rounded-xl bg-[#151f32] border border-[#22324d] text-center">
            <span className="text-xs uppercase font-medium tracking-wider text-[#94a3b8] flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Typos
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-2">
              {session.errors}
            </div>
            <span className="text-[11px] text-[#64748b] mt-0.5 block">
              {session.errors === 0 ? 'Clean run' : 'Natural to make'}
            </span>
          </div>
        </div>

        {/* Comparison with Average */}
        {stats.sessionsCount > 1 && (
          <div className="p-3 mb-6 rounded-xl bg-[#151f32] text-xs text-[#cbd5e1] flex items-center justify-between border border-[#22324d]">
            <span>
              Overall Average: <strong className="text-white">{stats.avgWpm} WPM</strong> &middot;{' '}
              <strong className="text-white">{stats.avgAccuracy}% Accuracy</strong>
            </span>
            <span className="text-[#00d49a] font-semibold">
              {session.wpm >= stats.avgWpm ? `+${session.wpm - stats.avgWpm} above avg` : 'Keep rhythm steady'}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-[#00d49a] hover:bg-[#00d49a]/90 active:scale-[0.99] text-[#0b0f14] transition-all shadow-md shadow-[#00d49a]/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Practice Again
          </button>

          {onNextLesson && (
            <button
              onClick={onNextLesson}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-[#151f32] hover:bg-[#1e2c47] active:scale-[0.99] text-white transition-all border border-[#22324d] cursor-pointer"
            >
              <span>Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onGoToDashboard}
            className="py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-[#151f32] hover:bg-[#1e2c47] text-[#94a3b8] hover:text-white transition-all border border-[#22324d] cursor-pointer"
          >
            <BarChart2 className="w-4 h-4" />
            <span className="hidden sm:inline">Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
