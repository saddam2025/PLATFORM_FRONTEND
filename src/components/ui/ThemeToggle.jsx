// src/components/ui/ThemeToggle.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeProvider';

// Rebuilt to use Material Symbols (dark_mode / light_mode) instead of
// hand-rolled SVG paths, now that the icon system is standardized project-
// wide. Both icons stay mounted and crossfade via opacity/rotate/scale so
// the transition is a real crossfade, not a hard text swap (a plain glyph
// swap wouldn't animate on its own).
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useContext(ThemeContext) || {};
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
      className={`relative inline-flex h-8 w-14 items-center rounded-pill transition-colors duration-300 active:scale-95
        ${isDark ? 'bg-gradient-to-l from-surface-muted to-brand-700' : 'bg-gradient-to-l from-brand-200 to-brand-500'}
        ${className}`}
    >
      <span
        className={`absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface-default shadow-soft
          transition-transform duration-300 ease-soft
          ${isDark ? 'translate-x-1' : 'translate-x-7'}`}
      >
        <span
          className={`material-symbols-outlined absolute text-[18px] text-brand-600 transition-all duration-300
            ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          light_mode
        </span>
        <span
          className={`material-symbols-outlined absolute text-[18px] text-teal-DEFAULT transition-all duration-300
            ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          dark_mode
        </span>
      </span>
    </button>
  );
}