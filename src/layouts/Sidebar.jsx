// src/layouts/Sidebar.jsx
//
// VISUAL REDESIGN: "Emerald Green & Crisp White" theme.
// All existing logic is preserved exactly — InstructorContext, useParams,
// useAuth, role-gated nav sections (student/assistant/admin/parent), and the
// instructor-switcher list. Only styling changed.
//
// New colors are scoped locally via CSS custom properties set through React's
// inline `style` prop on the root wrapper (see SIDEBAR_THEME_VARS below),
// rather than editing tailwind.config.cjs or tokens.css — keeps this
// redesign fully contained to this file.
//
// RTL CORRECTION: the requested cutout pattern assumes an LTR sidebar (on
// the left, content to its right) — rounded-l-2xl + right-0 pseudo-elements.
// This app is RTL (index.css sets dir="rtl"), and Layouts.jsx puts this
// <aside> first in a flex row, so under RTL the sidebar visually renders on
// the RIGHT with content to its LEFT (confirmed by index.css's own
// `.sidebar { border-left: ... }`, which only makes sense as the
// content-facing edge). Every left/right-directional utility below is
// mirrored (rounded-r-2xl, left-0, rounded-bl/rounded-tl) so the curve
// actually meets the real content-panel edge.
//
// EDGE-BLEED: `.sidebar` in index.css has padding: 1.25rem (20px). The
// wrapper below cancels that with -m-5 and restores it with p-5, so the
// emerald background fills the <aside> flush to its true edges (required
// for the cutout illusion to read as "connected to the content panel"
// rather than floating inside a padded gap). The active Item then punches
// back out through that same 20px via -ml-5 / w-[calc(100%+1.25rem)] so its
// cutout notches land exactly on that true edge.

