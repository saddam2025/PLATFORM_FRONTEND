import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from '../components/ui/ThemeToggle';
import Button from '../components/ui/Button';

const HamburgerIcon = () => <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;

export default function Navbar({ sidebarOpen = false, onToggleSidebar }) {
  const { user } = useAuth() || {};
  const { instructorId } = useParams();
  const homeLink = instructorId ? `/${instructorId}` : '/';
  const loginLink = instructorId ? `/${instructorId}/login` : '/login';
  const registerLink = instructorId ? `/${instructorId}/register` : '/register';
  const accountLink = instructorId ? `/${instructorId}/dashboard` : '/';
  return <header className="navbar sticky top-0 z-30 h-[72px] justify-between border-b border-surface-border bg-surface-default/90 px-4 backdrop-blur-xl lg:px-7">
    <div className="flex items-center gap-3">
      {onToggleSidebar && <button type="button" onClick={onToggleSidebar} aria-label={sidebarOpen ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={sidebarOpen} className="rounded-xl p-2 text-ink-700 transition hover:bg-surface-muted lg:hidden"><HamburgerIcon /></button>}
      <Link to={homeLink} className="group inline-flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500 text-lg font-black text-white shadow-pop transition-transform group-hover:scale-105">ب</span><span className="text-right leading-tight"><b className="block text-base font-extrabold text-navy-900">رياضياتي</b><small className="text-[11px] font-medium text-ink-500">تعلّم بثقة وتفوّق</small></span></Link>
    </div>
    <nav className="flex items-center gap-2 sm:gap-3"><ThemeToggle />{user ? <Link to={accountLink} className="inline-flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2 text-sm font-bold text-ink-900 transition hover:bg-brand-50"><UserIcon /><span className="hidden sm:inline">حسابي</span></Link> : <><Link to={loginLink}><Button variant="ghost" size="sm">تسجيل الدخول</Button></Link><Link to={registerLink}><Button variant="primary" size="sm">ابدأ الآن</Button></Link></>}</nav>
  </header>;
}
