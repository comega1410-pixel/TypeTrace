import React from 'react';

export interface VirtualKeyboardProps {
  currentKey: string | null;
  theme: 'light' | 'dark' | 'sepia';
  showKeyboard?: boolean;
  showHandsGuide?: boolean;
}

interface KeyConfig {
  key: string;
  display?: string;
  finger: 'L-Pinky' | 'L-Ring' | 'L-Middle' | 'L-Index' | 'R-Index' | 'R-Middle' | 'R-Ring' | 'R-Pinky' | 'Thumb';
  width?: string;
}

const KEY_LAYOUT: KeyConfig[][] = [
  // Number row
  [
    { key: '`', finger: 'L-Pinky' },
    { key: '1', finger: 'L-Pinky' },
    { key: '2', finger: 'L-Ring' },
    { key: '3', finger: 'L-Middle' },
    { key: '4', finger: 'L-Index' },
    { key: '5', finger: 'L-Index' },
    { key: '6', finger: 'R-Index' },
    { key: '7', finger: 'R-Index' },
    { key: '8', finger: 'R-Middle' },
    { key: '9', finger: 'R-Ring' },
    { key: '0', finger: 'R-Pinky' },
    { key: '-', finger: 'R-Pinky' },
    { key: '=', finger: 'R-Pinky' },
    { key: 'Backspace', display: 'delete', finger: 'R-Pinky', width: 'w-14 sm:w-16' },
  ],
  // Top row
  [
    { key: 'Tab', display: 'tab', finger: 'L-Pinky', width: 'w-12 sm:w-14' },
    { key: 'q', finger: 'L-Pinky' },
    { key: 'w', finger: 'L-Ring' },
    { key: 'e', finger: 'L-Middle' },
    { key: 'r', finger: 'L-Index' },
    { key: 't', finger: 'L-Index' },
    { key: 'y', finger: 'R-Index' },
    { key: 'u', finger: 'R-Index' },
    { key: 'i', finger: 'R-Middle' },
    { key: 'o', finger: 'R-Ring' },
    { key: 'p', finger: 'R-Pinky' },
    { key: '[', finger: 'R-Pinky' },
    { key: ']', finger: 'R-Pinky' },
    { key: '\\', finger: 'R-Pinky' },
  ],
  // Home row
  [
    { key: 'CapsLock', display: 'caps', finger: 'L-Pinky', width: 'w-14 sm:w-16' },
    { key: 'a', finger: 'L-Pinky' },
    { key: 's', finger: 'L-Ring' },
    { key: 'd', finger: 'L-Middle' },
    { key: 'f', finger: 'L-Index' },
    { key: 'g', finger: 'L-Index' },
    { key: 'h', finger: 'R-Index' },
    { key: 'j', finger: 'R-Index' },
    { key: 'k', finger: 'R-Middle' },
    { key: 'l', finger: 'R-Ring' },
    { key: ';', finger: 'R-Pinky' },
    { key: "'", finger: 'R-Pinky' },
    { key: 'Enter', display: 'return', finger: 'R-Pinky', width: 'w-14 sm:w-16' },
  ],
  // Bottom row
  [
    { key: 'ShiftLeft', display: 'shift', finger: 'L-Pinky', width: 'w-16 sm:w-20' },
    { key: 'z', finger: 'L-Pinky' },
    { key: 'x', finger: 'L-Ring' },
    { key: 'c', finger: 'L-Middle' },
    { key: 'v', finger: 'L-Index' },
    { key: 'b', finger: 'L-Index' },
    { key: 'n', finger: 'R-Index' },
    { key: 'm', finger: 'R-Index' },
    { key: ',', finger: 'R-Middle' },
    { key: '.', finger: 'R-Ring' },
    { key: '/', finger: 'R-Pinky' },
    { key: 'ShiftRight', display: 'shift', finger: 'R-Pinky', width: 'w-16 sm:w-20' },
  ],
  // Space row
  [
    { key: 'Control', display: 'ctrl', finger: 'L-Pinky', width: 'w-12' },
    { key: 'Alt', display: 'alt', finger: 'L-Pinky', width: 'w-12' },
    { key: ' ', display: 'space', finger: 'Thumb', width: 'flex-1 max-w-sm sm:max-w-md' },
    { key: 'AltGraph', display: 'alt', finger: 'R-Pinky', width: 'w-12' },
    { key: 'ControlRight', display: 'ctrl', finger: 'R-Pinky', width: 'w-12' },
  ],
];

