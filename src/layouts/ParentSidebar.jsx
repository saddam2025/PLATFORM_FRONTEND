// src/layouts/ParentSidebar.jsx
import React, { useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { InstructorContext } from '../contexts/InstructorContext';
import { useAuth } from '../hooks/useAuth'; // FIX: was importing non-existent useAuth from AuthProvider
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Logo from '../components/common/Logo';
import { sidebarActiveItemClass } from './Sidebar';
import { BookOpen, ChartNoAxesColumn, FileCheck2, GraduationCap, LayoutDashboard, LogOut, MessageSquareText, PanelRightClose, PanelRightOpen, Trophy } from 'lucide-react';

function Item({ to, children, icon: Icon }) {
  const collapsed = React.useContext(ParentSidebarCollapseContext);
  return (
    <NavLink
      to={to}
      title={collapsed ? children : undefined}
      aria-label={collapsed ? children : undefined}
      className={({ isActive }) =>
        `flex items-center ${collapsed ? 'justify-center p-1' : 'gap-3 justify-start flex-row-reverse px-4 py-3'} rounded-xl text-[15px] font-medium transition-all duration-300 ${
          isActive
            ? (collapsed ? 'bg-white text-ink-900' : sidebarActiveItemClass)
            : 'text-white/70 hover:text-white hover:bg-[var(--sidebar-bg-soft)]'
        }`
      }
    >
      {({ isActive }) => <><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${isActive ? 'bg-brand-100 text-ink-900' : 'bg-white/10 text-white'}`}><Icon size={19} aria-hidden="true" /></span>
      {!collapsed && <span>{children}</span>}</>}
    </NavLink>
  );
}

const ParentSidebarCollapseContext = React.createContext(false);

export default function ParentSidebar({ collapsed = false, onToggleCollapsed }) {
  const { selected } = useContext(InstructorContext);
  const { user, logout } = useAuth();
  const { instructorId } = useParams();
  const base = instructorId ? `/${instructorId}` : '';

  return (
    <ParentSidebarCollapseContext.Provider value={collapsed}>
    <div className={`sidebar-scroll flex h-full max-h-[100dvh] flex-col overscroll-contain bg-[var(--sidebar-bg)] text-white overflow-y-auto ${collapsed ? 'px-1 py-4' : 'px-4 py-8'}`}>
      <div className={`mb-6 flex items-center gap-3 ${collapsed ? 'justify-center px-0' : 'justify-between px-1'}`}>
        {!collapsed && <><Logo light /><div className="text-xs text-white/60">بوابة ولي الأمر</div></>}
        {onToggleCollapsed && <button type="button" onClick={onToggleCollapsed} aria-label={collapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'} title={collapsed ? 'توسيع القائمة' : 'طي القائمة'} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          {collapsed ? <PanelRightOpen size={20} aria-hidden="true" /> : <PanelRightClose size={20} aria-hidden="true" />}
        </button>}
      </div>

      {!collapsed && <div className="mb-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatarUrl || user?.avatar || selected?.avatar} name={user?.name || selected?.name || 'ولي الأمر'} size="md" />
          <div className="flex-1 min-w-0">
            <div className="truncate font-semibold text-white">{user?.name || 'ولي الأمر'}</div>
            <div className="truncate text-xs text-white/60">{selected?.name || 'منصة تعليمية'}</div>
          </div>
          <div>
            <Badge className="text-xs">{user?.role || 'ولي أمر'}</Badge>
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full !bg-white/10 !text-white !border-white/20 !shadow-none hover:!bg-white/20"
            onClick={logout}
          >
            تسجيل الخروج
          </Button>
        </div>
      </div>}

      <nav className="flex-1 space-y-1.5">
        <Item to={`${base}/parent/dashboard`} icon={LayoutDashboard}>لوحة التحكم</Item>
        <Item to={`${base}/parent/reports`} icon={ChartNoAxesColumn}>تقارير الأبناء</Item>
        <Item to={`${base}/parent/courses`} icon={BookOpen}>كورسات الابن</Item>
        <Item to={`${base}/parent/exam-grades`} icon={GraduationCap}>درجات الاختبارات</Item>
        <Item to={`${base}/parent/assignment-grades`} icon={FileCheck2}>درجات الواجبات والملاحظات</Item>
        <Item to={`${base}/parent/activity`} icon={MessageSquareText}>النشاط والرسائل</Item>
        <Item to={`${base}/parent/leaderboard`} icon={Trophy}>لوحة الشرف</Item>
      </nav>

      {collapsed && <button type="button" onClick={logout} aria-label="تسجيل الخروج" title="تسجيل الخروج" className="mt-4 grid h-10 w-10 self-center place-items-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white"><LogOut size={19} aria-hidden="true" /></button>}

    </div>
    </ParentSidebarCollapseContext.Provider>
  );
}
