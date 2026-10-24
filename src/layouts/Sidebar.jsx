// src/layouts/Sidebar.jsx
//
// FULL REBUILD per the Stitch reference designs (login/plan/grading screens).
// All existing logic is preserved exactly — InstructorContext, useParams,
// useAuth, role-gated nav sections (student/assistant/admin/parent), and the
// instructor-switcher list. Only styling/markup changed.
//
// CUTOUT TECHNIQUE — lifted directly from the Stitch export rather than the
// earlier hand-built version, since Stitch generated it correctly for a
// right-side RTL sidebar from the start (rounded-l-full on the tab itself,
// with ::after/::before positioned at right-0 using large negative offsets
// and a spread box-shadow matching the page canvas color, instead of the
// earlier small-corner-radius stacking trick).
//
// Now a fixed-position element (see Layouts.jsx) — no longer needs the old
// -m-5/p-5 edge-bleed hack, since it fills its own <aside> completely with
// no ancestor padding to fight against.
//
// LOGOUT — moved here from Navbar.jsx, which no longer renders it (per the
// redesign's reduced navbar scope). Without this, there'd be no way to log
// out at all.

import React, { useContext } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { InstructorContext } from '../contexts/InstructorContext';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/common/Logo';
import { managedInstructorIdFor } from '../utils/dashboardPath';
import { LogOut, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { navigationIcons } from './navigationIcons';

const SidebarCollapseContext = React.createContext(false);

function SidebarIcon({ name }) {
  const Icon = navigationIcons[name] || navigationIcons.dashboard;
  return <Icon className="h-5 w-5" aria-hidden="true" />;
}

export const sidebarActiveItemClass = 'flex items-center gap-4 justify-start flex-row-reverse rounded-l-full bg-surface-default text-ink-900 font-semibold px-6 py-3 transition duration-200';

function Item({ to, icon, children, activeWhen }) {
  const collapsed = useContext(SidebarCollapseContext);
  const location = useLocation();
  const explicitActive = activeWhen ? activeWhen(location) : null;

  return (
    <NavLink to={to} title={collapsed ? children : undefined} aria-label={collapsed ? children : undefined} className="group block">
      {({ isActive }) => (
        <span
          className={
            (explicitActive ?? isActive)
              ? (collapsed ? 'flex items-center justify-center rounded-xl bg-surface-default text-ink-900 font-semibold p-1 transition duration-200' : sidebarActiveItemClass)
              : `flex items-center ${collapsed ? 'justify-center p-1' : 'gap-4 justify-start flex-row-reverse px-6 py-3'} text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors duration-200`
          }
        >
          <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ${(explicitActive ?? isActive) ? 'bg-brand-100 text-ink-900' : 'bg-white/10 text-white'}`}>
            <SidebarIcon name={icon} />
          </span>
          {!collapsed && <span className="text-[15px]">{children}</span>}
        </span>
      )}
    </NavLink>
  );
}

function BrandHeader({ collapsed, onToggleCollapsed }) {
  return (
    <div className={`mb-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-3 ${collapsed ? 'px-0' : 'px-1'}`}>
      {!collapsed && <Logo light />}
      {onToggleCollapsed && <button type="button" onClick={onToggleCollapsed} aria-label={collapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'} title={collapsed ? 'توسيع القائمة' : 'طي القائمة'} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        {collapsed ? <PanelRightOpen size={20} aria-hidden="true" /> : <PanelRightClose size={20} aria-hidden="true" />}
      </button>}
    </div>
  );
}

export default function Sidebar({ collapsed = false, onToggleCollapsed }) {
  const { selected, instructors } = useContext(InstructorContext);
  const { instructorId } = useParams();
  const { user, logout } = useAuth() || {};
  const role = user?.role || null;
  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const canGrade = role === 'admin' || role === 'teacher' || permissions.includes('can_grade_exams');
  const canCreateQuizzes = role === 'admin' || permissions.includes('can_create_quizzes');
  const canGenerateWalletCodes = role === 'admin' || permissions.includes('can_generate_wallet_codes');
  const canGenerateAccessCodes = role === 'admin' || permissions.includes('can_generate_access_codes');

  // Public pages use a tenant slug in the URL. Management pages must instead
  // use the authenticated owner's ObjectId, otherwise the backend correctly
  // rejects the request as an invalid or foreign instructor.
  const managedInstructorId = managedInstructorIdFor(user);
  const base = managedInstructorId || instructorId ? `/${managedInstructorId || instructorId}` : '';

  const InstructorsList = () => collapsed ? null : (
    <div className="mt-6 px-3 pb-2 pt-4 border-t border-white/10">
      <div className="text-xs font-medium text-white/50 mb-3">المدرسون المتاحون</div>
      <div className="flex flex-col gap-1.5">
        {instructors.slice(0, 4).map((ins) => (
          <NavLink
            key={ins.id || ins._id || ins.name}
            to={`/${ins.id || ins._id || ins.name}`}
            className="flex items-center gap-3 px-2 py-2 rounded-xl text-white/80 hover:bg-[var(--sidebar-bg-soft)] hover:text-white transition-colors duration-300"
          >
            <Avatar src={ins.avatar} name={ins.name} size="sm" />
            <div className="text-sm">{ins.name}</div>
          </NavLink>
        ))}
      </div>
    </div>
  );

  const LogoutLink = () => (
    <button
      type="button"
      onClick={logout}
      aria-label={collapsed ? 'تسجيل الخروج' : undefined}
      title={collapsed ? 'تسجيل الخروج' : undefined}
      className={`group mt-4 flex w-full items-center ${collapsed ? 'justify-center p-1' : 'gap-4 justify-start flex-row-reverse px-6 py-3'} text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors duration-300`}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-white transition-transform group-hover:-translate-x-1">
        <LogOut className="h-5 w-5" aria-hidden="true" />
      </span>
      {!collapsed && <span className="text-[15px] font-medium">تسجيل الخروج</span>}
    </button>
  );

  const Header = ({ avatarSrc, name, subtitle }) => collapsed ? null : (
    <div className="mb-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center gap-3">
        <Avatar src={avatarSrc} name={name} size="md" />
        <div className="min-w-0">
          <div className="truncate font-semibold text-white">{name}</div>
          <div className="truncate text-xs text-white/60">{subtitle}</div>
        </div>
      </div>
    </div>
  );

  // ---- ASSISTANT ----
  if (role === 'assistant') {
    return (
      <SidebarCollapseContext.Provider value={collapsed}><div className={`sidebar-scroll flex h-full max-h-[100dvh] flex-col overscroll-contain bg-[var(--sidebar-bg)] text-white overflow-y-auto ${collapsed ? 'px-1 py-4' : 'px-4 py-8'}`}>
        <BrandHeader collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} />
        <Header avatarSrc={user?.avatarUrl || user?.avatar || selected?.avatar} name={user?.name || selected?.name || 'مساعد'} subtitle="لوحة المساعد" />

        <nav className="flex-1 space-y-2">
          <Item to={`${base}/assistant/dashboard`} icon="dashboard">لوحة المساعد</Item>
          {canGrade && <Item to={`${base}/assistant/grade`} icon="assignmentGrading">تصحيح الواجبات</Item>}
          {/* Requirement #15: assistants have identical upload permissions to teachers */}
          <Item to={`${base}/admin/courses`} icon="upload">رفع محتوى تعليمي</Item>
          <Item to={`${base}/admin/reels`} icon="reels">رفع ريل</Item>
          {canCreateQuizzes && <Item to={`${base}/admin/quiz-builder`} icon="examBuilder">منشئ اختبارات المحاضرات</Item>}
          <Item to={`${base}/admin/standalone-exams`} icon="examManagement">امتحانات منفصلة</Item>
          <Item to={`${base}/assistant/messages`} icon="messages">رسائل أولياء الأمور</Item>
          <Item to={`${base}/students`} icon="students">الطلاب</Item>
          <Item to={`${base}/leaderboard`} icon="leaderboard">لوحة الشرف</Item>
          {(canGenerateWalletCodes || canGenerateAccessCodes) && <Item to={`${base}/admin/scratchcards`} icon="wallet">إدارة الأكواد</Item>}
          <Item to={`${base}/security`} icon="security">أمان الحساب</Item>
          <Item to={`${base}/admin/students/export`} icon="studentExport">تصدير الطلاب</Item>
        </nav>

        <InstructorsList />
        <div className="mt-auto border-t border-white/10 pt-2">
          <LogoutLink />
        </div>
      </div></SidebarCollapseContext.Provider>
    );
  }

  // ---- TEACHER / ADMIN ----
  if (role === 'admin' || role === 'teacher') {
    return (
      <SidebarCollapseContext.Provider value={collapsed}><div className={`sidebar-scroll flex h-full max-h-[100dvh] flex-col overscroll-contain bg-[var(--sidebar-bg)] text-white overflow-y-auto ${collapsed ? 'px-1 py-4' : 'px-4 py-8'}`}>
        <BrandHeader collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} />
        <Header avatarSrc={user?.avatarUrl || user?.avatar || selected?.avatar} name={user?.name || selected?.name || 'اختر مدرس'} subtitle={selected?.tagline || 'منصة تعليمية'} />

        <nav className="flex-1 space-y-2">
          <Item to={`${base}/admin/dashboard`} icon="dashboard">لوحة التحكم</Item>
          <Item to={`${base}/catalog`} icon="catalog">الكورسات</Item>

          <div className="pt-3 mt-3 border-t border-white/10">
            {!collapsed && <div className="text-xs font-medium text-white/50 px-3 mb-2">المساعِد</div>}
            <div className="space-y-2">
              <Item to={`${base}/assistant/dashboard`} icon="dashboard">لوحة المساعد</Item>
              {canGrade && <Item to={`${base}/assistant/grade`} icon="assignmentGrading">تصحيح الواجبات</Item>}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/10">
            {!collapsed && <div className="text-xs font-medium text-white/50 px-3 mb-2">الإدارة</div>}
            <div className="space-y-2">
              <Item to={`${base}/admin/courses`} icon="courseManagement">إدارة الكورسات</Item>
              <Item to={`${base}/admin/quiz-builder`} icon="examBuilder">منشئ الاختبارات</Item>
              {role === 'admin' && <Item to={`${base}/admin/standalone-exams`} icon="examManagement">امتحانات منفصلة</Item>}
              <Item to={`${base}/admin/scratchcards`} icon="wallet">أكواد الوصول</Item>
              <Item to={`${base}/students`} icon="students">الطلاب</Item>
              <Item to={`${base}/leaderboard`} icon="leaderboard">لوحة الشرف</Item>
              <Item to={`${base}/admin/students/export`} icon="studentExport">تصدير الطلاب</Item>
              <Item to={`${base}/admin/reels`} icon="reels">رفع مقطع سريع</Item>
              {role === 'admin' && <Item to={`${base}/admin/settings`} icon="settings">إعدادات المنصة</Item>}
              <Item to={`${base}/security`} icon="security">أمان الحساب</Item>
            </div>
          </div>

        </nav>

        <InstructorsList />
        <div className="mt-auto border-t border-white/10 pt-2">
          <LogoutLink />
        </div>
      </div></SidebarCollapseContext.Provider>
    );
  }

  // ---- STUDENT (default) ----
  return (
    <SidebarCollapseContext.Provider value={collapsed}><div className={`sidebar-scroll flex h-full max-h-[100dvh] flex-col overscroll-contain bg-[var(--sidebar-bg)] text-white overflow-y-auto ${collapsed ? 'px-1 py-4' : 'px-4 py-8'}`}>
      <BrandHeader collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} />
      <Header avatarSrc={user?.avatarUrl || user?.avatar || selected?.avatar} name={user?.name || 'طالب'} subtitle={selected?.name || 'منصة تعليمية'} />

      <nav className="flex-1 space-y-2">
        <Item to={`${base}/dashboard`} icon="dashboard" activeWhen={({ pathname, hash }) => pathname === `${base}/dashboard` && hash !== '#parent-access-code' && hash !== '#current-courses'}>لوحة التحكم</Item>
        <Item to={`${base}/catalog`} icon="catalog">الكورسات</Item>
        <Item to={`${base}/my-courses`} icon="myCourses">كورساتي</Item>
        <Item to={`${base}/wallet`} icon="wallet">محفظتي</Item>
        <Item to={`${base}/reels`} icon="reels">الريلز</Item>
        <Item to={`${base}/leaderboard`} icon="leaderboard">لوحة الشرف</Item>
        <Item to={`${base}/exam-grades`} icon="examResults">درجات الاختبارات</Item>
        <Item to={`${base}/assignment-grades`} icon="assignmentResults">درجات الواجبات</Item>
        <Item to={`${base}/dashboard#parent-access-code`} icon="parentCode" activeWhen={({ pathname, hash }) => pathname === `${base}/dashboard` && hash === '#parent-access-code'}>كود ربط ولي الأمر</Item>
      </nav>

      <InstructorsList />
      <div className="mt-auto border-t border-white/10 pt-2">
        <LogoutLink />
      </div>
    </div></SidebarCollapseContext.Provider>
  );
}
