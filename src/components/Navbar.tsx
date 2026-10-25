import React from 'react';
import { Theme, SoundType, UserSettings, UserStats } from '../types';
import {
  Moon,
  Sun,
  Coffee,
  Volume2,
  VolumeX,
  Flame,
  Settings as SettingsIcon,
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

  const isDark = settings.theme === 'dark';

  return (
    <header className="w-full border-b border-[#1e293b] bg-[#0f1728] sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark: small green rounded-square logo with "Ti" */}
        <div
          onClick={() => onTabChange('practice')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#00d49a] text-[#0b0f14] font-bold text-sm flex items-center justify-center tracking-tight shadow-sm shadow-[#00d49a]/30 group-hover:scale-105 transition-transform">
            Ti
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                Type<span className="text-[#00d49a]">Track</span>
              </span>
            </div>
            <p className="text-[10px] text-[#64748b] font-medium hidden sm:block -mt-0.5">
              Calm typing coach
            </p>
          </div>
        </div>

        {/* Center Navigation Buttons: Practice, Learn, Progress */}
        <nav className="flex items-center gap-1 bg-[#151f32] p-1 rounded-xl border border-[#22324d]">
          <button
            onClick={() => onTabChange('practice')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
              currentTab === 'practice'
                ? 'bg-[#0f1728] text-white shadow-xs font-semibold border border-[#1e293b]'
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${currentTab === 'practice' ? 'text-[#00d49a]' : ''}`} />
            <span>Practice</span>
          </button>

          <button
            onClick={() => onTabChange('lessons')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
              currentTab === 'lessons'
                ? 'bg-[#0f1728] text-white shadow-xs font-semibold border border-[#1e293b]'
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${currentTab === 'lessons' ? 'text-[#00d49a]' : ''}`} />
            <span>Learn</span>
          </button>

          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
              currentTab === 'dashboard'
                ? 'bg-[#0f1728] text-white shadow-xs font-semibold border border-[#1e293b]'
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            <BarChart3 className={`w-3.5 h-3.5 ${currentTab === 'dashboard' ? 'text-[#00d49a]' : ''}`} />
            <span>Progress</span>
          </button>
        </nav>

        {/* Right Actions: Streak, Settings, Sound, Theme */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Daily Streak Indicator */}
          <div
            title={`${stats.currentStreak} day practice streak`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{stats.currentStreak}</span>
          </div>

          {/* Settings / Focus Mode */}
          <button
            onClick={() => onUpdateSettings({ peacefulMode: !settings.peacefulMode })}
            title={settings.peacefulMode ? 'Exit Peaceful Mode' : 'Peaceful Focus Mode'}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
              settings.peacefulMode
                ? 'bg-[#00d49a] text-[#0b0f14] border-[#00d49a] shadow-sm'
                : 'bg-[#151f32] text-[#94a3b8] border-[#22324d] hover:text-white'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Sound Mode Cycle */}
          <button
            onClick={cycleSound}
            title={`Sound: ${settings.sound} (click to cycle)`}
            className="p-2 rounded-lg bg-[#151f32] text-[#94a3b8] border border-[#22324d] hover:text-white transition-colors"
          >
            {settings.sound === 'off' ? (
              <VolumeX className="w-4 h-4 text-[#64748b]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#00d49a]" />
            )}
          </button>

          {/* Theme Switcher - Fix Issue 2 by referencing CSS theme variable */}
          <button
            onClick={cycleTheme}
            title={`Theme: ${settings.theme} (click to cycle)`}
            className="p-2 rounded-lg bg-[#151f32] text-[#94a3b8] border border-[#22324d] hover:text-white transition-colors"
          >
            {settings.theme === 'dark' && <Moon className="w-4 h-4 text-[#00d49a]" />}
            {settings.theme === 'light' && <Sun className="w-4 h-4 text-amber-400" />}
            {settings.theme === 'sepia' && (
              <Coffee
                className="w-4 h-4"
                style={{ color: 'var(--theme-icon-sepia, #8b6f47)' }}
              />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
