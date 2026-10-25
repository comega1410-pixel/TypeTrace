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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00d49a] uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guided Touch Typing Curriculum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            From Basics to Mastery
          </h2>
          <p className="text-sm text-[#94a3b8] mt-1 max-w-xl">
            Step-by-step muscle memory exercises designed specifically for beginners. Progress at your own comfortable pace.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0f1728] px-4 py-2.5 rounded-xl border border-[#1e293b] shrink-0">
          <div className="text-right">
            <div className="text-xs text-[#64748b]">Current Milestone</div>
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
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-[#0f1728] border-[#00d49a]/40 ring-1 ring-[#00d49a]/30 shadow-lg'
                  : isUnlocked
                  ? 'bg-[#0f1728] border-[#1e293b] hover:border-[#334155]'
                  : 'bg-[#0f1728]/50 border-[#1e293b]/60 opacity-60'
              }`}
            >
              <div>
                {/* Level Tag & Status */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isCurrent
                        ? 'bg-[#00d49a]/20 text-[#00d49a]'
                        : isUnlocked
                        ? 'bg-[#151f32] text-[#94a3b8]'
                        : 'bg-[#151f32] text-[#64748b]'
                    }`}
                  >
                    Level {level.levelNumber}
                  </span>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs text-[#00d49a] font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{level.levelNumber < stats.unlockedLevel ? 'Mastered' : 'In Progress'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-[#64748b] font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-bold text-white">
                  {level.title}
                </h3>
                <div className="text-xs font-medium text-[#00d49a] mt-0.5">
                  {level.subtitle}
                </div>

                <p className="text-xs text-[#94a3b8] mt-2 leading-relaxed">
                  {level.description}
                </p>

                {/* Coach Tip */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-[#151f32] text-[11px] text-[#cbd5e1] border border-[#22324d] flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Coach Tip: {level.coachTip}</span>
                </div>

                {/* Target Keys preview */}
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-[#64748b]">Keys:</span>
                  {level.targetKeys.slice(0, 8).map((k, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#151f32] text-[#cbd5e1] border border-[#22324d]"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exercises selector */}
              <div className="mt-4 pt-3 border-t border-[#1e293b] space-y-2">
                <div className="text-xs font-semibold text-[#94a3b8]">
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
                          ? 'hover:bg-[#00d49a]/10 text-[#cbd5e1] hover:text-white group cursor-pointer'
                          : 'text-[#64748b] cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#151f32] text-[#94a3b8] flex items-center justify-center font-mono text-[10px] font-bold">
                          {exIdx + 1}
                        </span>
                        <div>
                          <div className="font-medium group-hover:text-[#00d49a] transition-colors">
                            {ex.title}
                          </div>
                          <div className="text-[10px] text-[#64748b]">
                            Target Accuracy: {ex.targetAccuracy}%
                          </div>
                        </div>
                      </div>

                      {isUnlocked && (
                        <ArrowRight className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#00d49a] group-hover:translate-x-0.5 transition-all" />
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
