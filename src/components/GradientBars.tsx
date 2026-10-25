import React from 'react';

export interface GradientBarsProps {
  numBars?: number;
  gradientFrom?: string;
  gradientTo?: string;
  animationDuration?: number;
  className?: string;
}

/**
 * Animated GradientBars background component.
 * Renders pulsing vertical gradient equalizer bars rising from the bottom of the viewport.
 */
export const GradientBars: React.FC<GradientBarsProps> = ({
  numBars = 15,
  gradientFrom = 'rgba(0, 212, 154, 0.35)',
  gradientTo = 'transparent',
  animationDuration = 2.2,
  className = '',
}) => {
  // Height calculation function matching the 21st.dev specification:
  // creates a smooth symmetric curve that peaks towards the edges and valleys in the center
  const calculateHeight = (index: number, total: number) => {
    const progress = index / (total - 1);
    const max = 100;
    const min = 30;
    const centerDist = Math.abs(progress - 0.5);
    const curve = Math.pow(centerDist * 2, 1.2);
    return min + (max - min) * curve;
  };

  return (
    <div
      className={`fixed inset-0 z-0 overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className="flex h-full w-full"
        style={{
          width: '100%',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {Array.from({ length: numBars }).map((_, index) => {
          const height = calculateHeight(index, numBars);
          return (
            <div
              key={index}
              style={{
                flex: `1 0 calc(100% / ${numBars})`,
                maxWidth: `calc(100% / ${numBars})`,
                height: '100%',
                background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
                transform: `scaleY(${height / 100})`,
                transformOrigin: 'bottom',
                transition: 'transform 0.5s ease-in-out',
                animation: `pulseBar ${animationDuration}s ease-in-out infinite alternate`,
                animationDelay: `${index * 0.1}s`,
                outline: '1px solid rgba(0, 0, 0, 0)',
                boxSizing: 'border-box',
                // @ts-expect-error CSS variable
                '--initial-scale': height / 100,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
