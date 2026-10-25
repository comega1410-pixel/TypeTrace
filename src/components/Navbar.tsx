import React from 'react';
import { Theme, SoundType, UserSettings, UserStats } from '../types';
import {
  Keyboard,
  Moon,
  Sun,
  Coffee,
  Volume2,
  VolumeX,
  Flame,
  Focus,
  BookOpen,
  BarChart3,
  Play,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'practice' | 'lessons' | 'dashboard';
  onTabChange: (tab: 'practice' | 'lessons' | 'dashboard') => void;
  settings: UserSettings;
  onUpdateSettings: (updater: Partial<UserSettings>) => void;
  stats: UserStats;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  settings,
  onUpdateSettings,
  stats,
}) => {
  const cycleTheme = () => {
    const themeCycle: Theme[] = ['dark', 'light', 'sepia'];
    const nextIdx = (themeCycle.indexOf(settings.theme) + 1) % themeCycle.length;
    onUpdateSettings({ theme: themeCycle[nextIdx] });
  };

  const cycleSound = () => {
    const soundCycle: SoundType[] = ['soft-click', 'mechanical', 'gentle-bubble', 'off'];
    const nextIdx = (soundCycle.indexOf(settings.sound) + 1) % soundCycle.length;
    onUpdateSettings({ sound: soundCycle[nextIdx] });
  };

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark */}
        <div
          onClick={() => onTabChange('practice')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-base shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span>T</span>
            <span className="w-1 h-3.5 bg-slate-950 ml-0.5 animate-pulse rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Type<span className="text-emerald-500">Track</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium hidden sm:block -mt-0.5">
              Calm typing coach
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => onTabChange('practice')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
              currentTab === 'practice'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-500" />
            <span>Practice</span>
          </button>

          <button
            onClick={() => onTabChange('lessons')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
              currentTab === 'lessons'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden xs:inline">Curriculum</span>
            <span className="xs:hidden">Learn</span>
          </button>

          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
              currentTab === 'dashboard'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
            <span>Progress</span>
          </button>
        </nav>

        {/* Right Actions: Streak, Focus, Sound, Theme */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Daily Streak Indicator */}
          <div
            title={`${stats.currentStreak} day practice streak`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-bold"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{stats.currentStreak}</span>
          </div>

          {/* Peaceful Focus Mode Toggle */}
          <button
            onClick={() => onUpdateSettings({ peacefulMode: !settings.peacefulMode })}
            title={settings.peacefulMode ? 'Exit Peaceful Mode' : 'Enter Peaceful Focus Mode'}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
              settings.peacefulMode
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Focus className="w-4 h-4" />
          </button>

          {/* Sound Mode Cycle */}
          <button
            onClick={cycleSound}
            title={`Sound: ${settings.sound} (click to cycle)`}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {settings.sound === 'off' ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={cycleTheme}
            title={`Theme: ${settings.theme} (click to cycle)`}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {settings.theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
            {settings.theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {settings.theme === 'sepia' && <Coffee className="w-4 h-4 text-[#8b6f47]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
