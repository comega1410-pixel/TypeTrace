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
import { PageShell } from './PageShell';
import { generateRandomWords, CALM_QUOTES } from '../data/texts';
import {
  RotateCcw,
  Pause,
  Play,
  Keyboard,
  Sparkles,
  Type,
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

    if (status === 'idle' && newValue.length > 0) {
      setStatus('running');
    }

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
    lg: 'text-2xl sm:text-[26px] md:text-[28px] leading-relaxed tracking-wide',
    xl: 'text-3xl sm:text-4xl leading-loose tracking-wide',
  }[settings.fontSize];

  return (
    <PageShell
      variant="practice"
      peacefulMode={settings.peacefulMode}
      onClick={focusInput}
    >
      {/* Hidden input field for focused keyboard capture */}
      <input
        ref={inputRef}
        type="text"
        autoFocus
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="opacity-0 absolute -top-[9999px] left-0 pointer-events-none"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
      />

      {/* 3. Typing Practice Controls (Hidden in Peaceful Focus Mode) */}
      {!settings.peacefulMode && (
        <div className="mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
            {/* Left: Mode selector tabs */}
            <div className="flex items-center gap-1 bg-[#0f1728] p-1 rounded-xl border border-[#1e293b]">
              {activeLesson ? (
                <div className="px-3 py-1.5 rounded-lg bg-[#00d49a] text-[#0b0f14] font-bold flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    Level {activeLesson.level.levelNumber}: {activeLesson.exercise.title}
                  </span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setMode('words')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      mode === 'words'
                        ? 'bg-[#151f32] text-white shadow-xs font-semibold border border-[#22324d]'
                        : 'text-[#64748b] hover:text-white'
                    }`}
                  >
                    Words
                  </button>
                  <button
                    onClick={() => setMode('time')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      mode === 'time'
                        ? 'bg-[#151f32] text-white shadow-xs font-semibold border border-[#22324d]'
                        : 'text-[#64748b] hover:text-white'
                    }`}
                  >
                    Timed
                  </button>
                  <button
                    onClick={() => setMode('quotes')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      mode === 'quotes'
                        ? 'bg-[#151f32] text-white shadow-xs font-semibold border border-[#22324d]'
                        : 'text-[#64748b] hover:text-white'
                    }`}
                  >
                    Calm Quotes
                  </button>
                  <button
                    onClick={() => setIsCustomModalOpen(true)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      mode === 'custom'
                        ? 'bg-[#151f32] text-white shadow-xs font-semibold border border-[#22324d]'
                        : 'text-[#64748b] hover:text-white'
                    }`}
                  >
                    Custom
                  </button>
                </>
              )}
            </div>

            {/* Right: Word-count options, Guide, and text-size controls */}
            <div className="flex items-center gap-2">
              {!activeLesson && mode === 'words' && (
                <div className="flex items-center gap-1 bg-[#0f1728] p-1 rounded-xl border border-[#1e293b]">
                  {[10, 25, 50, 100].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWordTarget(w)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                        wordTarget === w
                          ? 'bg-[#00d49a] text-[#0b0f14] font-bold shadow-xs'
                          : 'text-[#64748b] hover:text-white'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              )}

              {!activeLesson && mode === 'time' && (
                <div className="flex items-center gap-1 bg-[#0f1728] p-1 rounded-xl border border-[#1e293b]">
                  {[15, 30, 60, 120].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTimeLimit(t);
                        setTimeRemaining(t);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                        timeLimit === t
                          ? 'bg-[#00d49a] text-[#0b0f14] font-bold shadow-xs'
                          : 'text-[#64748b] hover:text-white'
                      }`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              )}

              {/* Guide Toggle */}
              <button
                onClick={() => onUpdateSettings({ showKeyboardGuide: !settings.showKeyboardGuide })}
                className={`px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  settings.showKeyboardGuide
                    ? 'bg-[#00d49a]/10 text-[#00d49a] border-[#00d49a]/30 font-semibold'
                    : 'bg-[#0f1728] text-[#64748b] border-[#1e293b] hover:text-white'
                }`}
                title="Toggle On-screen Keyboard Guide"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Guide</span>
              </button>

              {/* Text Size Control */}
              <button
                onClick={() => {
                  const sizes: UserSettings['fontSize'][] = ['base', 'lg', 'xl'];
                  const nextSize = sizes[(sizes.indexOf(settings.fontSize) + 1) % sizes.length];
                  onUpdateSettings({ fontSize: nextSize });
                }}
                className="p-1.5 rounded-xl bg-[#0f1728] text-[#64748b] border border-[#1e293b] hover:text-white transition-colors cursor-pointer"
                title="Adjust typing text size"
              >
                <Type className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thin horizontal divider */}
          <div className="border-b border-[#1e293b] my-4" />

          {/* Stats Bar: WPM, Accuracy, Elapsed time, and Reset icon aligned right */}
          <div className="flex items-center justify-between px-1 text-xs font-medium">
            <div className="flex items-center gap-6 sm:gap-8">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748b] block">
                  WPM
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-white">
                  {liveMetrics.wpm}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748b] block">
                  Accuracy
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-white">
                  {liveMetrics.accuracy}%
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748b] block">
                  {mode === 'time' ? 'Time Left' : 'Elapsed'}
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-white">
                  {mode === 'time' ? `${timeRemaining}s` : `${elapsedSeconds}s`}
                </span>
              </div>
            </div>

            {/* Reset / Restart Icon aligned to the right */}
            <div className="flex items-center gap-2">
              {status === 'running' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatus('paused');
                  }}
                  className="p-2 rounded-xl bg-[#0f1728] border border-[#1e293b] text-[#64748b] hover:text-white transition-colors cursor-pointer"
                  title="Pause (Esc)"
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
                className="p-2 rounded-xl bg-[#0f1728] border border-[#1e293b] text-[#64748b] hover:text-[#00d49a] hover:border-[#00d49a]/40 transition-colors cursor-pointer"
                title="Restart practice (Tab)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Typing Area Card: Large dark navy rounded rectangle with subtle border */}
      <div
        className={`relative min-h-[190px] sm:min-h-[220px] p-6 sm:p-8 rounded-2xl border transition-all duration-300 font-mono cursor-text select-none shadow-xl ${
          settings.theme === 'dark'
            ? 'bg-[#0f1728] border-[#1e293b]'
            : settings.theme === 'sepia'
            ? 'bg-[var(--bg-panel)] border-[var(--border-panel)]'
            : 'bg-white border-slate-200'
        }`}
      >
        {/* Paused Overlay */}
        {status === 'paused' && (
          <div className="absolute inset-0 z-20 rounded-2xl bg-[#0b0f14]/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-white">
            <span className="font-sans text-lg font-bold">Practice Paused</span>
            <p className="text-xs text-[#94a3b8] font-sans">
              Press resume or click to continue your flow
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStatus('running');
                focusInput();
              }}
              className="mt-1 px-4 py-2 rounded-xl bg-[#00d49a] hover:bg-[#00d49a]/90 text-[#0b0f14] font-sans font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#00d49a]/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Resume
            </button>
          </div>
        )}

        {/* Status message in upper-right corner */}
        <div className="absolute top-3.5 right-4 text-[11px] font-sans text-[#475569] flex items-center gap-1.5 pointer-events-none">
          {status === 'idle' && userInput.length === 0 ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d49a] animate-ping"></span>
              <span>type to begin • tab to restart</span>
            </>
          ) : (
            <span>tab to restart</span>
          )}
        </div>

        {/* Text Rendering Engine */}
        <div className={`${fontSizeClasses} tracking-normal select-none leading-relaxed break-words pt-1`}>
          {targetText.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const isCorrect = isTyped && userInput[index] === char;
            const isIncorrect = isTyped && userInput[index] !== char;

            let charColor = '';
            if (isCorrect) {
              charColor = 'text-white font-medium';
            } else if (isIncorrect) {
              charColor = 'text-amber-400 bg-amber-500/20 rounded-xs';
            } else {
              charColor = 'text-[#475569]';
            }

            return (
              <span key={index} className="relative inline-block">
                {/* Thin neon-green blinking caret */}
                {isCurrent && (
                  <span className="absolute -left-[1px] inset-y-1 w-[2px] bg-[#00d49a] rounded-full animate-caret shadow-[0_0_8px_#00d49a] z-10" />
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
        <div className="mt-3.5 p-3 rounded-xl bg-[#00d49a]/10 border border-[#00d49a]/20 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00d49a] shrink-0" />
            <div>
              <span className="font-semibold text-[#00d49a]">
                Focus Keys:
              </span>{' '}
              <span className="text-[#cbd5e1]">
                {activeLesson.exercise.targetKeys.join(', ')} &mdash; {activeLesson.exercise.description}
              </span>
            </div>
          </div>
          <button
            onClick={onSwitchToLessons}
            className="text-[#00d49a] hover:underline font-semibold shrink-0 cursor-pointer"
          >
            All Lessons
          </button>
        </div>
      )}

      {/* 5. Next-Key Indicator & 6. Virtual Keyboard */}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#0f1728] border border-[#1e293b] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              Practice Custom Text
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Paste an article excerpt, book quote, or notes you want to practice typing.
            </p>
            <textarea
              rows={5}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste or write your custom text here..."
              className="w-full p-3 rounded-xl border border-[#22324d] bg-[#151f32] text-sm text-white focus:outline-none focus:border-[#00d49a] font-sans"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#94a3b8] hover:bg-[#151f32] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setMode('custom');
                  setIsCustomModalOpen(false);
                  initializeText();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00d49a] text-[#0b0f14] hover:bg-[#00d49a]/90 cursor-pointer shadow-sm shadow-[#00d49a]/30"
              >
                Start Custom Session
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
};
