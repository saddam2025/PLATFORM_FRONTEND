export const route = {
  path: '/:instructorId/my-courses',
  index: false,
  auth: 'required',
  roles: ['student'],
  title: 'كورساتي',
};

import React from 'react';
import { useParams } from 'react-router-dom';
import MyCourseCard from '../../components/common/MyCourseCard';
import useEnrolledCourses from '../../hooks/useEnrolledCourses';

export default function MyCoursesPage() {
  const { instructorId } = useParams();
  const { courses, tenant, loading, error } = useEnrolledCourses(instructorId);

  return (
    <div dir="rtl" className="space-y-6">
      <header>
        <div><p className="text-sm font-semibold text-brand-600">تعلمك مستمر</p><h1 className="mt-1 text-2xl font-extrabold text-ink-900">كورساتي</h1></div>
      </header>
      {loading && <div className="rounded-2xl bg-surface-default p-6 text-center text-sm text-ink-500">جارٍ تحميل كورساتي...</div>}
      {error && <div role="alert" className="rounded-2xl bg-danger-soft p-5 text-center text-sm text-danger-DEFAULT">{error}</div>}
      {!loading && !error && courses.length === 0 && <div className="rounded-2xl bg-surface-default p-8 text-center text-sm text-ink-500">لا توجد كورسات في قائمتك حتى الآن.</div>}
      {!loading && !error && courses.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4">{courses.map((enrollment) => <MyCourseCard key={enrollment.course._id} enrollment={enrollment} instructorId={instructorId} tenant={tenant} />)}</div>}
    </div>
  );
}
