import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PracticeMode,
  TypingSession,
  UserSettings,
  LearningLevel,
  LessonExercise,
} from '../types';
import { playKeySound } from '../utils/audio';
import { VirtualKeyboard } from './VirtualKeyboard';
import { generateRandomWords, CALM_QUOTES } from '../data/texts';
import {
  RotateCcw,
  Pause,
  Play,
  Keyboard,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  Sliders,
  Type,
  CheckCircle2,
} from 'lucide-react';

interface TypingAreaProps {
  settings: UserSettings;
  onUpdateSettings: (updater: Partial<UserSettings>) => void;
  onFinishSession: (session: TypingSession) => void;
  activeLesson?: { level: LearningLevel; exercise: LessonExercise } | null;
  onSwitchToLessons: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  settings,
  onUpdateSettings,
  onFinishSession,
  activeLesson,
  onSwitchToLessons,
}) => {
  // Practice configuration state
  const [mode, setMode] = useState<PracticeMode>(activeLesson ? 'learn' : 'words');
  const [timeLimit, setTimeLimit] = useState<number>(30); // 15, 30, 60, 120
  const [wordTarget, setWordTarget] = useState<number>(25); // 10, 25, 50, 100
  const [customText, setCustomText] = useState<string>('');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // Typing session runtime state
  const [targetText, setTargetText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle');
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [errorsCount, setErrorsCount] = useState<number>(0);

  // Hidden input element ref to capture keyboard on desktop & mobile
  const inputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Initialize or reset text when mode, lesson, or targets change
  const initializeText = useCallback(() => {
    let text = '';
    if (activeLesson) {
      text = activeLesson.exercise.text;
    } else if (mode === 'learn') {
      text = 'fff jjj ddd kkk asdf jkl; all ask dad fall salad';
    } else if (mode === 'time') {
      text = generateRandomWords(80);
      setTimeRemaining(timeLimit);
    } else if (mode === 'words') {
      text = generateRandomWords(wordTarget);
    } else if (mode === 'quotes') {
      const randomQuote = CALM_QUOTES[Math.floor(Math.random() * CALM_QUOTES.length)];
      text = `${randomQuote.quote}`;
    } else if (mode === 'custom') {
      text = customText.trim() || 'TypeTrack helps you build peaceful focus and confidence.';
    }

    setTargetText(text);
    setUserInput('');
    setStatus('idle');
    setElapsedSeconds(0);
    setErrorsCount(0);
    if (mode === 'time') {
      setTimeRemaining(timeLimit);
    }
  }, [mode, activeLesson, timeLimit, wordTarget, customText]);

  useEffect(() => {
    initializeText();
  }, [initializeText]);

  // Focus input automatically on click anywhere in typing area
  const focusInput = () => {
    if (status !== 'finished') {
      inputRef.current?.focus();
    }
  };

  // Timer loop
  useEffect(() => {
    if (status === 'running') {
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);

        if (mode === 'time') {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              // Time's up!
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [status, mode]);

  // Calculate live WPM and Accuracy
  const calculateMetrics = useCallback(() => {
    const timeInMins = Math.max(1, elapsedSeconds) / 60;
    // Standard WPM calculation: 5 characters = 1 word
    const correctChars = userInput.split('').filter((char, idx) => char === targetText[idx]).length;
    const grossWpm = Math.round(userInput.length / 5 / timeInMins);
    const netWpm = Math.max(0, Math.round(correctChars / 5 / timeInMins));
    const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;

    return {
      wpm: netWpm,
      rawWpm: grossWpm,
      accuracy,
      charactersCount: userInput.length,
      wordsCount: userInput.trim().split(/\s+/).filter(Boolean).length,
    };
  }, [userInput, targetText, elapsedSeconds]);

  // Complete session handler
  const finishSession = useCallback(() => {
    setStatus('finished');
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    const metrics = calculateMetrics();
    const duration = Math.max(1, elapsedSeconds);

    let modeDetail = '';
    if (activeLesson) {
      modeDetail = `Level ${activeLesson.level.levelNumber}: ${activeLesson.exercise.title}`;
    } else if (mode === 'time') {
      modeDetail = `${timeLimit}s Timed Run`;
    } else if (mode === 'words') {
      modeDetail = `${wordTarget} Words Sprint`;
    } else if (mode === 'quotes') {
      modeDetail = 'Mindful Quote';
    } else {
      modeDetail = 'Custom Practice';
    }

    const session: TypingSession = {
      id: `session-${Date.now()}`,
      timestamp: Date.now(),
      wpm: metrics.wpm,
      rawWpm: metrics.rawWpm,
      accuracy: metrics.accuracy,
      errors: errorsCount,
      charactersCount: metrics.charactersCount,
      wordsCount: metrics.wordsCount,
      durationSeconds: duration,
      mode,
      modeDetail,
      levelId: activeLesson ? activeLesson.level.id : undefined,
    };

    onFinishSession(session);
  }, [calculateMetrics, elapsedSeconds, activeLesson, mode, timeLimit, wordTarget, errorsCount, onFinishSession]);

  // Check end conditions: Time runs out OR all characters typed
  useEffect(() => {
    if (status === 'running') {
      if (mode === 'time' && timeRemaining <= 0) {
        finishSession();
      } else if (targetText.length > 0 && userInput.length >= targetText.length) {
        finishSession();
      }
    }
  }, [timeRemaining, userInput.length, targetText.length, status, mode, finishSession]);

  // Handle Keystrokes
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Shortcuts:
    // Tab + Enter or just click restart
    if (e.key === 'Tab') {
      e.preventDefault();
      initializeText();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setStatus((prev) => (prev === 'running' ? 'paused' : prev === 'paused' ? 'running' : prev));
      return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'paused' || status === 'finished') return;

    const newValue = e.target.value;

    // Start timer on first keystroke
    if (status === 'idle' && newValue.length > 0) {
      setStatus('running');
    }

    // Play gentle audio click
    const lastChar = newValue[newValue.length - 1];
    const targetChar = targetText[newValue.length - 1];
    const isError = lastChar !== targetChar;

    if (isError) {
      setErrorsCount((prev) => prev + 1);
      playKeySound(settings.sound, settings.volume, lastChar === ' ', true);
    } else {
      playKeySound(settings.sound, settings.volume, lastChar === ' ', false);
    }

    setUserInput(newValue);
  };

  const liveMetrics = calculateMetrics();
  const nextExpectedChar = userInput.length < targetText.length ? targetText[userInput.length] : null;

  // Font size styling
  const fontSizeClasses = {
    sm: 'text-lg sm:text-xl leading-relaxed',
    base: 'text-xl sm:text-2xl leading-relaxed',
    lg: 'text-2xl sm:text-3xl leading-relaxed tracking-wide',
    xl: 'text-3xl sm:text-4xl leading-loose tracking-wide',
  }[settings.fontSize];

  return (
    <div
      onClick={focusInput}
      className={`w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 transition-all duration-300 ${
        settings.peacefulMode ? 'py-10' : ''
      }`}
    >
      {/* Hidden input field for focused typing */}
      <input
        ref={inputRef}
        type="text"
        autoFocus
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="opacity-0 absolute -top-9999px left-0 pointer-events-none"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
      />

      {/* Top Options Bar (Hidden in Peaceful Mode for serene focus) */}
      {!settings.peacefulMode && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200/60 dark:border-slate-800/60 text-xs font-medium">
          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
            {activeLesson ? (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Level {activeLesson.level.levelNumber}: {activeLesson.exercise.title}</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setMode('words')}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg transition-colors ${
                    mode === 'words'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Words
                </button>
                <button
                  onClick={() => setMode('time')}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg transition-colors ${
                    mode === 'time'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Timed
                </button>
                <button
                  onClick={() => setMode('quotes')}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg transition-colors ${
                    mode === 'quotes'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Calm Quotes
                </button>
                <button
                  onClick={() => setIsCustomModalOpen(true)}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg transition-colors ${
                    mode === 'custom'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Custom
                </button>
              </>
            )}
          </div>

          {/* Sub-options based on active mode */}
          <div className="flex items-center gap-2">
            {!activeLesson && mode === 'time' && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg">
                {[15, 30, 60, 120].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTimeLimit(t);
                      setTimeRemaining(t);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      timeLimit === t
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t}s
                  </button>
                ))}
              </div>
            )}

            {!activeLesson && mode === 'words' && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg">
                {[10, 25, 50, 100].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWordTarget(w)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      wordTarget === w
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            )}

            {/* Keyboard Guide Toggle */}
            <button
              onClick={() => onUpdateSettings({ showKeyboardGuide: !settings.showKeyboardGuide })}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                settings.showKeyboardGuide
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
              title="Toggle On-screen Keyboard Guide"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Guide</span>
            </button>

            {/* Font Size Toggle */}
            <button
              onClick={() => {
                const sizes: UserSettings['fontSize'][] = ['base', 'lg', 'xl'];
                const nextSize = sizes[(sizes.indexOf(settings.fontSize) + 1) % sizes.length];
                onUpdateSettings({ fontSize: nextSize });
              }}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Adjust typing text size"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Live Minimal Stats Bar */}
      <div className="flex items-center justify-between px-2 mb-4 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">WPM</span>
            <span className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200">
              {liveMetrics.wpm}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Accuracy</span>
            <span className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200">
              {liveMetrics.accuracy}%
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              {mode === 'time' ? 'Time Left' : 'Elapsed'}
            </span>
            <span className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200">
              {mode === 'time' ? `${timeRemaining}s` : `${elapsedSeconds}s`}
            </span>
          </div>
        </div>

        {/* Status / Quick Action */}
        <div className="flex items-center gap-2">
          {status === 'running' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStatus('paused');
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Pause session (Esc)"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              initializeText();
              focusInput();
            }}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
            title="Restart practice (Tab)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Peaceful Typing Area Card */}
      <div
        className={`relative min-h-[180px] sm:min-h-[220px] p-6 sm:p-10 rounded-2xl border transition-all duration-300 font-mono cursor-text select-none ${
          settings.theme === 'dark'
            ? 'bg-slate-900/60 border-slate-800/90 shadow-inner'
            : settings.theme === 'sepia'
            ? 'bg-[#f5efe2] border-[#e4dcce] shadow-inner'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Paused Overlay */}
        {status === 'paused' && (
          <div className="absolute inset-0 z-20 rounded-2xl bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-white">
            <span className="font-sans text-lg font-bold">Practice Paused</span>
            <p className="text-xs text-slate-300 font-sans">
              Press resume or click to continue your flow
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStatus('running');
                focusInput();
              }}
              className="mt-1 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans font-semibold text-xs flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Resume
            </button>
          </div>
        )}

        {/* Click to focus hint if idle */}
        {status === 'idle' && userInput.length === 0 && (
          <div className="absolute top-2.5 right-4 text-[11px] font-sans text-slate-500 flex items-center gap-1 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Type to begin &middot; Tab to restart</span>
          </div>
        )}

        {/* Text Rendering Engine */}
        <div className={`${fontSizeClasses} tracking-normal select-none leading-relaxed break-words`}>
          {targetText.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const isCorrect = isTyped && userInput[index] === char;
            const isIncorrect = isTyped && userInput[index] !== char;

            let charColor = '';
            if (isCorrect) {
              charColor = 'text-emerald-500 dark:text-emerald-400';
            } else if (isIncorrect) {
              // Gentle, non-punitive warm orange/rose highlight
              charColor = 'text-amber-500 dark:text-amber-400 bg-amber-500/10 rounded-sm';
            } else {
              charColor = 'text-slate-400 dark:text-slate-600';
            }

            return (
              <span key={index} className="relative inline-block">
                {/* Active Caret */}
                {isCurrent && (
                  <span className="absolute -left-[1px] inset-y-0.5 w-[2.5px] bg-emerald-400 rounded-full animate-caret shadow-[0_0_8px_rgba(52,211,153,0.8)] z-10" />
                )}

                <span className={charColor}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Active Lesson Guidance Banner */}
      {activeLesson && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Focus Keys:
              </span>{' '}
              <span className="text-slate-700 dark:text-slate-300">
                {activeLesson.exercise.targetKeys.join(', ')} &mdash; {activeLesson.exercise.description}
              </span>
            </div>
          </div>
          <button
            onClick={onSwitchToLessons}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold shrink-0"
          >
            All Lessons
          </button>
        </div>
      )}

      {/* Interactive Virtual Keyboard for Beginners */}
      {settings.showKeyboardGuide && (
        <VirtualKeyboard
          currentKey={nextExpectedChar}
          theme={settings.theme}
          showHandsGuide={settings.showHandsGuide}
        />
      )}

      {/* Custom Text Modal */}
      {isCustomModalOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Practice Custom Text
            </h3>
            <p className="text-xs text-slate-500">
              Paste an article excerpt, book quote, or notes you want to practice typing.
            </p>
            <textarea
              rows={5}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste or write your custom text here..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setMode('custom');
                  setIsCustomModalOpen(false);
                  initializeText();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              >
                Start Custom Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
