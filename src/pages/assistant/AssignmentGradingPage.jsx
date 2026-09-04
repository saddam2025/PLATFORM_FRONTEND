export const route = {
  path: '/:instructorId/assistant/grade/:assignmentId?',
  index: false,
  auth: 'required',
  roles: ['assistant', 'admin', 'teacher'],
  title: 'تصحيح الواجب',
};

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api, { resolveApiAssetUrl } from '../../services/api';

const fieldClasses = 'w-full resize-none rounded-md border border-surface-border bg-surface-default px-3 py-2 text-sm text-ink-900 outline-none focus:ring-2 focus:ring-brand-500';
const formatDateTime = (iso) => new Date(iso).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });

export default function AssignmentGradingPage() {
  const { instructorId, assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const lacksPermission = user?.role === 'assistant' && !user?.permissions?.includes('can_grade_exams');
  const [queue, setQueue] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('graded');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (lacksPermission) navigate(`/${instructorId}/assistant/dashboard`, { replace: true });
  }, [instructorId, lacksPermission, navigate]);

  useEffect(() => {
    if (lacksPermission) return undefined;
    let active = true;
    async function load() {
      setLoading(true);
      setSaveError(null);
      try {
        const queueResponse = await api.get(`/instructors/${instructorId}/assignments/pending`);
        if (!active) return;
        setQueue(queueResponse.data.data || []);
        if (assignmentId) {
          const detailResponse = await api.get(`/assignments/${assignmentId}`);
          if (!active) return;
          const detail = detailResponse.data.data;
          setAssignment(detail);
          setGrade(detail.grade ?? '');
          setFeedback(detail.feedback || '');
          setStatus(detail.status === 'pending' ? 'graded' : detail.status);
        } else {
          setAssignment(null);
        }
      } catch (err) {
        if (active) setSaveError(err?.message || 'تعذر تحميل واجبات الطلاب.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [assignmentId, instructorId, lacksPermission]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError(null);
    if (!assignment) return;
    const numericGrade = Number(grade);
    if (status === 'graded' && (grade === '' || !Number.isFinite(numericGrade) || numericGrade < 0 || numericGrade > 100)) {
      setSaveError('الدرجة يجب أن تكون رقماً بين 0 و100.');
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/assignments/${assignment._id}/grade`, { grade: status === 'graded' ? numericGrade : null, feedback, status });
      setSuccess('تم حفظ التقييم وإشعار الطالب.');
      setQueue((items) => items.filter((item) => item._id !== assignment._id));
      setTimeout(() => navigate(`/${instructorId}/assistant/grade`), 700);
    } catch (err) {
      setSaveError(err?.message || 'فشل حفظ التقييم. حاول مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  if (lacksPermission) return <div className="p-6 text-ink-500">جارِ التحقق من الصلاحيات...</div>;
  if (loading) return <div dir="rtl" className="p-6 text-ink-600">جارٍ تحميل الواجبات...</div>;

  if (!assignmentId) return <div dir="rtl" className="min-h-screen bg-surface-canvas text-ink-900 p-6"><h1 className="text-2xl font-semibold mb-6">واجبات بانتظار التصحيح</h1>{saveError && <div className="rounded-md p-3 bg-danger-soft text-danger-DEFAULT mb-4">{saveError}</div>}<div className="space-y-3">{queue.length === 0 ? <div className="rounded-2xl bg-surface-default shadow-card p-6 text-ink-600">لا توجد واجبات بانتظار التصحيح.</div> : queue.map((item) => <button type="button" key={item._id} onClick={() => navigate(`/${instructorId}/assistant/grade/${item._id}`)} className="w-full text-right rounded-2xl bg-surface-default shadow-card p-4 hover:ring-2 hover:ring-brand-500"><div className="flex justify-between gap-3"><div><p className="font-semibold">{item.studentId?.name || 'طالب'}</p><p className="text-sm text-ink-500 mt-1">{item.courseId?.title_ar || 'واجب المحاضرة'} — {formatDateTime(item.submittedAt)}</p></div><Badge variant="neutral">بانتظار</Badge></div></button>)}</div></div>;

  const fileUrl = resolveApiAssetUrl(assignment.submissionFileUrl);
  const isPdf = fileUrl?.toLowerCase().endsWith('.pdf');
  return <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl"><div className="container mx-auto px-4 py-6"><header className="mb-6 flex items-center justify-between"><div><h1 className="text-2xl font-semibold">{assignment.studentId?.name || 'طالب'}</h1><p className="text-sm text-ink-500 mt-1">{assignment.courseId?.title_ar || 'واجب المحاضرة'} — {formatDateTime(assignment.submittedAt)}</p></div><Badge variant="neutral">بانتظار</Badge></header><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><section className="rounded-2xl bg-surface-default shadow-card p-4"><h2 className="text-lg font-medium mb-3">ملف الطالب</h2>{fileUrl ? (isPdf ? <iframe src={fileUrl} className="w-full h-96 rounded-lg border border-surface-border" title="ملف الواجب" /> : <a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full px-4 py-2 bg-brand-500 text-sm font-semibold">عرض / تحميل الملف</a>) : <p className="text-sm text-ink-500">لم يتم رفع ملف لهذا الواجب.</p>}{assignment.submissionNote && <div className="mt-4"><h3 className="text-sm font-medium mb-2">ملاحظة الطالب</h3><div className="rounded-md p-3 bg-surface-muted text-sm">{assignment.submissionNote}</div></div>}</section><section className="rounded-2xl bg-surface-default shadow-card p-4"><h2 className="text-lg font-medium mb-3">نموذج التقييم</h2>{success && <div className="rounded-md p-3 bg-success-soft text-success-DEFAULT mb-3 text-sm">{success}</div>}{saveError && <div className="rounded-md p-3 bg-danger-soft text-danger-DEFAULT mb-3 text-sm">{saveError}</div>}<form onSubmit={handleSubmit} className="flex flex-col gap-4"><div><label htmlFor="grade" className="mb-1 block text-sm text-ink-500">الدرجة</label><Input id="grade" type="number" min={0} max={100} value={grade} onChange={(e) => setGrade(e.target.value)} disabled={status === 'resubmit'} /></div><div><label htmlFor="feedback" className="mb-1 block text-sm text-ink-500">ملاحظات المساعد</label><textarea id="feedback" rows={6} value={feedback} onChange={(e) => setFeedback(e.target.value)} maxLength={5000} className={fieldClasses} /></div><div><label htmlFor="status" className="mb-1 block text-sm text-ink-500">الحالة</label><select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClasses}><option value="graded">تم التصحيح</option><option value="resubmit">إعادة التسليم</option></select></div><div className="flex gap-3"><Button type="submit" variant="primary" disabled={saving}>{saving ? 'جارِ الحفظ...' : 'حفظ التصحيح'}</Button><Button type="button" variant="ghost" onClick={() => navigate(`/${instructorId}/assistant/grade`)}>القائمة</Button></div></form></section></div></div></div>;
}
