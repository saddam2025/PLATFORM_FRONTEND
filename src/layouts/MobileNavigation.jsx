import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { BookMarked, BookOpen, Building2, ClipboardCheck, FolderOpen, LayoutDashboard, Library, MessageCircle, Plus, ShieldCheck, Users, Wallet, ChartNoAxesColumn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { managedInstructorIdFor } from '../utils/dashboardPath';

export default function MobileNavigation() {
  const { user } = useAuth() || {};
  const { instructorId } = useParams();
  if (!user) return null;

  const role = user.role;
  const managedId = managedInstructorIdFor(user);
  const base = managedId || instructorId ? `/${managedId || instructorId}` : '';
  let items;

  if (role === 'super_admin') {
    items = [
      { to: '/super-admin', label: 'الرئيسية', icon: LayoutDashboard, end: true },
      { to: '/super-admin/tenants', label: 'المؤسسات', icon: Building2, end: true },
      { to: '/super-admin/tenants/new', label: 'إضافة مؤسسة', icon: Plus },
      { to: '/super-admin/security', label: 'الأمان', icon: ShieldCheck },
    ];
  } else if (role === 'parent') {
    items = [
      { to: `${base}/parent/dashboard`, label: 'الرئيسية', icon: LayoutDashboard, end: true },
      { to: `${base}/parent/courses`, label: 'الكورسات', icon: BookOpen },
      { to: `${base}/parent/reports`, label: 'التقارير', icon: ChartNoAxesColumn },
      { to: `${base}/parent/activity`, label: 'النشاط', icon: MessageCircle },
    ];
  } else if (['admin', 'assistant', 'teacher'].includes(role)) {
    const isAdmin = role === 'admin';
    items = role === 'teacher' ? [
      { to: `${base}/assistant/dashboard`, label: 'الرئيسية', icon: LayoutDashboard, end: true },
      { to: `${base}/catalog`, label: 'الدورات', icon: Library },
      { to: `${base}/admin/courses`, label: 'إدارة المحتوى', icon: FolderOpen },
      { to: `${base}/assistant/grade`, label: 'التصحيح', icon: ClipboardCheck },
    ] : [
      { to: `${base}/${isAdmin ? 'admin' : 'assistant'}/dashboard`, label: 'الرئيسية', icon: LayoutDashboard, end: true },
      { to: `${base}/admin/courses`, label: 'الدورات', icon: Library },
      { to: `${base}/students`, label: 'الطلاب', icon: Users },
      { to: role === 'assistant' ? `${base}/assistant/messages` : `${base}/security`, label: role === 'assistant' ? 'الرسائل' : 'الأمان', icon: role === 'assistant' ? MessageCircle : ShieldCheck },
    ];
  } else {
    items = [
      { to: `${base}/dashboard`, label: 'الرئيسية', icon: LayoutDashboard, end: true },
      { to: `${base}/catalog`, label: 'الكورسات', icon: BookOpen },
      { to: `${base}/my-courses`, label: 'كورساتي', icon: BookMarked },
      { to: `${base}/wallet`, label: 'محفظتي', icon: Wallet },
    ];
  }

  return (
    <nav aria-label="التنقل الرئيسي للهاتف" className="mobile-navigation fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-surface-border bg-surface-default/95 px-1 pt-2 shadow-[0_-8px_24px_rgba(15,35,65,.08)] backdrop-blur md:hidden">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[11px] font-semibold transition-colors ${isActive ? 'text-brand-700' : 'text-ink-500 hover:text-ink-900'}`}>
          {({ isActive }) => <><span className={`grid h-8 w-10 place-items-center rounded-full ${isActive ? 'bg-brand-100' : ''}`}><Icon size={20} strokeWidth={isActive ? 2.4 : 1.9} aria-hidden="true" /></span><span className="max-w-full truncate">{label}</span></>}
        </NavLink>
      ))}
    </nav>
  );
}
