import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

export default function CourseCard({ course, onOpen, onEnroll, price, openLabel = 'عرض التفاصيل', enrollLabel = 'اشترك الآن' }) {
  const displayPrice = price ?? course.price;
  const thumbnailUrl = course.image || course.thumbnailUrl;
  return <article className="group overflow-hidden rounded-[var(--radius-lg)] border border-surface-border bg-surface-default shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft animate-fadeIn">
    <div className="relative h-44 overflow-hidden bg-gradient-to-bl from-brand-100 via-brand-50 to-surface-muted">
      {thumbnailUrl ? <img src={thumbnailUrl} alt={course.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-4xl" aria-hidden="true">📚</div>}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/35 to-transparent" />
      <div className="absolute left-4 top-4">{displayPrice != null && <Badge variant="brand">{displayPrice === 0 ? 'مجاني' : `${displayPrice} ج.م`}</Badge>}</div>
      {course.level && <div className="absolute right-4 top-4"><Badge variant={course.levelVariant || 'info'}>{course.level}</Badge></div>}
    </div>
    <div className="p-5">
      <h3 className="truncate text-lg font-extrabold text-ink-900">{course.title}</h3>
      <p className="mt-2 min-h-10 text-sm leading-5 text-ink-600 line-clamp-2">{course.subtitle || 'شرح مبسط وتدريبات تساعدك على إتقان المادة.'}</p>
      <div className="my-4 flex items-center gap-3 border-y border-surface-border py-3">
        <Avatar src={course.instructor?.avatar} name={course.instructor?.name} size="sm" />
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-ink-800">{course.instructor?.name || 'فريق المنصة'}</p><p className="text-xs text-ink-500">{course.lessonsCount ?? 0} درس · {course.tasksCount ?? 0} واجبات</p></div>
      </div>
      <div className="flex gap-2"><Button variant="ghost" size="sm" className="flex-1" onClick={() => onOpen?.(course)}>{openLabel}</Button><Button variant="primary" size="sm" className="flex-1" onClick={() => onEnroll?.(course)}>{enrollLabel}</Button></div>
    </div>
  </article>;
}

CourseCard.propTypes = { course: PropTypes.shape({ title: PropTypes.string, subtitle: PropTypes.string, image: PropTypes.string, thumbnailUrl: PropTypes.string, price: PropTypes.number, level: PropTypes.string, levelVariant: PropTypes.oneOf(['info', 'success', 'danger', 'brand']), instructor: PropTypes.shape({ name: PropTypes.string, avatar: PropTypes.string }), lessonsCount: PropTypes.number, tasksCount: PropTypes.number }).isRequired, onOpen: PropTypes.func, onEnroll: PropTypes.func, price: PropTypes.number, openLabel: PropTypes.string, enrollLabel: PropTypes.string };
