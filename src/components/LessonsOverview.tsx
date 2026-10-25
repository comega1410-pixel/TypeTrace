import React from 'react';
import { LEARNING_LEVELS } from '../data/lessons';
import { UserStats, LessonExercise, LearningLevel } from '../types';
import { CheckCircle2, Lock, ArrowRight, Sparkles, BookOpen, KeyRound } from 'lucide-react';

interface LessonsOverviewProps {
  stats: UserStats;
  onSelectExercise: (level: LearningLevel, exercise: LessonExercise) => void;
}

export const LessonsOverview: React.FC<LessonsOverviewProps> = ({
  stats,
  onSelectExercise,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guided Touch Typing Curriculum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            From Basics to Mastery
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Step-by-step muscle memory exercises designed specifically for beginners. Progress at your own comfortable pace.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-500">Current Milestone</div>
            <div className="text-sm font-bold text-emerald-500">
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
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/30 shadow-sm'
                  : isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                {/* Level Tag & Status */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : isUnlocked
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    Level {level.levelNumber}
                  </span>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
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
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {level.title}
                </h3>
                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {level.subtitle}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {level.description}
                </p>

                {/* Coach Tip */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Coach Tip: {level.coachTip}</span>
                </div>

                {/* Target Keys preview */}
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500">Keys:</span>
                  {level.targetKeys.slice(0, 8).map((k, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exercises selector */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
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
                          ? 'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-slate-800 dark:text-slate-200 group cursor-pointer'
                          : 'text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-mono text-[10px] font-bold">
                          {exIdx + 1}
                        </span>
                        <div>
                          <div className="font-medium group-hover:text-emerald-500 transition-colors">
                            {ex.title}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Target Accuracy: {ex.targetAccuracy}%
                          </div>
                        </div>
                      </div>

                      {isUnlocked && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
