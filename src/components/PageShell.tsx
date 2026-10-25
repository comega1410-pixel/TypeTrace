import React from 'react';

export interface PageShellProps {
  children: React.ReactNode;
  variant?: 'practice' | 'dashboard' | 'lessons';
  peacefulMode?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Shared page shell primitive to ensure consistent gutters, centering,
 * and vertical rhythm across Practice, Lessons, and Dashboard views.
 */
export const PageShell: React.FC<PageShellProps> = ({
  children,
  variant = 'practice',
  peacefulMode = false,
  className = '',
  onClick,
}) => {
  // Practice max-width is ~864px (matching reference specification), while Dashboard & Lessons use max-w-5xl
  const widthClass = variant === 'practice' ? 'max-w-[864px]' : 'max-w-5xl';
  const paddingClass = peacefulMode ? 'py-10' : variant === 'practice' ? 'py-4 sm:py-6' : 'py-6';

  return (
    <div
      onClick={onClick}
      className={`w-full ${widthClass} mx-auto px-4 ${paddingClass} transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};
