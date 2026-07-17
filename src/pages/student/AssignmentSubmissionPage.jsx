// src/pages/student/AssignmentSubmissionPage.jsx
export const route = {
  path: '/:instructorId/courses/:courseId/assignments/:assignmentId',
  index: false,
  auth: 'required',
  roles: ['student'],
  title: 'تسليم الواجب',
};

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const MOCK_ASSIGNMENT = {
  id: 'assignment-1',
  title: 'واجب: حل معادلات الدرجة الأولى',
  instructions: 'قم بحل التمارين المرفقة في الملف، واكتب خطوات الحل بالكامل قبل التسليم.',
  downloadUrl: '/mock/assignment-sheet.pdf',
  status: 'pending', // 'pending' | 'graded' | 'resubmit'
  grade: null,
  feedback: null,
};

export default function AssignmentSubmissionPage() {
  const { assignmentId } = useParams();

  const assignment = { ...MOCK_ASSIGNMENT, id: assignmentId || MOCK_ASSIGNMENT.id };

  const [file, setFile] = useState(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { file, submissionNote };
    // eslint-disable-next-line no-console
    console.log('Assignment submission payload:', payload);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const showFeedback = assignment.status === 'graded' || assignment.status === 'resubmit';
  const locked = assignment.status !== 'graded';

  return (
    <div dir="rtl" className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">{assignment.title}</h1>
      </div>

      {/* Instructions */}
      <section className="bg-surface-default rounded-2xl shadow-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-ink-900">التعليمات</h2>
        <p className="text-sm text-ink-600 leading-relaxed">{assignment.instructions}</p>
        {assignment.downloadUrl && (
          <a href={assignment.downloadUrl} download>
            <Button variant="ghost" size="sm">تحميل المرفقات</Button>
          </a>
        )}
      </section>

      {/* Feedback (if graded/resubmit) */}
      {showFeedback && (
        <section className="bg-surface-default rounded-2xl shadow-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-900">تقييم الواجب</h2>
            {assignment.grade != null && (
              <Badge variant={assignment.status === 'graded' ? 'success' : 'danger'}>
                الدرجة: {assignment.grade}
              </Badge>
            )}
          </div>
          {assignment.feedback && (
            <p className="text-sm text-ink-600 leading-relaxed">{assignment.feedback}</p>
          )}
        </section>
      )}

      {/* Submission form */}
      <section className="bg-surface-default rounded-2xl shadow-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-ink-900">تسليم الواجب</h2>

        {submitted && (
          <div className="rounded-md p-3 bg-success-soft text-success-DEFAULT text-sm">
            تم تسليم الواجب بنجاح
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
              dragActive ? 'border-brand-500 bg-brand-50' : 'border-surface-border bg-surface-muted'
            } ${submitted ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {file ? (
              <p className="text-sm text-ink-800 font-medium">{file.name}</p>
            ) : (
              <p className="text-sm text-ink-500">اسحب الملف هنا أو اختر ملفاً</p>
            )}
            <label className="inline-block mt-3">
              <span className="cursor-pointer text-sm text-brand-700 underline">اختر ملفاً</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={submitted}
              />
            </label>
          </div>

          <div>
            <label htmlFor="submissionNote" className="block text-sm font-medium text-ink-700 mb-1">
              ملاحظات التسليم
            </label>
            <textarea
              id="submissionNote"
              value={submissionNote}
              onChange={(e) => setSubmissionNote(e.target.value)}
              disabled={submitted}
              rows={4}
              className="input w-full"
              placeholder="أضف أي ملاحظات حول حلك..."
            />
          </div>

          <Button type="submit" variant="primary" disabled={submitting || submitted}>
            {submitting ? 'جارٍ التسليم...' : submitted ? 'تم التسليم' : 'تسليم الواجب'}
          </Button>
        </form>
      </section>

      {/* Lock notice */}
      {locked && (
        <Badge variant="info">
          يجب إكمال هذا الواجب واجتياز اختبار الدرس لفتح المحاضرة التالية
        </Badge>
      )}
    </div>
  );
}