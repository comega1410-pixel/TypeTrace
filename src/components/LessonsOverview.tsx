import React from 'react';
import { LEARNING_LEVELS } from '../data/lessons';
import { UserStats, LessonExercise, LearningLevel } from '../types';
import { PageShell } from './PageShell';
import { CheckCircle2, Lock, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface LessonsOverviewProps {
  stats: UserStats;
  onSelectExercise: (level: LearningLevel, exercise: LessonExercise) => void;
}

export const LessonsOverview: React.FC<LessonsOverviewProps> = ({
  stats,
  onSelectExercise,
}) => {
  return (
    <PageShell variant="lessons" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00d49a] uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guided Touch Typing Curriculum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
            From Basics to Mastery
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Step-by-step muscle memory exercises designed specifically for beginners. Progress at your own comfortable pace.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0f1728]/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-lg shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-400">Current Milestone</div>
            <div className="text-sm font-bold text-[#00d49a]">
              Level {stats.unlockedLevel} of 8
            </div>
          </div>
        </div>
      </div>

      {/* Levels List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LEARNING_LEVELS.map((level) => {
          const isUnlocked = level.levelNumber <= stats.unlockedLevel;
          const isCurrent = level.levelNumber === stats.unlockedLevel;

          return (
            <div
              key={level.id}
              className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-200 flex flex-col justify-between shadow-lg ${
                isCurrent
                  ? 'bg-[#0f1728]/90 border-[#00d49a]/50 ring-1 ring-[#00d49a]/40 shadow-[#00d49a]/10'
                  : isUnlocked
                  ? 'bg-[#0f1728]/80 border-white/10 hover:border-[#00d49a]/40 hover:bg-[#0f1728]/95'
                  : 'bg-[#0f1728]/40 border-white/5 opacity-60'
              }`}
            >
              <div>
                {/* Level Tag & Status */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isCurrent
                        ? 'bg-[#00d49a]/20 text-[#00d49a] border border-[#00d49a]/30'
                        : isUnlocked
                        ? 'bg-[#151f32]/90 text-slate-300 border border-white/10'
                        : 'bg-[#151f32]/50 text-slate-400'
                    }`}
                  >
                    Level {level.levelNumber}
                  </span>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs text-[#00d49a] font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{level.levelNumber < stats.unlockedLevel ? 'Mastered' : 'In Progress'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {level.title}
                </h3>
                <div className="text-xs font-semibold text-[#00d49a] mt-0.5">
                  {level.subtitle}
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {level.description}
                </p>

                {/* Coach Tip */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-[#151f32]/85 text-[11px] text-slate-200 border border-white/10 flex items-start gap-2 shadow-inner">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Coach Tip: {level.coachTip}</span>
                </div>

                {/* Target Keys preview */}
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium">Keys:</span>
                  {level.targetKeys.slice(0, 8).map((k, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#162238] text-slate-200 border border-white/10 shadow-sm"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exercises selector */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                <div className="text-xs font-semibold text-slate-300">
                  Exercises ({level.exercises.length}):
                </div>
                <div className="space-y-1.5">
                  {level.exercises.map((ex, exIdx) => (
                    <button
                      key={ex.id}
                      disabled={!isUnlocked}
                      onClick={() => onSelectExercise(level, ex)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        isUnlocked
                          ? 'hover:bg-[#00d49a]/15 text-slate-200 hover:text-white group cursor-pointer border border-transparent hover:border-[#00d49a]/20'
                          : 'text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#162238] text-slate-300 flex items-center justify-center font-mono text-[10px] font-bold border border-white/10">
                          {exIdx + 1}
                        </span>
                        <div>
                          <div className="font-semibold group-hover:text-[#00d49a] transition-colors text-white">
                            {ex.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Target Accuracy: {ex.targetAccuracy}%
                          </div>
                        </div>
                      </div>

                      {isUnlocked && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00d49a] group-hover:translate-x-0.5 transition-all" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
};
