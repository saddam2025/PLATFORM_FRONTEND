export const route = {
  path: '/:instructorId/students/:studentId',
  index: false,
  auth: 'required',
  roles: ['admin', 'assistant'],
  title: 'بيانات الطالب'
};

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { stageLabel } from '../../constants/stages';

function date(value) {
  return value ? new Date(value).toLocaleDateString('ar-EG') : 'غير متاح';
}

export default function StudentDetailPage() {
  const { instructorId, studentId } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get(`/instructors/${instructorId}/students/${studentId}`)
      .then((response) => { if (active) setDetail(response?.data?.data || null); })
      .catch((requestError) => { if (active) setError(requestError?.message || 'تعذر تحميل بيانات الطالب.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [instructorId, studentId]);

  if (loading) return <div dir="rtl" className="rounded-2xl bg-surface-default p-6 text-center text-ink-500 shadow-card">جارٍ تحميل بيانات الطالب...</div>;
  if (error || !detail?.student) return <div dir="rtl" role="alert" className="rounded-2xl bg-danger-soft p-6 text-center text-danger-DEFAULT">{error || 'الطالب غير موجود.'}</div>;
  const { student, lectureAccess = [], courseEnrollments = [] } = detail;

  return <div dir="rtl" className="mx-auto max-w-5xl space-y-6">
    <Link to={`/${instructorId}/students`}><Button variant="subtle" size="sm">العودة إلى الطلاب</Button></Link>
    <section className="rounded-2xl bg-surface-default p-6 shadow-card"><div className="flex items-center gap-4"><Avatar src={student.avatarUrl} name={student.name} size="lg" /><div><h1 className="text-2xl font-bold text-ink-900">{student.name}</h1><p className="text-sm text-ink-500">مسجل منذ {date(student.registeredAt)}</p></div></div><dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-ink-500">البريد الإلكتروني</dt><dd className="mt-1 font-medium">{student.email || 'غير متاح'}</dd></div><div><dt className="text-ink-500">هاتف الطالب</dt><dd className="mt-1 font-medium">{student.phone || 'غير متاح'}</dd></div><div><dt className="text-ink-500">هاتف الأب</dt><dd className="mt-1 font-medium">{student.fatherPhone || 'غير متاح'}</dd></div><div><dt className="text-ink-500">هاتف الأم</dt><dd className="mt-1 font-medium">{student.motherPhone || 'غير متاح'}</dd></div><div><dt className="text-ink-500">المرحلة</dt><dd className="mt-1 font-medium">{student.stage ? stageLabel(student.stage) : 'غير متاح'}</dd></div><div><dt className="text-ink-500">الشعبة</dt><dd className="mt-1 font-medium">{student.track || 'غير متاح'}</dd></div></dl></section>
    <section className="rounded-2xl bg-surface-default p-6 shadow-card"><h2 className="text-lg font-bold">المحاضرات المشتراة</h2><div className="mt-4 space-y-3">{lectureAccess.map((access) => <article key={access.id} className="rounded-xl bg-surface-muted p-4"><p className="font-medium">{access.lectureTitle || access.courseTitle || 'العنصر المرتبط غير متاح'}</p><p className="mt-1 text-sm text-ink-500">تاريخ الشراء: {date(access.purchasedAt)} · ينتهي: {date(access.expiresAt)}</p><p className="mt-1 text-sm text-ink-500">المشاهدات: {access.viewsUsed} / {access.maxViews}</p></article>)}{lectureAccess.length === 0 && <p className="text-ink-500">لا توجد محاضرات مشتراة.</p>}</div></section>
    <section className="rounded-2xl bg-surface-default p-6 shadow-card"><h2 className="text-lg font-bold">الكورسات المسجل بها</h2><div className="mt-4 space-y-3">{courseEnrollments.map((enrollment) => <article key={enrollment.id} className="rounded-xl bg-surface-muted p-4"><p className="font-medium">{enrollment.courseTitle || 'الكورس غير متاح'}</p><p className="mt-1 text-sm text-ink-500">تاريخ الاشتراك: {date(enrollment.purchasedAt)} · ينتهي: {date(enrollment.expiresAt)}</p></article>)}{courseEnrollments.length === 0 && <p className="text-ink-500">لا توجد كورسات مسجل بها.</p>}</div></section>
  </div>;
}
