// src/pages/public/RegisterPage.jsx
// NOTE: No changes needed here — this file was already correct against the spec
// (uses InstructorContext for header, passes instructorId down to RegisterForm).
// Kept as-is; the bugs were all inside RegisterForm.jsx.
export const route = {
  path: '/:instructorId/register',
  index: false,
  auth: null,
  title: 'إنشاء حساب'
};

import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import RegisterForm from '../../components/forms/RegisterForm';
import { InstructorContext } from '../../contexts/InstructorContext';
import Avatar from '../../components/ui/Avatar';

export default function RegisterPage() {
  const { instructorId } = useParams();
  const { selected: instructor } = useContext(InstructorContext) || {};

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Promo panel */}
        <aside className="relative hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between" style={{ backgroundColor: 'var(--color-sidebar)' }}>
          <div className="pointer-events-none absolute inset-0 bg-geo-pattern-inverse" />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: 'var(--color-accent)' }}
          />

          <div className="relative z-10 flex items-center gap-3">
            <Avatar src={instructor?.avatar} name={instructor?.name || 'المدرس'} size="md" />
            <div className="text-right" style={{ color: 'var(--color-sidebar-ink)' }}>
              <div className="text-lg font-bold">{instructor?.name || 'رياضياتي'}</div>
              <div className="text-xs" style={{ color: 'var(--color-sidebar-ink-muted)' }}>منصة التعلّم الذكي</div>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <span
              className="inline-flex rounded-full px-4 py-1.5 text-xs font-semibold"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}
            >
              ابدأ رحلتك التعليمية
            </span>
            <h2 className="font-display text-3xl leading-snug text-balance" style={{ color: 'var(--color-sidebar-ink)' }}>
              تابع رحلتهم التعليمية
            </h2>
            <p className="max-w-md text-sm leading-relaxed" style={{ color: 'var(--color-sidebar-ink-muted)' }}>
              انضم إلى مجتمع التعلّم الذكي وتابع تقدمك خطوةً بخطوة مع أفضل المحتوى التعليمي المصمّم خصيصًا لك.
            </p>
          </div>

          <div className="relative z-10 flex gap-3">
            <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--color-sidebar-ink)' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-accent)' }}>
                <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-semibold">محتوى متكامل</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--color-sidebar-ink)' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-accent)' }}>
                <path d="M4 19V5M10 19v-8M16 19v-5M20 19V9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-semibold">تتبّع التقدّم</span>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-4 lg:hidden">
              <Avatar src={instructor?.avatar} name={instructor?.name || 'المدرس'} size="md" />
              <div className="text-right">
                <h1 className="text-xl font-bold text-ink-900">إنشاء حساب جديد</h1>
              </div>
            </div>

            <div className="mb-8 hidden text-right lg:block">
              <h1 className="font-display text-3xl font-bold text-ink-900">حساب جديد</h1>
              <p className="mt-2 text-sm text-ink-500">
                {instructor?.name ? `${instructor.name} — إنشاء حساب جديد` : 'انضم إلى مجتمع التعلّم الذكي وتابع تقدّمك'}
              </p>
            </div>

            <div className="rounded-3xl bg-surface-default p-6 shadow-card sm:p-8">
              <RegisterForm instructorId={instructorId} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
