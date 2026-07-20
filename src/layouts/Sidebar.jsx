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
import { NavLink, useParams } from 'react-router-dom';
import { InstructorContext } from '../contexts/InstructorContext';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../hooks/useAuth';

function Item({ to, icon, children }) {
  return (
    <NavLink to={to} className="group block">
      {({ isActive }) => (
        <span
          className={
            isActive
              ? `relative flex items-center gap-4 justify-start flex-row-reverse rounded-l-full
                 bg-surface-canvas text-[var(--sidebar-bg)] font-bold px-6 py-3 transition-transform duration-200
                 after:content-[''] after:absolute after:-top-8 after:right-0 after:h-8 after:w-8 after:bg-transparent after:rounded-br-full after:shadow-[8px_8px_0_8px_var(--surface-canvas)] after:pointer-events-none
                 before:content-[''] before:absolute before:-bottom-8 before:right-0 before:h-8 before:w-8 before:bg-transparent before:rounded-tr-full before:shadow-[8px_-8px_0_8px_var(--surface-canvas)] before:pointer-events-none`
              : `flex items-center gap-4 justify-start flex-row-reverse text-white/70 hover:text-white
                 hover:bg-[var(--sidebar-bg-soft)] rounded-xl px-6 py-3 transition-all duration-300`
          }
        >
          <span
            className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform"
            style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
          >
            {icon}
          </span>
          <span className="text-[15px]">{children}</span>
        </span>
      )}
    </NavLink>
  );
}

function BrandHeader() {
  return (
    <div className="mb-8 flex items-center gap-3 px-2">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-ink-900 text-xl font-extrabold shadow-pop">
        Σ
      </span>
      <div className="leading-tight">
        <div className="text-lg font-extrabold text-white">رياضياتي</div>
        <div className="text-xs text-white/60">منصة التعلم الذكي</div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { selected, instructors } = useContext(InstructorContext);
  const { instructorId } = useParams();
  const { user, logout } = useAuth() || {};
  const role = user?.role || null;
  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const canGrade = role === 'admin' || role === 'teacher' || permissions.includes('can_grade_exams');

  const base = instructorId ? `/${instructorId}` : '';

  const InstructorsList = () => (
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

  const ChangeInstructorButton = () => (
    <Button
      variant="ghost"
      size="sm"
      className="w-full !bg-white/10 !text-white !border-white/20 !shadow-none hover:!bg-white/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
    >
      تغيير المدرس
    </Button>
  );

  const LogoutLink = () => (
    <button
      type="button"
      onClick={logout}
      className="group mt-4 flex w-full items-center gap-4 justify-start flex-row-reverse text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors duration-300 px-6 py-3"
    >
      <span className="material-symbols-outlined text-[22px] group-hover:-translate-x-1 transition-transform">
        logout
      </span>
      <span className="text-[15px] font-medium">تسجيل الخروج</span>
    </button>
  );

  const Header = ({ avatarSrc, name, subtitle }) => (
    <div className="mb-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center gap-3">
        <Avatar src={avatarSrc} name={name} size="md" />
        <div className="min-w-0">
          <div className="truncate font-semibold text-white">{name}</div>
          <div className="truncate text-xs text-white/60">{subtitle}</div>
        </div>
      </div>
      <div className="mt-4">
        <ChangeInstructorButton />
      </div>
    </div>
  );

  // ---- ASSISTANT ----
  if (role === 'assistant') {
    return (
      <div className="flex flex-col h-full bg-[var(--sidebar-bg)] text-white px-4 py-8 overflow-y-auto">
        <BrandHeader />
        <Header avatarSrc={user?.avatar || selected?.avatar} name={user?.name || selected?.name || 'مساعد'} subtitle="لوحة المساعد" />

        <nav className="flex-1 space-y-2">
          <Item to={`${base}/assistant/dashboard`} icon="dashboard">لوحة المساعد</Item>
          {canGrade && <Item to={`${base}/assistant/grade/placeholder`} icon="assignment_turned_in">تصحيح الواجبات</Item>}
          {/* Requirement #15: assistants have identical upload permissions to teachers */}
          <Item to={`${base}/admin/courses`} icon="upload_file">رفع محتوى تعليمي</Item>
          <Item to={`${base}/admin/scratchcards`} icon="vpn_key">أكواد الوصول</Item>
        </nav>

        <InstructorsList />
        <div className="mt-auto border-t border-white/10 pt-2">
          <LogoutLink />
        </div>
      </div>
    );
  }

  // ---- TEACHER / ADMIN ----
  if (role === 'admin' || role === 'teacher') {
    return (
      <div className="flex flex-col h-full bg-[var(--sidebar-bg)] text-white px-4 py-8 overflow-y-auto">
        <BrandHeader />
        <Header avatarSrc={selected?.avatar} name={selected?.name || 'اختر مدرس'} subtitle={selected?.tagline || 'منصة الرياضيات'} />

        <nav className="flex-1 space-y-2">
          <Item to={`${base}/dashboard`} icon="dashboard">لوحة التحكم</Item>
          <Item to={`${base}/catalog`} icon="menu_book">الكورسات</Item>

          <div className="pt-3 mt-3 border-t border-white/10">
            <div className="text-xs font-medium text-white/50 px-3 mb-2">المساعِد</div>
            <div className="space-y-2">
              <Item to={`${base}/assistant/dashboard`} icon="dashboard">لوحة المساعد</Item>
              {canGrade && <Item to={`${base}/assistant/grade/placeholder`} icon="assignment_turned_in">تصحيح الواجبات</Item>}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/10">
            <div className="text-xs font-medium text-white/50 px-3 mb-2">الإدارة</div>
            <div className="space-y-2">
              <Item to={`${base}/admin`} icon="admin_panel_settings">لوحة المشرف</Item>
              <Item to={`${base}/admin/courses`} icon="menu_book">إدارة الكورسات</Item>
              <Item to={`${base}/admin/quiz-builder`} icon="quiz">منشئ الاختبارات</Item>
              <Item to={`${base}/admin/scratchcards`} icon="vpn_key">أكواد الوصول</Item>
              <Item to={`${base}/admin/settings`} icon="settings">إعدادات المنصة</Item>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/10">
            <div className="text-xs font-medium text-white/50 px-3 mb-2">أولياء الأمور</div>
            <div className="space-y-2">
              <Item to={`${base}/parent/dashboard`} icon="family_restroom">لوحة ولي الأمر</Item>
            </div>
          </div>
        </nav>

        <InstructorsList />
        <div className="mt-auto border-t border-white/10 pt-2">
          <LogoutLink />
        </div>
      </div>
    );
  }

  // ---- STUDENT (default) ----
  return (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] text-white px-4 py-8 overflow-y-auto">
      <BrandHeader />
      <Header avatarSrc={user?.avatar || selected?.avatar} name={user?.name || 'طالب'} subtitle={selected?.name || 'منصة الرياضيات'} />

      <nav className="flex-1 space-y-2">
        <Item to={`${base}/dashboard`} icon="dashboard">لوحة التحكم</Item>
        <Item to={`${base}/catalog`} icon="menu_book">الكورسات</Item>
        <Item to={`${base}/leaderboard`} icon="military_tech">لوحة الشرف</Item>
      </nav>

      <InstructorsList />
      <div className="mt-auto border-t border-white/10 pt-2">
        <LogoutLink />
      </div>
    </div>
  );
}
