// src/layouts/Navbar.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
// FIX: use the useAuth hook (matches convention used everywhere else in the
// app) instead of useContext(AuthContext) directly.
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from '../components/ui/ThemeToggle';
import Button from '../components/ui/Button';

// Reduced-scope navbar per the redesign: only logo, theme toggle, and
// EITHER (Login + Register) when logged out OR (notification bell) when
// logged in — user avatar/name/logout all moved into the sidebar. A
// hamburger button is also rendered here (mobile only) to open the sidebar,
// since Layouts.jsx now controls that state and passes it down.
export default function Navbar({ onOpenSidebar }) {
  const { user } = useAuth() || {};
  const { instructorId } = useParams();

  const homeLink = instructorId ? `/${instructorId}` : '/';

  return (
    <div className="navbar sticky top-0 z-30 backdrop-blur-md bg-surface-DEFAULT/80 border-b border-surface-border px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-full text-ink-700 hover:bg-surface-muted transition-colors active:scale-95"
          aria-label="فتح القائمة"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <Link to={homeLink} className="inline-flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-ink-900 font-extrabold shadow-pop transition-transform group-hover:scale-105">
            Σ
          </span>
          <span className="text-xl font-extrabold text-brand-700">رياضياتي</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {user ? (
          <button
            type="button"
            className="relative p-2.5 rounded-full text-ink-700 bg-surface-muted hover:bg-brand-100 hover:text-brand-700 transition-colors active:scale-95"
            aria-label="الإشعارات"
          >
            <span className="material-symbols-outlined">notifications</span>
            {/* Unread-count dot — static for now; wire to the real
                notifications endpoint once it exists on the backend. */}
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-danger-DEFAULT ring-2 ring-surface-DEFAULT" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">تسجيل الدخول</Button>
            </Link>
            {/* FIX: previously linked to "/register", but that route is
                actually scoped as "/:instructorId/register" and requires an
                instructorId — a bare "/register" 404s. Registration always
                starts from the instructor selector at "/". */}
            <Link to="/">
              <Button variant="primary" size="sm">إنشاء حساب</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
