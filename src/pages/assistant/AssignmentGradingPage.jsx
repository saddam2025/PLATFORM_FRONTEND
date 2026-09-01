// src/pages/assistant/AssignmentGradingPage.jsx
export const route = {
  path: '/:instructorId/assistant/grade/:assignmentId',
  index: false,
  auth: 'required',
  roles: ['assistant', 'admin', 'teacher'],
  title: 'تصحيح الواجب'
};

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// FIX: real hook file is src/hooks/useAuth.js — there is no src/contexts/AuthContext.jsx.
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString('ar-EG', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch {
    return iso;
  }
}

// Shared Tailwind classes for the textarea/select so they visually match
// the .input styling used by the Input component, using tokens that
// actually exist in tokens.css (bg-surface-default / border-surface-border /
// text-ink-900) instead of made-up CSS variable names.
const fieldClasses =
  'w-full resize-none rounded-md border border-surface-border bg-surface-default px-3 py-2 text-sm text-ink-900 outline-none focus:ring-2 focus:ring-brand-500';

export default function AssignmentGradingPage() {
  const { instructorId, assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const role = user?.role || null;
  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];

  // Permission guard: redirect assistants without can_grade_exams
  const lacksPermission = role === 'assistant' && !permissions.includes('can_grade_exams');
  useEffect(() => {
    if (lacksPermission) {
      navigate(`/${instructorId}/assistant/dashboard`, { replace: true });
    }
  }, [lacksPermission, instructorId, navigate]);

  // Mock assignment data (fallback)
  const assignment = useMemo(() => {
    return {
      id: assignmentId,
      studentName: 'محمد علي',
      courseTitle: 'أساسيات الجبر',
      fileUrl: '/mock/homework-sample.pdf',
      submissionNote: 'قمت بحل جميع التمارين المطلوبة.',
      submittedAt: '2026-07-16T10:00:00Z',
      status: 'pending',
      maxGrade: 100
    };
  }, [assignmentId]);

  const [grade, setGrade] = useState(assignment?.grade ?? '');
  const [feedback, setFeedback] = useState(assignment?.feedback ?? '');
  const [status, setStatus] = useState(assignment?.status ?? 'pending');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [successVisible, setSuccessVisible] = useState(false);

  const isPdf = assignment?.fileUrl?.toLowerCase?.().endsWith('.pdf');

  // This return must stay after all hooks so a permission change never
  // changes the component's hook order.
  if (lacksPermission) {
    return (
      <div className="p-6">
        <div className="rounded-2xl bg-surface-default shadow-card p-6 text-center">
          <p className="text-sm text-ink-500">جارِ التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // Small helper to map status -> Badge variant, so the header badge
  // uses the same visual language as AssistantDashboard's list.
  const statusBadgeVariant = status === 'graded' ? 'success' : status === 'resubmit' ? 'danger' : 'neutral';
  const statusLabel = status === 'pending' ? 'بانتظار' : status === 'graded' ? 'مصحح' : 'إعادة تسليم';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError(null);

    if (status === 'graded') {
      const n = Number(grade);
      if (grade === '' || Number.isNaN(n)) {
        setSaveError('الرجاء إدخال درجة صحيحة.');
        return;
      }
      if (assignment?.maxGrade && n > assignment.maxGrade) {
        setSaveError(`الدرجة لا يمكن أن تتجاوز ${assignment.maxGrade}.`);
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        grade: status === 'graded' ? Number(grade) : null,
        feedback,
        status,
        gradedBy: user?.id || user?._id || null
      };

      // Mock action: log payload (no real API call yet)
      // In production: await api.patch(`/assignments/${assignmentId}/grade`, payload)
      // eslint-disable-next-line no-console
      console.log('Grading payload:', payload);

      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);

      setTimeout(() => {
        navigate(`/${instructorId}/assistant/dashboard`);
      }, 900);
    } catch (err) {
      setSaveError(err?.message || 'فشل حفظ التقييم. حاول مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <h1 className="text-2xl font-semibold">{assignment.studentName}</h1>
              <p className="text-sm text-ink-500 mt-1">{assignment.courseTitle} — {formatDateTime(assignment.submittedAt)}</p>
            </div>
            <div>
              {/* FIX: badge now reflects the live `status` state (updates as the
                  assistant changes the dropdown below) instead of the frozen
                  assignment.status from the initial mock object. */}
              <Badge variant={statusBadgeVariant} className="text-sm">
                {statusLabel}
              </Badge>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File viewer & submission note */}
          <section className="rounded-2xl bg-surface-default shadow-card p-4">
            <h2 className="text-lg font-medium text-ink-900 mb-3">ملف الطالب</h2>

            {assignment.fileUrl ? (
              isPdf ? (
                <iframe src={assignment.fileUrl} className="w-full h-96 rounded-lg border border-surface-border" title="ملف الواجب" />
              ) : (
                <div className="flex items-center gap-3">
                  <a
                    href={assignment.fileUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-brand-500 text-ink-900 text-sm font-semibold"
                  >
                    تحميل الملف
                  </a>
                </div>
              )
            ) : (
              <p className="text-sm text-ink-500">لم يتم رفع ملف لهذا الواجب.</p>
            )}

            {assignment.submissionNote && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-ink-900 mb-2">ملاحظة الطالب</h3>
                <div className="rounded-md p-3 bg-surface-muted text-ink-700 text-sm">
                  {assignment.submissionNote}
                </div>
              </div>
            )}
          </section>

          {/* Grading form */}
          <section className="rounded-2xl bg-surface-default shadow-card p-4">
            <h2 className="text-lg font-medium text-ink-900 mb-3">نموذج التقييم</h2>

            {successVisible && (
              // FIX: text-success-600 isn't a defined token; success color only
              // exists as success-DEFAULT (see Badge.jsx's variantMap for the
              // same pattern).
              <div className="rounded-md p-3 bg-success-soft text-success-DEFAULT mb-3 text-sm">
                تم حفظ التقييم بنجاح.
              </div>
            )}

            {saveError && (
              // FIX: same issue — text-danger-600 -> text-danger-DEFAULT.
              <div className="rounded-md p-3 bg-danger-soft text-danger-DEFAULT mb-3 text-sm">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* FIX: Input.jsx has no `label` prop — wrapped with an explicit
                  <label>, matching the pattern used in RegisterForm.jsx. */}
              <div>
                <label htmlFor="grade" className="mb-1 block text-sm text-ink-500">الدرجة</label>
                <Input
                  id="grade"
                  name="grade"
                  type="number"
                  min={0}
                  max={assignment?.maxGrade ?? 100}
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="feedback" className="mb-1 block text-sm text-ink-500">ملاحظات المساعد</label>
                <textarea
                  id="feedback"
                  rows={6}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="اكتب ملاحظاتك للطالب..."
                  className={fieldClasses}
                />
              </div>

              <div>
                <label htmlFor="status" className="mb-1 block text-sm text-ink-500">الحالة</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={fieldClasses}
                >
                  <option value="pending">بانتظار</option>
                  <option value="graded">تم التصحيح</option>
                  <option value="resubmit">إعادة التسليم</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'جارِ الحفظ...' : 'حفظ التصحيح'}
                </Button>
                {/* FIX: Button.jsx only supports 'primary' | 'ghost' | 'subtle'.
                    'outline' isn't defined, so this rendered with no variant
                    styling at all. 'ghost' is the correct bordered/transparent match. */}
                <Button type="button" variant="ghost" onClick={() => navigate(`/${instructorId}/assistant/dashboard`)}>
                  إلغاء
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
