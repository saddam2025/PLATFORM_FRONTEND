// src/components/ui/ThemeToggle.jsx
import React, { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeProvider';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useContext(ThemeContext) || {};
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
      title={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-surface-default/80 text-ink-900 shadow-sm transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-3 focus-visible:ring-brand-500/30 ${className}`}
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
