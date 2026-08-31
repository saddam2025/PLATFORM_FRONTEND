// src/pages/assistant/AssistantDashboard.jsx
export const route = {
  path: '/:instructorId/assistant/dashboard',
  index: false,
  auth: 'required',
  roles: ['assistant', 'admin', 'teacher'],
  title: 'لوحة المساعد'
};

import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
// FIX: real hook file is src/hooks/useAuth.js — there is no src/contexts/AuthContext.jsx.
// The context itself is defined/exported inside AuthProvider.jsx.
import { useAuth } from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';

const assignmentsMock = [
  { id: 'a1', studentName: 'محمد علي', courseTitle: 'أساسيات الجبر', submittedAt: '2026-07-16T10:00:00Z', status: 'pending' },
  { id: 'a2', studentName: 'سارة أحمد', courseTitle: 'الهندسة', submittedAt: '2026-07-15T14:00:00Z', status: 'graded', grade: 88 },
  { id: 'a3', studentName: 'علي محمود', courseTitle: 'التفاضل والتكامل', submittedAt: '2026-07-14T09:30:00Z', status: 'resubmit' },
  { id: 'a4', studentName: 'هند سمير', courseTitle: 'الفيزياء', submittedAt: '2026-07-16T12:45:00Z', status: 'pending' },
  { id: 'a5', studentName: 'رامي فؤاد', courseTitle: 'الكيمياء', submittedAt: '2026-07-13T16:20:00Z', status: 'graded', grade: 75 },
  { id: 'a6', studentName: 'دينا يوسف', courseTitle: 'الإحصاء', submittedAt: '2026-07-12T11:10:00Z', status: 'pending' }
];

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('ar-EG', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch {
    return iso;
  }
}

export default function AssistantDashboard() {
  const { instructorId } = useParams();
  const { user } = useAuth() || {};
  const role = user?.role || null;
  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const canGrade = role === 'admin' || permissions.includes('can_grade_exams');

  const stats = useMemo(() => {
    const pending = assignmentsMock.filter((a) => a.status === 'pending').length;
    const graded = assignmentsMock.filter((a) => a.status === 'graded').length;
    const resubmit = assignmentsMock.filter((a) => a.status === 'resubmit').length;
    return { pending, graded, resubmit };
  }, []);

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-right">
              <h1 className="text-2xl font-semibold">مرحباً {user?.name || 'المساعد'}</h1>
              <p className="text-sm text-ink-500 mt-1">لوحة تصحيح الواجبات</p>
            </div>
            <div>
              <Avatar name={user?.name || 'المساعد'} src={user?.avatarUrl || user?.avatar} size="md" />
            </div>
          </div>
        </header>

        {/* Permission guard — assistants without can_grade_exams (and non-admins)
            never see the grading queue at all, just this disabled-state card. */}
        {!canGrade ? (
          <div className="rounded-2xl bg-surface-muted p-8 text-center">
            <div className="mb-4">
              <svg className="mx-auto w-12 h-12 text-ink-500" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 8v10a2 2 0 002 2h8a2 2 0 002-2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="8" y="10" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-ink-900">ليس لديك صلاحية تصحيح الواجبات</div>
            <div className="mt-2 text-sm text-ink-500">تواصل مع المدرس لطلب تفعيل صلاحية تصحيح الواجبات.</div>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-2xl bg-surface-default shadow-card p-4">
                <p className="text-xs text-ink-500">الواجبات المعلقة</p>
                <p className="mt-2 text-2xl font-semibold text-ink-900">{stats.pending}</p>
              </div>
              <div className="rounded-2xl bg-surface-default shadow-card p-4">
                <p className="text-xs text-ink-500">تم تصحيحها</p>
                <p className="mt-2 text-2xl font-semibold text-ink-900">{stats.graded}</p>
              </div>
              <div className="rounded-2xl bg-surface-default shadow-card p-4">
                <p className="text-xs text-ink-500">تحتاج إعادة تسليم</p>
                <p className="mt-2 text-2xl font-semibold text-ink-900">{stats.resubmit}</p>
              </div>
            </section>

            {/* Assignments list */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-ink-900">قائمة الواجبات</h2>

              <div className="space-y-3">
                {assignmentsMock.map((a) => (
                  <div key={a.id} className="rounded-2xl bg-surface-default shadow-card p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-ink-900">{a.studentName}</div>
                        <div className="text-xs text-ink-500">{a.courseTitle}</div>
                        <div className="text-xs text-ink-500 mt-1">{formatDate(a.submittedAt)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        {a.status === 'pending' && <Badge className="text-xs">بانتظار التصحيح</Badge>}
                        {a.status === 'graded' && <Badge variant="success" className="text-xs">تم التصحيح</Badge>}
                        {a.status === 'resubmit' && <Badge variant="danger" className="text-xs">إعادة تسليم</Badge>}
                      </div>

                      {typeof a.grade !== 'undefined' && (
                        <div className="text-sm text-ink-700">الدرجة: <span className="font-semibold">{a.grade}</span></div>
                      )}

                      {a.status === 'pending' ? (
                        <Link to={`/${instructorId}/assistant/grade/${a.id}`}>
                          <Button variant="primary" size="sm">تصحيح</Button>
                        </Link>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => { /* view details */ }}>عرض</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
