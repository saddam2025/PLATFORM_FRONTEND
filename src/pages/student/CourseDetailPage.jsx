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
    <div dir="rtl" className="space-y-6 pb-24">
      {/* Hero */}
      <section className="bg-surface-default rounded-2xl shadow-card overflow-hidden">
        <div className="w-full h-56 bg-surface-muted">
          <img
            src={course.thumbnailUrl || '/src/assets/vite.svg'}
            alt={course.title_ar}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-ink-900">{course.title_ar}</h1>
          <Badge variant="brand">{course.price} ج.م</Badge>
        </div>
      </section>

      {/* Description */}
      <section className="bg-surface-default rounded-2xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-2">نبذة عن الدورة</h2>
        <p className="text-sm text-ink-600 leading-relaxed">{course.description_ar}</p>
        <div className="flex items-center gap-4 mt-4 text-xs text-ink-500">
          <span>{course.assignmentsCount} واجبات</span>
          <span>{course.quizzesCount} اختبارات</span>
        </div>
      </section>

      {/* Syllabus */}
      <section className="bg-surface-default rounded-2xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">محتوى الدورة</h2>
        <ol className="space-y-2">
          {course.syllabus.map((lesson, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-muted"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-surface-default text-xs font-medium text-ink-700">
                  {idx + 1}
                </span>
                <span className="text-sm text-ink-800">{lesson}</span>
              </div>
              {idx !== 0 && <LockIcon />}
            </li>
          ))}
        </ol>
      </section>

      {/* Access rules */}
      <section className="bg-surface-default rounded-2xl shadow-card p-6">
        <Badge variant="info">
          صلاحية المشاهدة: {course.accessPeriodDays} أيام | الحد الأقصى للمشاهدات: {course.maxViews} مرات
        </Badge>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-surface-default border-t border-surface-border p-4 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="text-sm text-ink-500">
            السعر: <span className="font-semibold text-ink-900">{course.price} ج.م</span>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/${instructorId}/checkout/${courseId}`)}
          >
            شراء الدورة
          </Button>
        </div>
      </div>
    </div>
  );
}