import React from 'react';

interface VirtualKeyboardProps {
  currentKey: string | null;
  theme: 'light' | 'dark' | 'sepia';
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
    { key: 'Backspace', display: 'delete', finger: 'R-Pinky', width: 'w-16' },
  ],
  // Top row
  [
    { key: 'Tab', display: 'tab', finger: 'L-Pinky', width: 'w-14' },
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
    { key: 'CapsLock', display: 'caps', finger: 'L-Pinky', width: 'w-16' },
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
    { key: 'Enter', display: 'return', finger: 'R-Pinky', width: 'w-16' },
  ],
  // Bottom row
  [
    { key: 'ShiftLeft', display: 'shift', finger: 'L-Pinky', width: 'w-20' },
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
    { key: 'ShiftRight', display: 'shift', finger: 'R-Pinky', width: 'w-20' },
  ],
  // Space row
  [
    { key: 'Control', display: 'ctrl', finger: 'L-Pinky', width: 'w-12' },
    { key: 'Alt', display: 'alt', finger: 'L-Pinky', width: 'w-12' },
    { key: ' ', display: 'space', finger: 'Thumb', width: 'flex-1 max-w-md' },
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
  'Thumb': 'Right or Left Thumb',
};

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  currentKey,
  theme,
  showHandsGuide = true,
}) => {
  const normalizedTargetKey = (currentKey || '').toLowerCase();

  // Find target finger for active key
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
    <div className="w-full max-w-4xl mx-auto select-none mt-6 transition-all duration-300">
      {/* Finger guide hint */}
      {showHandsGuide && currentKey && activeFinger && (
        <div className="flex items-center justify-between px-3 py-1.5 mb-2 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Next Key: <strong className="font-mono text-sm underline">{currentKey === ' ' ? 'Space' : currentKey}</strong></span>
          </div>
          <span className="text-emerald-300/90 font-normal">Use: <strong>{FINGER_NAMES[activeFinger]}</strong></span>
        </div>
      )}

      {/* Keyboard Container */}
      <div
        className={`p-3 sm:p-4 rounded-2xl border transition-colors shadow-sm ${
          isDark
            ? 'bg-slate-900/80 border-slate-800'
            : isSepia
            ? 'bg-[#f4efe4] border-[#e2d9c8]'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col gap-1.5">
          {KEY_LAYOUT.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
              {row.map((item, keyIndex) => {
                const isTarget =
                  (item.key === ' ' && currentKey === ' ') ||
                  (item.key.length === 1 && item.key.toLowerCase() === normalizedTargetKey);

                const isHomeRowAnchor = item.key === 'f' || item.key === 'j';

                let keyClasses = 'h-9 sm:h-10 text-xs sm:text-sm font-medium rounded-lg flex flex-col items-center justify-center transition-all duration-150 relative ';

                if (item.width) {
                  keyClasses += item.width + ' ';
                } else {
                  keyClasses += 'w-8 sm:w-10 ';
                }

                if (isTarget) {
                  keyClasses += 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-105 z-10 border-emerald-400 font-bold';
                } else if (isDark) {
                  keyClasses += 'bg-slate-800/90 text-slate-300 border border-slate-700/60 hover:border-slate-600';
                } else if (isSepia) {
                  keyClasses += 'bg-[#e9e1d1] text-[#4a3f35] border border-[#d8cdbc] hover:border-[#b8aa96]';
                } else {
                  keyClasses += 'bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300';
                }

                return (
                  <div key={keyIndex} className={keyClasses}>
                    <span>{item.display || item.key.toUpperCase()}</span>

                    {/* Raised tactile bump dot on F and J */}
                    {isHomeRowAnchor && !isTarget && (
                      <span className={`w-3 h-0.5 rounded-full absolute bottom-1.5 ${
                        isDark ? 'bg-slate-500' : isSepia ? 'bg-[#988876]' : 'bg-slate-400'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Hand reference footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-500/10 px-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Home row anchors: <strong>F</strong> (Left Index) & <strong>J</strong> (Right Index)</span>
          </div>
          <span className="hidden sm:inline text-slate-400">Rest fingers gently & keep wrists elevated</span>
        </div>
      </div>
    </div>
  );
};
