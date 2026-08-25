// src/layouts/Navbar.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from '../components/ui/ThemeToggle';
import Button from '../components/ui/Button';

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar({ sidebarOpen = false, onToggleSidebar }) {
  const { user } = useAuth() || {};
  const { instructorId } = useParams();

  const homeLink = instructorId ? `/${instructorId}` : '/';
  const loginLink = instructorId ? `/${instructorId}/login` : '/login';
  const registerLink = instructorId ? `/${instructorId}/register` : '/register';
  const accountLink = instructorId ? `/${instructorId}/dashboard` : '/';

  return (
    <div className="navbar sticky top-0 z-30 backdrop-blur-md bg-surface-DEFAULT/90 border-b border-surface-border px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onToggleSidebar ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={sidebarOpen}
            className="lg:hidden p-2 rounded-2xl text-ink-700 hover:bg-surface-muted transition-colors active:scale-95"
          >
            <HamburgerIcon />
          </button>
        ) : null}

        <Link to={homeLink} className="inline-flex items-center gap-3 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-ink-900 font-extrabold shadow-pop transition-transform group-hover:scale-105">
            Σ
          </span>
          <div className="text-right">
            <div className="text-base font-extrabold text-brand-700">رياضياتي</div>
            <div className="text-xs text-ink-500">منصة الرياضيات</div>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {user ? (
          <Link
            to={accountLink}
            className="inline-flex items-center gap-2 rounded-2xl border border-surface-border bg-surface-default px-3 py-2 text-sm font-semibold text-ink-900 transition-colors hover:bg-surface-muted"
          >
            <UserIcon />
            <span>حسابي</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link to={loginLink}>
              <Button variant="ghost" size="sm" className="backdrop-blur-sm bg-surface-default/60 border border-surface-border">تسجيل الدخول</Button>
            </Link>
            <Link to={registerLink}>
              <Button variant="primary" size="sm">إنشاء حساب</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
