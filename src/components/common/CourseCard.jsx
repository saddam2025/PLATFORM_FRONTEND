// src/components/common/CourseCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

export default function CourseCard({
  course,
  onOpen,
  onEnroll,
  price,
  openLabel = 'عرض',
  enrollLabel = 'اشترك',
}) {
  const displayPrice = price ?? course.price;

  return (
    <article className="rounded-[var(--radius-lg)] border border-surface-border bg-surface-default p-4 shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-soft overflow-hidden animate-fadeIn">
      <div className="flex items-start gap-4">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl bg-surface-muted">
          <img
            src={course.image || '/src/assets/vite.svg'}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-ink-900 truncate">{course.title}</h3>
              <p className="text-sm text-ink-500 mt-2 line-clamp-2">{course.subtitle}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {displayPrice != null && <Badge variant="brand">{displayPrice} ج.م</Badge>}
              {course.level && <Badge variant={course.levelVariant || 'info'}>{course.level}</Badge>}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar src={course.instructor?.avatar} name={course.instructor?.name} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-900 truncate">{course.instructor?.name || 'مدرس غير معروف'}</p>
                <p className="text-xs text-ink-500 truncate">{course.lessonsCount ?? 0} دروس · {course.tasksCount ?? 0} واجبات</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-start gap-2">
              <Button variant="ghost" size="sm" onClick={() => onOpen?.(course)}>
                {openLabel}
              </Button>
              <Button variant="primary" size="sm" onClick={() => onEnroll?.(course)}>
                {enrollLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.number,
    level: PropTypes.string,
    levelVariant: PropTypes.oneOf(['info', 'success', 'danger', 'brand']),
    instructor: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
    lessonsCount: PropTypes.number,
    tasksCount: PropTypes.number,
  }).isRequired,
  onOpen: PropTypes.func,
  onEnroll: PropTypes.func,
  price: PropTypes.number,
  openLabel: PropTypes.string,
  enrollLabel: PropTypes.string,
};