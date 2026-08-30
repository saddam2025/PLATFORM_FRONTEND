import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Building2, LayoutDashboard, LogOut, Menu, Plus, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from '../components/ui/ThemeToggle';

const navItems = [
  { to: '/super-admin', label: 'نظرة عامة', icon: LayoutDashboard, end: true },
  { to: '/super-admin/tenants', label: 'المؤسسات', icon: Building2 },
  { to: '/super-admin/tenants/new', label: 'إضافة مؤسسة', icon: Plus },
];

export default function SuperAdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const links = (mobile = false) => <nav className="space-y-2">{navItems.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => mobile && setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand-500 text-white shadow-pop' : 'text-ink-700 hover:bg-surface-muted'}`}><Icon size={19} />{label}</NavLink>)}</nav>;
  return <div dir="rtl" className="min-h-screen bg-surface-canvas text-ink-900"><aside className="fixed inset-y-0 right-0 z-30 hidden w-72 border-l border-surface-border bg-surface-default p-5 lg:block"><div className="mb-8"><p className="text-xs font-bold text-brand-600">PLATFORM</p><h1 className="mt-1 text-xl font-bold">الإدارة العليا</h1><p className="mt-1 truncate text-sm text-ink-500">{user?.name || 'Super Admin'}</p></div>{links()}<button type="button" onClick={logout} className="absolute bottom-6 flex w-[calc(100%-40px)] items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-danger-DEFAULT hover:bg-danger-soft"><LogOut size={19} />تسجيل الخروج</button></aside><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-surface-border bg-surface-default/90 px-4 backdrop-blur lg:mr-72 lg:px-8"><button type="button" onClick={() => setOpen(true)} className="rounded-lg p-2 text-ink-700 hover:bg-surface-muted lg:hidden" aria-label="فتح القائمة"><Menu /></button><div><p className="text-sm font-bold">لوحة الإدارة العليا</p><p className="text-xs text-ink-500">إدارة المؤسسات والاشتراكات</p></div><ThemeToggle /></header>{open && <div className="fixed inset-0 z-40 lg:hidden"><button type="button" aria-label="إغلاق القائمة" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} /><aside className="absolute inset-y-0 right-0 w-72 bg-surface-default p-5 shadow-panel"><button type="button" onClick={() => setOpen(false)} className="mb-6 rounded-lg p-2 text-ink-700 hover:bg-surface-muted"><X /></button>{links(true)}</aside></div>}<main className="p-4 sm:p-6 lg:mr-72 lg:p-8"><Outlet /></main></div>;
}
