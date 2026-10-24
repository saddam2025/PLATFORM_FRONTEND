import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Building2, LayoutDashboard, LogOut, Menu, PanelRightClose, PanelRightOpen, Plus, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from '../components/ui/ThemeToggle';
import Logo from '../components/common/Logo';
import MobileNavigation from './MobileNavigation';

const navItems = [
  { to: '/super-admin', label: 'نظرة عامة', icon: LayoutDashboard, end: true },
  { to: '/super-admin/tenants', label: 'المؤسسات', icon: Building2, end: true },
  { to: '/super-admin/tenants/new', label: 'إضافة مؤسسة', icon: Plus },
  { to: '/super-admin/security', label: 'أمان الحساب', icon: ShieldCheck },
];

export default function SuperAdminLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);
  const links = (mobile = false, isCollapsed = false) => <nav className="flex-1 space-y-2">{navItems.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => mobile && setOpen(false)} title={isCollapsed ? label : undefined} aria-label={isCollapsed ? label : undefined} className={({ isActive }) => `flex items-center ${isCollapsed ? 'justify-center p-1' : 'gap-4 justify-start flex-row-reverse px-6 py-3'} text-[15px] transition duration-200 ${isActive ? 'rounded-xl bg-surface-default text-ink-900 font-semibold' : 'rounded-xl text-white/70 hover:bg-white/5 hover:text-white'}`}><span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-white"><Icon size={19} /></span>{!isCollapsed && <span>{label}</span>}</NavLink>)}</nav>;
  const side = (mobile = false, isCollapsed = false) => <><div className={`mb-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3 ${isCollapsed ? 'px-0' : 'px-1'}`}>{!isCollapsed && <><Logo light /><div className="text-xs text-white/60">منصة التعلم الذكي</div></>}<button type="button" onClick={() => isCollapsed ? setCollapsed(false) : setCollapsed(true)} className={`${mobile ? 'hidden' : 'grid'} h-10 w-10 shrink-0 place-items-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white`} aria-label={isCollapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'} title={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}>{isCollapsed ? <PanelRightOpen size={20} /> : <PanelRightClose size={20} />}</button></div>{!isCollapsed && <div className="mb-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"><p className="font-semibold text-white">الإدارة العليا</p><p className="mt-1 truncate text-xs text-white/60">{user?.name || 'Super Admin'}</p></div>}{links(mobile, isCollapsed)}<button type="button" onClick={() => { setOpen(false); logout(); }} aria-label={isCollapsed ? 'تسجيل الخروج' : undefined} title={isCollapsed ? 'تسجيل الخروج' : undefined} className={`mt-4 flex w-full items-center ${isCollapsed ? 'justify-center p-1' : 'gap-4 justify-start flex-row-reverse px-6 py-3'} rounded-xl text-[15px] font-medium text-white/70 transition hover:bg-white/5 hover:text-white`}><span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10"><LogOut size={19} /></span>{!isCollapsed && <span>تسجيل الخروج</span>}</button></>;
  return <div dir="rtl" className="min-h-screen bg-surface-canvas text-ink-900"><aside className={`sidebar-scroll fixed inset-y-0 right-0 z-30 hidden h-[100dvh] overscroll-contain overflow-y-auto bg-[var(--sidebar-bg)] py-4 text-white transition-[width] duration-200 md:flex md:flex-col ${collapsed ? 'w-[var(--sidebar-collapsed-width)] px-1' : 'w-72 px-4 py-8'}`}>{side(false, collapsed)}</aside><header className={`sticky top-3 z-20 mx-4 flex h-16 items-center justify-between rounded-[2rem] bg-[#1081f5] px-3 text-white shadow-panel sm:px-5 ${collapsed ? 'md:mr-[var(--sidebar-collapsed-header-offset)]' : 'md:mr-80'} md:ml-4 md:px-7`}><button type="button" onClick={() => setOpen(true)} className="rounded-xl p-2 hover:bg-white/10 md:hidden" aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={open}><Menu /></button><div><p className="text-sm font-bold">لوحة الإدارة العليا</p><p className="text-xs text-white/70">إدارة المؤسسات والاشتراكات</p></div><ThemeToggle className="!border-white/20 !bg-white/10 !text-white !shadow-none" /></header>{open && <div className="fixed inset-0 z-40 md:hidden"><button type="button" aria-label="إغلاق القائمة" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} /><aside className="sidebar-scroll absolute inset-y-0 right-0 flex h-[100dvh] w-72 flex-col overscroll-contain overflow-y-auto bg-[var(--sidebar-bg)] px-4 py-8 text-white shadow-panel"><button type="button" onClick={() => setOpen(false)} className="mb-4 self-start rounded-lg p-2 text-white hover:bg-white/10"><X /></button>{side(true, false)}</aside></div>}<main className={`dot-grid-background p-4 pb-28 sm:p-6 sm:pb-28 md:pb-6 lg:p-8 ${collapsed ? 'md:mr-[var(--sidebar-collapsed-width)]' : 'md:mr-72'}`}><Outlet /></main><MobileNavigation /></div>;
}
