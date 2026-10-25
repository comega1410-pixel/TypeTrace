import { TypingSession, UserStats, UserSettings } from '../types';
import { ALL_BADGES } from '../data/badges';

const STATS_KEY = 'typetrack_user_stats';
const SESSIONS_KEY = 'typetrack_sessions';
const SETTINGS_KEY = 'typetrack_settings';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  fontSize: 'lg',
  sound: 'soft-click',
  volume: 0.6,
  showKeyboardGuide: true,
  showHandsGuide: true,
  peacefulMode: false,
  smoothCaret: true,
  backspaceAllowed: true,
};

export const DEFAULT_STATS: UserStats = {
  sessionsCount: 0,
  totalTimeSeconds: 0,
  totalWords: 0,
  totalCharacters: 0,
  bestWpm: 0,
  avgWpm: 0,
  avgAccuracy: 0,
  currentStreak: 1,
  bestStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: [],
  unlockedLevel: 1,
  unlockedBadgeIds: [],
};

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // LocalStorage write error fallback
  }
}

export function loadSessions(): TypingSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function loadStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const stats: UserStats = { ...DEFAULT_STATS, ...JSON.parse(raw) };
    return updateStreak(stats);
  } catch {
    return DEFAULT_STATS;
  }
}

function updateStreak(stats: UserStats): UserStats {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = stats.lastActiveDate;

  if (lastActive === today) {
    return stats;
  }

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  if (lastActive === yesterday) {
    // Practiced yesterday, streak continues when session logged today
    return stats;
  }

  // If last active was before yesterday, streak reset back to 0 (will become 1 upon practice today)
  if (new Date(lastActive).getTime() < new Date(yesterday).getTime()) {
    return {
      ...stats,
      currentStreak: 0,
    };
  }

  return stats;
}

export function recordSession(session: TypingSession, currentSettings: UserSettings): {
  newStats: UserStats;
  newBadges: string[];
} {
  const currentSessions = loadSessions();
  const updatedSessions = [session, ...currentSessions].slice(0, 100); // keep recent 100
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
  } catch {}

  const stats = loadStats();
  const today = new Date().toISOString().split('T')[0];

  let streak = stats.currentStreak;
  if (stats.lastActiveDate !== today) {
    streak += 1;
  }
  const bestStreak = Math.max(stats.bestStreak, streak);

  const totalSessions = stats.sessionsCount + 1;
  const totalTimeSeconds = stats.totalTimeSeconds + session.durationSeconds;
  const totalWords = stats.totalWords + session.wordsCount;
  const totalCharacters = stats.totalCharacters + session.charactersCount;
  const bestWpm = Math.max(stats.bestWpm, session.wpm);

  // Recalculate moving average
  const avgWpm = Math.round(
    (stats.avgWpm * stats.sessionsCount + session.wpm) / totalSessions
  );
  const avgAccuracy = Math.round(
    (stats.avgAccuracy * stats.sessionsCount + session.accuracy) / totalSessions
  );

  const completedLessonIds = [...stats.completedLessonIds];
  if (session.mode === 'learn' && session.modeDetail) {
    if (!completedLessonIds.includes(session.modeDetail)) {
      completedLessonIds.push(session.modeDetail);
    }
  }

  // Calculate unlocked levels based on completed lessons
  let unlockedLevel = stats.unlockedLevel;
  if (session.levelId && session.accuracy >= 90) {
    unlockedLevel = Math.max(unlockedLevel, Math.min(8, session.levelId + 1));
  }

  // Check badges to unlock
  const newlyUnlockedBadges: string[] = [];
  const currentBadges = new Set(stats.unlockedBadgeIds);

  const checkBadge = (id: string, condition: boolean) => {
    if (condition && !currentBadges.has(id)) {
      currentBadges.add(id);
      newlyUnlockedBadges.push(id);
    }
  };

  checkBadge('first-flight', totalSessions >= 1);
  checkBadge('home-row-scout', unlockedLevel >= 2);
  checkBadge('home-row-pioneer', unlockedLevel >= 3);
  checkBadge('steady-hands', session.accuracy >= 95);
  checkBadge('precision-artist', session.accuracy >= 98 && session.wordsCount >= 20);
  checkBadge('twenty-five-club', session.wpm >= 25);
  checkBadge('forty-wpm', session.wpm >= 40);
  checkBadge('three-day-streak', streak >= 3);
  checkBadge('seven-day-streak', streak >= 7);
  checkBadge('thousand-words', totalWords >= 1000);
  checkBadge('peaceful-focus', currentSettings.peacefulMode);
  checkBadge('curriculum-master', unlockedLevel >= 8 && completedLessonIds.length >= 15);

  const newStats: UserStats = {
    sessionsCount: totalSessions,
    totalTimeSeconds,
    totalWords,
    totalCharacters,
    bestWpm,
    avgWpm,
    avgAccuracy,
    currentStreak: streak,
    bestStreak,
    lastActiveDate: today,
    completedLessonIds,
    unlockedLevel,
    unlockedBadgeIds: Array.from(currentBadges),
  };

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  } catch {}

  return { newStats, newBadges: newlyUnlockedBadges };
}

export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STATS_KEY);
  localStorage.removeItem(SESSIONS_KEY);
}
