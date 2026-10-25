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
  Sparkles,
} from 'lucide-react';

export type AmbientVibe = 'emerald' | 'sunset' | 'cyber';

interface NavbarProps {
  currentTab: 'practice' | 'lessons' | 'dashboard';
  onTabChange: (tab: 'practice' | 'lessons' | 'dashboard') => void;
  settings: UserSettings;
  onUpdateSettings: (updater: Partial<UserSettings>) => void;
  stats: UserStats;
  ambientVibe?: AmbientVibe;
  onCycleAmbientVibe?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  settings,
  onUpdateSettings,
  stats,
  ambientVibe = 'emerald',
  onCycleAmbientVibe,
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
    <header className="w-full border-b border-white/10 bg-[#0f1728]/85 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Wordmark: small green rounded-square logo with "Ti" */}
        <div
          onClick={() => onTabChange('practice')}
          className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#00d49a] text-[#0b0f14] font-bold text-xs sm:text-sm flex items-center justify-center tracking-tight shadow-sm shadow-[#00d49a]/30 group-hover:scale-105 transition-transform">
            Ti
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm sm:text-lg tracking-tight text-white">
                Type<span className="text-[#00d49a]">Track</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium hidden sm:block -mt-0.5">
              Calm typing coach
            </p>
          </div>
        </div>

        {/* Center Navigation Buttons: Practice, Learn, Progress */}
        <nav className="flex items-center gap-0.5 sm:gap-1 bg-[#151f32]/90 p-0.5 sm:p-1 rounded-xl border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => onTabChange('practice')}
            className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
              currentTab === 'practice'
                ? 'bg-[#0f1728] text-white shadow-xs font-semibold border border-white/15'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${currentTab === 'practice' ? 'text-[#00d49a]' : ''}`} />
            <span className="hidden xs:inline">Practice</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('lessons')}
            className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
              currentTab === 'lessons'
                ? 'bg-[#0f1728] text-white shadow-xs font-semibold border border-white/15'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${currentTab === 'lessons' ? 'text-[#00d49a]' : ''}`} />
            <span className="hidden xs:inline">Learn</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('dashboard')}
            className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-[#0f1728] text-white shadow-xs font-semibold border border-white/15'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart3 className={`w-3.5 h-3.5 ${currentTab === 'dashboard' ? 'text-[#00d49a]' : ''}`} />
            <span className="hidden xs:inline">Progress</span>
          </button>
        </nav>

        {/* Right Actions: Streak, Ambient Vibe, Settings, Sound, Theme */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Daily Streak Indicator */}
          <div
            title={`${stats.currentStreak} day practice streak`}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/30 text-xs font-bold"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{stats.currentStreak}</span>
          </div>

          {/* Ambient Aura Vibe Toggle */}
          {onCycleAmbientVibe && (
            <button
              type="button"
              onClick={onCycleAmbientVibe}
              title={`Ambient Aura: ${ambientVibe} (click to cycle glow)`}
              className={`p-1.5 sm:p-2 rounded-lg text-xs font-medium border border-white/10 transition-colors cursor-pointer ${
                ambientVibe === 'sunset'
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  : ambientVibe === 'cyber'
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                  : 'bg-[#00d49a]/20 text-[#00d49a] border-[#00d49a]/30'
              }`}
              aria-label="Cycle ambient aura"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Settings / Focus Mode */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ peacefulMode: !settings.peacefulMode })}
            title={settings.peacefulMode ? 'Exit Peaceful Mode' : 'Peaceful Focus Mode'}
            className={`p-1.5 sm:p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              settings.peacefulMode
                ? 'bg-[#00d49a] text-[#0b0f14] border-[#00d49a] shadow-sm'
                : 'bg-[#151f32]/90 text-slate-200 border-white/10 hover:text-white'
            }`}
            aria-label="Toggle focus mode"
          >
            <SettingsIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Sound Mode Cycle */}
          <button
            type="button"
            onClick={cycleSound}
            title={`Sound: ${settings.sound} (click to cycle)`}
            className="p-1.5 sm:p-2 rounded-lg bg-[#151f32]/90 text-slate-200 border border-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle sound mode"
          >
            {settings.sound === 'off' ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00d49a]" />
            )}
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={cycleTheme}
            title={`Theme: ${settings.theme} (click to cycle)`}
            className="p-1.5 sm:p-2 rounded-lg bg-[#151f32]/90 text-slate-200 border border-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {settings.theme === 'dark' && <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00d49a]" />}
            {settings.theme === 'light' && <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
            {settings.theme === 'sepia' && (
              <Coffee
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                style={{ color: 'var(--theme-icon-sepia, #8b6f47)' }}
              />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
