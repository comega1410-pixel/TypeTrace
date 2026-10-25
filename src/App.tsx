/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserSettings,
  UserStats,
  TypingSession,
  LearningLevel,
  LessonExercise,
} from './types';
import {
  loadSettings,
  saveSettings,
  loadStats,
  loadSessions,
  recordSession,
} from './utils/storage';
import { Navbar, AmbientVibe } from './components/Navbar';
import { TypingArea } from './components/TypingArea';
import { Dashboard } from './components/Dashboard';
import { LessonsOverview } from './components/LessonsOverview';
import { ResultsModal } from './components/ResultsModal';
import { GradientBars } from './components/GradientBars';
import { LEARNING_LEVELS } from './data/lessons';
import { Award, X } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [stats, setStats] = useState<UserStats>(loadStats);
  const [sessions, setSessions] = useState<TypingSession[]>(loadSessions);

  const [currentTab, setCurrentTab] = useState<'practice' | 'lessons' | 'dashboard'>('practice');
  const [activeLesson, setActiveLesson] = useState<{
    level: LearningLevel;
    exercise: LessonExercise;
  } | null>(null);

  const [completedSession, setCompletedSession] = useState<TypingSession | null>(null);
  const [isPersonalBest, setIsPersonalBest] = useState<boolean>(false);
  const [badgeToast, setBadgeToast] = useState<string | null>(null);

  // Ambient aura state from user reference
  const [ambientVibe, setAmbientVibe] = useState<AmbientVibe>('sunset');

  const ambientColors: Record<AmbientVibe, string> = {
    // The exact sunset orange from the user's uploaded 21st.dev reference snippet
    sunset: 'rgba(255, 60, 0, 0.38)',
    // The emerald green matching TypeTrack's primary accent
    emerald: 'rgba(0, 212, 154, 0.35)',
    // Cyber blue aura
    cyber: 'rgba(14, 165, 233, 0.35)',
  };

  const handleCycleAmbientVibe = () => {
    const vibes: AmbientVibe[] = ['sunset', 'emerald', 'cyber'];
    const nextIdx = (vibes.indexOf(ambientVibe) + 1) % vibes.length;
    setAmbientVibe(vibes[nextIdx]);
  };

  // Sync settings with localStorage and theme classes on html/body
  const handleUpdateSettings = (updater: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updater };
      saveSettings(updated);
      return updated;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light', 'theme-sepia', 'dark');

    if (settings.theme === 'dark') {
      root.classList.add('theme-dark', 'dark');
    } else if (settings.theme === 'sepia') {
      root.classList.add('theme-sepia');
    } else {
      root.classList.add('theme-light');
    }
  }, [settings.theme]);

  // Handle finished typing session
  const handleFinishSession = (session: TypingSession) => {
    const wasPersonalBest = session.wpm > stats.bestWpm && session.wpm > 10;
    setIsPersonalBest(wasPersonalBest);

    const { newStats, newBadges } = recordSession(session, settings);
    setStats(newStats);
    setSessions(loadSessions());
    setCompletedSession(session);

    if (newBadges.length > 0) {
      setBadgeToast(`Milestone Unlocked: ${newBadges[0]}`);
      setTimeout(() => {
        setBadgeToast(null);
      }, 5000);
    }
  };

  const handleSelectLesson = (level: LearningLevel, exercise: LessonExercise) => {
    setActiveLesson({ level, exercise });
    setCurrentTab('practice');
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const currentLevel = activeLesson.level;
    const currentExIndex = currentLevel.exercises.findIndex((e) => e.id === activeLesson.exercise.id);

    if (currentExIndex !== -1 && currentExIndex < currentLevel.exercises.length - 1) {
      setActiveLesson({
        level: currentLevel,
        exercise: currentLevel.exercises[currentExIndex + 1],
      });
      setCompletedSession(null);
      setCurrentTab('practice');
    } else {
      const nextLevel = LEARNING_LEVELS.find((l) => l.levelNumber === currentLevel.levelNumber + 1);
      if (nextLevel && nextLevel.levelNumber <= stats.unlockedLevel) {
        setActiveLesson({
          level: nextLevel,
          exercise: nextLevel.exercises[0],
        });
        setCompletedSession(null);
        setCurrentTab('practice');
      } else {
        setCompletedSession(null);
        setCurrentTab('lessons');
      }
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex flex-col bg-[var(--bg-page)] text-[var(--color-text-primary)] transition-colors duration-250 overflow-x-hidden relative">
      {/* Animated GradientBars background from user reference */}
      <GradientBars
        numBars={15}
        gradientFrom={ambientColors[ambientVibe]}
        gradientTo="transparent"
        animationDuration={2.2}
      />

      {/* Toast notification for newly unlocked milestone */}
      {badgeToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 p-3.5 rounded-xl bg-[#00d49a] text-[#0b0f14] font-bold text-xs shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <Award className="w-5 h-5 shrink-0" />
          <span>{badgeToast}</span>
          <button
            type="button"
            onClick={() => setBadgeToast(null)}
            className="p-1 hover:bg-black/10 rounded-md ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Navigation with frosted glass blur */}
      {!settings.peacefulMode && (
        <Navbar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          stats={stats}
          ambientVibe={ambientVibe}
          onCycleAmbientVibe={handleCycleAmbientVibe}
        />
      )}

      {/* Main Content Area sitting above the animated background */}
      <main className="flex-1 flex flex-col justify-start items-center w-full relative z-10">
        {currentTab === 'practice' && (
          <TypingArea
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onFinishSession={handleFinishSession}
            activeLesson={activeLesson}
            onSwitchToLessons={() => setCurrentTab('lessons')}
          />
        )}

        {currentTab === 'lessons' && (
          <LessonsOverview
            stats={stats}
            onSelectExercise={handleSelectLesson}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            sessions={sessions}
            onStartPractice={() => {
              setActiveLesson(null);
              setCurrentTab('practice');
            }}
            onSelectLevel={(levelId) => {
              const lvl = LEARNING_LEVELS.find((l) => l.id === levelId);
              if (lvl) {
                handleSelectLesson(lvl, lvl.exercises[0]);
              }
            }}
          />
        )}
      </main>

      {/* Peaceful Mode Exit Button in Corner */}
      {settings.peacefulMode && (
        <div className="fixed bottom-4 right-4 z-40 opacity-50 hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => handleUpdateSettings({ peacefulMode: false })}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#151f32]/90 backdrop-blur-md text-white font-medium shadow-md border border-white/15 cursor-pointer"
          >
            Exit Peaceful Mode
          </button>
        </div>
      )}

      {/* Results Modal */}
      {completedSession && (
        <ResultsModal
          session={completedSession}
          stats={stats}
          isPersonalBest={isPersonalBest}
          onRestart={() => setCompletedSession(null)}
          onNextLesson={activeLesson ? handleNextLesson : undefined}
          onGoToDashboard={() => {
            setCompletedSession(null);
            setCurrentTab('dashboard');
          }}
          onClose={() => setCompletedSession(null)}
        />
      )}
    </div>
  );
}
