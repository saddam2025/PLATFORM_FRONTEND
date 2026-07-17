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
    <article className="card p-4 flex gap-4 items-start animate-fadeIn">
      <div className="w-20 h-20 flex-shrink-0">
        <img
          src={course.image || '/src/assets/vite.svg'}
          alt={course.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold truncate">{course.title}</h3>
            <p className="text-sm text-ink-500 truncate mt-1">{course.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            {displayPrice != null && (
              <Badge variant="brand">{displayPrice} ج.م</Badge>
            )}
            {course.level && <Badge variant={course.levelVariant || 'info'}>{course.level}</Badge>}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar src={course.instructor?.avatar} name={course.instructor?.name} size="sm" />
            <div className="text-sm">
              <div className="font-medium">{course.instructor?.name || 'مدرس غير معروف'}</div>
              <div className="text-ink-500 text-xs">{course.lessonsCount ?? 0} درس · {course.tasksCount ?? 0} واجبات</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onOpen?.(course)}>
              {openLabel}
            </Button>
            <Button variant="primary" size="sm" onClick={() => onEnroll?.(course)}>
              {enrollLabel}
            </Button>
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