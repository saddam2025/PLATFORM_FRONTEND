// src/pages/student/CourseDetailPage.jsx
export const route = {
  path: '/:instructorId/courses/:courseId',
  index: false,
  auth: null,
  title: 'تفاصيل الدورة',
};

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const MOCK_COURSE = {
  id: 'course-101',
  title_en: 'Algebra Fundamentals',
  title_ar: 'أساسيات الجبر',
  description_en: 'A comprehensive introduction to core algebra concepts.',
  description_ar: 'مقدمة شاملة لأهم مفاهيم الجبر الأساسية، تشمل المعادلات والمتباينات والدوال الخطية مع أمثلة تطبيقية.',
  price: 150,
  thumbnailUrl: null,
  syllabus: [
    'مقدمة في الجبر',
    'المعادلات من الدرجة الأولى',
    'المتباينات',
    'الدوال الخطية',
    'تطبيقات عملية ومراجعة',
  ],
  assignmentsCount: 5,
  quizzesCount: 5,
  accessPeriodDays: 10,
  maxViews: 10,
};

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-ink-400">
      <path
        d="M6 10V8a6 6 0 1112 0v2M5 10h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CourseDetailPage() {
  const { instructorId, courseId } = useParams();
  const navigate = useNavigate();

  // In production this would be fetched by courseId; using mock data for now.
  const course = { ...MOCK_COURSE, id: courseId || MOCK_COURSE.id };

  return (
    <div dir="rtl" className="space-y-6 pb-28">
      {/* Back link */}
      <button
        onClick={() => navigate(`/${instructorId}/courses`)}
        className="flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-ink-900"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        العودة إلى الدورات
      </button>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl shadow-card">
        <div className="h-64 w-full sm:h-72">
          <img
            src={course.thumbnailUrl || '/src/assets/vite.svg'}
            alt={course.title_ar}
            className="h-full w-full object-cover"
          />
        </div>
        {/* Readability overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/35 to-transparent" />

        {/* Price badge */}
        <div className="absolute right-6 top-6">
          <div className="rounded-2xl bg-accent px-5 py-3 text-center shadow-lg">
            <div className="text-[11px] font-medium text-accent-ink/70">سعر الدورة</div>
            <div className="text-xl font-bold text-accent-ink">{course.price} ج.م</div>
          </div>
        </div>

        {/* Title block */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-right">
          <span className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            دورة متقدمة
          </span>
          <h1 className="font-display text-3xl font-bold text-white text-balance">{course.title_ar}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
            {course.description_ar}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Access rules card */}
        <section className="rounded-2xl bg-surface-default p-6 shadow-card lg:col-span-1">
          <div className="flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/12 text-brand-600">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 9v4l2 2M9 2h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <h2 className="mt-4 text-center text-lg font-bold text-ink-900">شروط الوصول</h2>
          <div className="mt-4 space-y-2 text-center text-sm text-ink-600">
            <p>صلاحية المشاهدة: <span className="font-semibold text-ink-900">{course.accessPeriodDays} أيام</span></p>
            <p>الحد الأقصى: <span className="font-semibold text-ink-900">{course.maxViews} مرات</span></p>
          </div>
          {/* Preserve original access-rules copy via Badge */}
          <div className="mt-4 flex justify-center">
            <Badge variant="info">
              صلاحية المشاهدة: {course.accessPeriodDays} أيام | الحد الأقصى للمشاهدات: {course.maxViews} مرات
            </Badge>
          </div>
        </section>

        {/* About */}
        <section className="rounded-2xl bg-surface-default p-6 shadow-card lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-brand-600">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <h2 className="text-lg font-bold text-ink-900">عن الدورة</h2>
          </div>
          <p className="text-sm leading-relaxed text-ink-600">{course.description_ar}</p>
          <div className="mt-5 flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-ink-700">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M5 4h14v16l-7-3-7 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              {course.assignmentsCount} واجبات
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-ink-700">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              {course.quizzesCount} اختبارات
            </span>
          </div>
        </section>
      </div>

      {/* Syllabus */}
      <section className="rounded-2xl bg-surface-default p-6 shadow-card">
        <div className="mb-5 flex items-center gap-2">
          <span className="text-brand-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M4 5h16M4 12h16M4 19h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <h2 className="text-lg font-bold text-ink-900">محتوى الدورة</h2>
        </div>
        <ol className="space-y-3">
          {course.syllabus.map((lesson, idx) => (
            <li
              key={idx}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 transition-colors ${
                idx === 0
                  ? 'border-accent/40 bg-accent/8'
                  : 'border-surface-border bg-surface-muted/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    idx === 0 ? 'bg-accent text-accent-ink' : 'bg-surface-default text-ink-500'
                  }`}
                >
                  {idx + 1}
                </span>
                <div>
                  <span className="block text-sm font-semibold text-ink-800">{lesson}</span>
                  {idx === 0 && <span className="text-xs text-ink-500">متاح للمعاينة</span>}
                </div>
              </div>
              {idx === 0 ? (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/12 text-brand-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              ) : (
                <LockIcon />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-10 border-t border-surface-border bg-surface-default/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="text-sm text-ink-500">
            إجمالي السعر: <span className="text-lg font-bold text-ink-900">{course.price} ج.م</span>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/${instructorId}/checkout/${courseId}`)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M6 6h15l-1.5 9h-12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" />
              <circle cx="18" cy="20" r="1.4" fill="currentColor" />
            </svg>
            شراء الدورة
          </Button>
        </div>
      </div>
    </div>
  );
}
