import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import { resolveApiAssetUrl } from '../../services/api';

function formatDate(value) {
  if (!value) return 'غير محدد';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'غير محدد' : date.toLocaleDateString('ar-EG');
}

export default function MyCourseCard({ enrollment, instructorId, tenant }) {
  const { course } = enrollment;
  const title = course.title_ar || course.title_en || 'كورس';
  const thumbnail = resolveApiAssetUrl(course.thumbnailUrl);
  const views = enrollment.viewsRemaining == null ? 'غير محدودة' : enrollment.viewsRemaining;

  return (
    <Link to={`/${instructorId}/courses/${course._id}`} className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
      <article dir="rtl" className="h-full overflow-hidden rounded-2xl border border-surface-border bg-surface-default text-ink-900 shadow-card transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-panel dark:border-white/10 dark:bg-[#071426] dark:text-white">
        <div className="aspect-video overflow-hidden bg-surface-muted">
          {thumbnail ? <img src={thumbnail} alt={`صورة ${title}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" /> : <div className="grid h-full place-items-center text-3xl" aria-label="لا توجد صورة للكورس">📚</div>}
        </div>
        <div className="p-3 sm:p-4">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar src={tenant?.logoUrl || tenant?.avatar} name={tenant?.name || 'المنصة'} size="xs" />
            <span className="truncate text-xs font-semibold text-ink-500 dark:text-slate-300">{tenant?.name || 'المنصة التعليمية'}</span>
          </div>
          <h3 className="mt-2 min-h-12 line-clamp-2 text-sm font-extrabold leading-6 text-ink-900 dark:text-white">{title}</h3>
          <div className="mt-2 space-y-1 text-xs text-ink-500 dark:text-slate-300">
            <p>ينتهي الاشتراك: <time dateTime={enrollment.expiresAt}>{formatDate(enrollment.expiresAt)}</time></p>
            <p>المشاهدات المتاحة: {views}</p>
          </div>
          <span className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-3 py-2 text-sm font-bold text-white transition group-hover:bg-brand-700">ادخل الكورس</span>
        </div>
      </article>
    </Link>
  );
}