import React, { useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { InstructorContext } from '../contexts/InstructorContext';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../hooks/useAuth';

// Local-only theme tokens. --surface-default is NOT redefined here — it's
// the existing global token from tokens.css, which already flips between
// white and near-black automatically when html.dark is toggled. Referencing
// it (instead of a hardcoded #ffffff) is what makes the cutout's
// "punch-through" illusion survive dark mode with zero extra work.
const SIDEBAR_THEME_VARS = {
  '--surface-sidebar': '#0B3D2E',       // deep emerald — sidebar bg + active-item text
  '--surface-sidebar-soft': '#0F4D3A',  // lighter emerald — hover state
};

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? `relative flex items-center -ml-5 w-[calc(100%+1.25rem)] px-5 py-2.5
             text-sm font-semibold rounded-r-2xl
             bg-[var(--surface-default)] text-[var(--surface-sidebar)]
             before:content-[''] before:absolute before:left-0 before:top-[-20px] before:w-[20px] before:h-[20px] before:rounded-bl-[20px] before:shadow-[0_20px_0_0_var(--surface-default)] before:pointer-events-none
             after:content-[''] after:absolute after:left-0 after:bottom-[-20px] after:w-[20px] after:h-[20px] after:rounded-tl-[20px] after:shadow-[0_-20px_0_0_var(--surface-default)] after:pointer-events-none`
          : `block px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-[var(--surface-sidebar-soft)] hover:text-white transition-colors`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Sidebar() {
  const { selected, instructors } = useContext(InstructorContext);
  const { instructorId } = useParams();
  const { user } = useAuth() || {};
  const role = user?.role || null;
  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const canGrade = role === 'admin' || role === 'teacher' || permissions.includes('can_grade_exams');

  const base = instructorId ? `/${instructorId}` : '';

  const InstructorsList = () => (
    <div className="mt-6 px-3 pb-2 pt-4 border-t border-white/10">
      <div className="text-xs text-white/50 mb-2">المدرسون المتاحون</div>
      <div className="flex flex-col gap-2">
        {instructors.slice(0, 4).map((ins) => (
          <NavLink
            key={ins.id || ins._id || ins.name}
            to={`/${ins.id || ins._id || ins.name}`}
            className="flex items-center gap-3 px-2 py-2 rounded-lg text-white/80 hover:bg-[var(--surface-sidebar-soft)] hover:text-white transition-colors"
          >
            <Avatar src={ins.avatar} name={ins.name} size="sm" />
            <div className="text-sm">{ins.name}</div>
          </NavLink>
        ))}
      </div>
    </div>
  );

  // Button.jsx's "ghost" variant is tuned for light backgrounds (transparent
  // bg, dark border/text) and would be nearly invisible on the dark emerald
  // sidebar. Rather than edit Button.jsx (used elsewhere with that
  // assumption), the override classes use Tailwind's `!` important modifier
  // so they reliably win regardless of Tailwind's generated CSS source
  // order, which appending a plain className can't guarantee.
  const ChangeInstructorButton = () => (
    <Button
      variant="ghost"
      size="sm"
      className="w-full !bg-white/10 !text-white !border-white/20 hover:!bg-white/20"
    >
      تغيير المدرس
    </Button>
  );

  // ---- ASSISTANT ----
  if (role === 'assistant') {
    return (
      <div
        className="flex flex-col h-full -m-5 p-5 overflow-visible bg-[var(--surface-sidebar)] text-white"
        style={SIDEBAR_THEME_VARS}
      >
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar || selected?.avatar} name={user?.name || selected?.name || 'مساعد'} size="md" />
            <div>
              <div className="font-semibold text-white">{user?.name || selected?.name || 'المساعد'}</div>
              <div className="text-xs text-white/60">لوحة المساعد</div>
            </div>
          </div>
          <div className="mt-4">
            <ChangeInstructorButton />
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="pt-1">
            <div className="text-xs text-white/50 px-3 mb-2">المساعِد</div>
            <div className="space-y-2">
              <Item to={`${base}/assistant/dashboard`}>لوحة المساعد</Item>
              {canGrade && <Item to={`${base}/assistant/grade/placeholder`}>تصحيح الواجبات</Item>}
              {/* Requirement #15: assistants have identical upload permissions to teachers */}
              <Item to={`${base}/admin/courses`}>رفع محتوى تعليمي</Item>
              <Item to={`${base}/admin/scratchcards`}>أكواد الوصول</Item>
            </div>
          </div>
        </nav>

        <InstructorsList />
      </div>
    );
  }

  // ---- TEACHER / ADMIN ----
  if (role === 'admin' || role === 'teacher') {
    return (
      <div
        className="flex flex-col h-full -m-5 p-5 overflow-visible bg-[var(--surface-sidebar)] text-white"
        style={SIDEBAR_THEME_VARS}
      >
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Avatar src={selected?.avatar} name={selected?.name || 'مدرس'} size="md" />
            <div>
              <div className="font-semibold text-white">{selected?.name || 'اختر مدرس'}</div>
              <div className="text-xs text-white/60">{selected?.tagline || 'منصة الرياضيات'}</div>
            </div>
          </div>
          <div className="mt-4">
            <ChangeInstructorButton />
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="space-y-2">
            <Item to={`${base}/dashboard`}>لوحة التحكم</Item>
            <Item to={`${base}/catalog`}>الكورسات</Item>
          </div>

          <div className="pt-3 mt-3 border-t border-white/10">
            <div className="text-xs text-white/50 px-3 mb-2">المساعِد</div>
            <div className="space-y-2">
              <Item to={`${base}/assistant/dashboard`}>لوحة المساعد</Item>
              {canGrade && <Item to={`${base}/assistant/grade/placeholder`}>تصحيح الواجبات</Item>}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/10">
            <div className="text-xs text-white/50 px-3 mb-2">الإدارة</div>
            <div className="space-y-2">
              <Item to={`${base}/admin`}>لوحة المشرف</Item>
              <Item to={`${base}/admin/courses`}>إدارة الكورسات</Item>
              <Item to={`${base}/admin/quiz-builder`}>منشئ الاختبارات</Item>
              <Item to={`${base}/admin/scratchcards`}>أكواد الوصول</Item>
              <Item to={`${base}/admin/settings`}>إعدادات المنصة</Item>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/10">
            <div className="text-xs text-white/50 px-3 mb-2">أولياء الأمور</div>
            <div className="space-y-2">
              <Item to={`${base}/parent/dashboard`}>لوحة ولي الأمر</Item>
            </div>
          </div>
        </nav>

        <InstructorsList />
      </div>
    );
  }

  // ---- STUDENT (default) ----
  return (
    <div
      className="flex flex-col h-full -m-5 p-5 overflow-visible bg-[var(--surface-sidebar)] text-white"
      style={SIDEBAR_THEME_VARS}
    >
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatar || selected?.avatar} name={user?.name || 'طالب'} size="md" />
          <div>
            <div className="font-semibold text-white">{user?.name || 'طالب'}</div>
            <div className="text-xs text-white/60">{selected?.name || 'منصة الرياضيات'}</div>
          </div>
        </div>
        <div className="mt-4">
          <ChangeInstructorButton />
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <Item to={`${base}/dashboard`}>لوحة التحكم</Item>
        <Item to={`${base}/catalog`}>الكورسات</Item>
        <Item to={`${base}/leaderboard`}>لوحة الشرف</Item>
      </nav>

      <InstructorsList />
    </div>
  );
}