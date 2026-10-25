export type Theme = 'light' | 'dark' | 'sepia';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';
export type SoundType = 'off' | 'mechanical' | 'soft-click' | 'gentle-bubble';

export type PracticeMode = 'learn' | 'time' | 'words' | 'quotes' | 'custom';

export interface TypingSession {
  id: string;
  timestamp: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  charactersCount: number;
  wordsCount: number;
  durationSeconds: number;
  mode: PracticeMode;
  modeDetail?: string; // e.g., "Level 2: Home Row", "60s Time", "25 Words"
  levelId?: number;
}

export interface UserStats {
  sessionsCount: number;
  totalTimeSeconds: number;
  totalWords: number;
  totalCharacters: number;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedLessonIds: string[];
  unlockedLevel: number;
  unlockedBadgeIds: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  category: 'streak' | 'speed' | 'accuracy' | 'milestone' | 'mastery';
}

export interface LessonExercise {
  id: string;
  title: string;
  description: string;
  targetKeys: string[];
  fingerFocus?: string;
  text: string;
  targetAccuracy: number;
  targetWpm?: number;
}

export interface LearningLevel {
  id: number;
  levelNumber: number;
  title: string;
  subtitle: string;
  description: string;
  targetKeys: string[];
  exercises: LessonExercise[];
  coachTip: string;
}

export interface UserSettings {
  theme: Theme;
  fontSize: FontSize;
  sound: SoundType;
  volume: number;
  showKeyboardGuide: boolean;
  showHandsGuide: boolean;
  peacefulMode: boolean;
  smoothCaret: boolean;
  backspaceAllowed: boolean;
}