const FINGER_NAMES: Record<KeyConfig['finger'], string> = {
  'L-Pinky': 'Left Pinky',
  'L-Ring': 'Left Ring finger',
  'L-Middle': 'Left Middle finger',
  'L-Index': 'Left Index finger',
  'R-Index': 'Right Index finger',
  'R-Middle': 'Right Middle finger',
  'R-Ring': 'Right Ring finger',
  'R-Pinky': 'Right Pinky',
  'Thumb': 'Thumb',
};

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  currentKey,
  theme,
  showKeyboard = true,
  showHandsGuide = true,
}) => {
  if (!showKeyboard && !showHandsGuide) {
    return null;
  }

  const normalizedTargetKey = (currentKey || '').toLowerCase();

  let activeFinger: KeyConfig['finger'] | null = null;
  if (currentKey === ' ') {
    activeFinger = 'Thumb';
  } else if (currentKey) {
    for (const row of KEY_LAYOUT) {
      const match = row.find((k) => k.key.toLowerCase() === normalizedTargetKey);
      if (match) {
        activeFinger = match.finger;
        break;
      }
    }
  }

  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  return (
    <div className="w-full max-w-[864px] mx-auto select-none mt-4 sm:mt-5 space-y-3 transition-all duration-300">
      {/* 5. Next-key indicator: centered dark green status bar with thin green border */}
      {showHandsGuide && currentKey && activeFinger && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl bg-[#00d49a]/15 backdrop-blur-md text-[#00d49a] border border-[#00d49a]/35 max-w-md mx-auto shadow-md">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00d49a] animate-pulse"></span>
            <span>
              Next Key:{' '}
              <strong className="font-mono text-sm underline font-bold text-white">
                {currentKey === ' ' ? 'Space' : currentKey}
              </strong>
            </span>
          </div>
          <span className="font-normal text-[#00d49a] text-[11px] sm:text-xs">
            Use: <strong>{FINGER_NAMES[activeFinger]}</strong>
          </span>
        </div>
      )}

      {/* 6. Virtual Keyboard Container with light-balanced key labels */}
      {showKeyboard && (
        <div
          className={`p-2.5 sm:p-4 rounded-2xl border transition-colors shadow-2xl overflow-x-auto ${
            isDark
              ? 'bg-[#0f1728]/85 backdrop-blur-md border-white/12'
              : isSepia
              ? 'bg-[var(--bg-panel)] backdrop-blur-md border-[var(--border-panel)]'
              : 'bg-white/95 backdrop-blur-md border-slate-200 shadow-xl'
          }`}
        >
          <div className="flex flex-col gap-1 sm:gap-1.5 min-w-[580px] sm:min-w-0">
            {KEY_LAYOUT.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
                {row.map((item, keyIndex) => {
                  const isTarget =
                    (item.key === ' ' && currentKey === ' ') ||
                    (item.key.length === 1 && item.key.toLowerCase() === normalizedTargetKey);

                  const isHomeRowAnchor = item.key === 'f' || item.key === 'j';

                  let keyClasses =
                    'h-8 sm:h-9 md:h-10 text-[11px] sm:text-xs font-semibold rounded-lg flex flex-col items-center justify-center transition-all duration-150 relative shadow-xs ';

                  if (item.width) {
                    keyClasses += item.width + ' ';
                  } else {
                    keyClasses += 'w-7 sm:w-8 md:w-10 ';
                  }

                  if (isTarget) {
                    keyClasses +=
                      'bg-[#00d49a] text-[#0b0f14] shadow-lg shadow-[#00d49a]/35 scale-105 z-10 border border-[#00d49a] font-bold';
                  } else if (isDark) {
                    // Light, crisp keycap labels
                    keyClasses +=
                      'bg-[#162238] text-slate-100 border border-white/10 hover:border-white/20 hover:text-white';
                  } else if (isSepia) {
                    keyClasses +=
                      'bg-[var(--key-bg)] text-[var(--key-text)] border border-[var(--key-border)] hover:opacity-90';
                  } else {
                    keyClasses +=
                      'bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300';
                  }

                  return (
                    <div key={keyIndex} className={keyClasses}>
                      <span>{item.display || item.key.toUpperCase()}</span>

                      {/* Raised tactile bump dot on F and J */}
                      {isHomeRowAnchor && !isTarget && (
                        <span
                          className={`w-3 h-0.5 rounded-full absolute bottom-1 ${
                            isDark
                              ? 'bg-slate-300'
                              : isSepia
                              ? 'bg-[var(--key-bump)]'
                              : 'bg-slate-400'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Hand reference footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-300 mt-3 pt-2.5 border-t border-white/10 px-2 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d49a]"></span>
              <span>
                Home row anchors: <strong className="text-white">F</strong> &amp; <strong className="text-white">J</strong>
              </span>
            </div>
            <span className="hidden sm:inline text-slate-400">
              Rest fingers gently &amp; keep wrists relaxed
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
