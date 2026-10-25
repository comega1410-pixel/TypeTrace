import { TypingSession, UserStats } from '../types';

export interface CoachInsight {
  headline: string;
  advice: string;
  recommendedMode: 'learn' | 'time' | 'quotes' | 'words';
  recommendedDetail: string;
  tone: 'celebratory' | 'calm' | 'encouraging';
}

export function getCoachingInsight(
  session: TypingSession,
  stats: UserStats,
  isPersonalBest: boolean
): CoachInsight {
  const { accuracy, wpm, errors } = session;

  if (isPersonalBest && wpm > 15) {
    return {
      headline: 'New Personal Record!',
      advice: `You reached ${wpm} WPM with ${accuracy}% accuracy. Notice how calmness made your fingers move faster without feeling rushed.`,
      recommendedMode: 'quotes',
      recommendedDetail: 'Calm Thought',
      tone: 'celebratory',
    };
  }

  if (accuracy >= 98) {
    return {
      headline: 'Exceptional Precision!',
      advice: `With ${accuracy}% accuracy, you are building golden muscle memory. High accuracy is the direct foundation for natural, effortless speed.`,
      recommendedMode: 'words',
      recommendedDetail: '25 Words Sprint',
      tone: 'celebratory',
    };
  }

  if (accuracy >= 94) {
    return {
      headline: 'Smooth, Consistent Flow',
      advice: `You maintained great control throughout this session. Your rhythm is settling in nicely. Keep this relaxed posture!`,
      recommendedMode: 'learn',
      recommendedDetail: `Level ${stats.unlockedLevel}`,
      tone: 'encouraging',
    };
  }

  if (accuracy < 90 && errors > 4) {
    return {
      headline: 'Slow Down to Speed Up',
      advice: `Every beginner experiences bumpy runs. Try easing your pace by 10%. Give each finger an extra split-second to feel its key home.`,
      recommendedMode: 'learn',
      recommendedDetail: 'Home Row Anchor Practice',
      tone: 'calm',
    };
  }

  if (wpm < 20) {
    return {
      headline: 'Every Keystroke Builds Strength',
      advice: `Speed will naturally follow familiarization. Focus on resting your fingers gently on the home row (A S D F and J K L ;). You are doing wonderful!`,
      recommendedMode: 'learn',
      recommendedDetail: 'Level 1: Keyboard Basics',
      tone: 'encouraging',
    };
  }

  return {
    headline: 'Great Practice Session',
    advice: `You finished with ${wpm} WPM and ${accuracy}% accuracy. Consistent short sessions like this create lasting typing confidence.`,
    recommendedMode: 'words',
    recommendedDetail: '50 Words Flow',
    tone: 'encouraging',
  };
}

export function getDashboardCoachTip(stats: UserStats): {
  headline: string;
  message: string;
  actionText: string;
} {
  if (stats.sessionsCount === 0) {
    return {
      headline: 'Welcome to TypeTrack!',
      message: 'Take a relaxed breath, place your hands on the home row, and start with Level 1.',
      actionText: 'Start Level 1',
    };
  }

  if (stats.avgAccuracy < 92) {
    return {
      headline: 'Focus on Smooth Accuracy',
      message: 'Your speed will multiply once your accuracy crosses 95%. Try a calm, deliberate session without rushing.',
      actionText: 'Practice Deliberate Pace',
    };
  }

  if (stats.currentStreak >= 3) {
    return {
      headline: `${stats.currentStreak}-Day Practice Streak!`,
      message: 'Consistency is your greatest superpower. Just 5 mindful minutes today keeps the rhythm alive.',
      actionText: 'Continue Streak',
    };
  }

  return {
    headline: 'Ready for Your Next Step?',
    message: `You have completed ${stats.sessionsCount} sessions and typed ${stats.totalWords} words. Pick an exercise and glide into the flow.`,
    actionText: 'Begin Practice',
  };
}
