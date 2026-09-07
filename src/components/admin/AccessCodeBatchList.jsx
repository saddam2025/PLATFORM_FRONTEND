import React, { useEffect, useState } from 'react';
import Badge from '../ui/Badge';
import api from '../../services/api';

const labels = {
  full_course: 'كورس كامل',
  single_lecture: 'محاضرة واحدة'
};

export default function AccessCodeBatchList({ instructorId }) {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get(`/instructors/${instructorId}/access-code-batches`)
      .then((response) => { if (active) setBatches(response.data.data || []); })
      .catch((err) => { if (active) setError(err?.message || 'تعذر تحميل دفعات أكواد الوصول.'); });
    return () => { active = false; };
  }, [instructorId]);

  return <section className="bg-surface-default rounded-2xl shadow-card p-6 space-y-4">
    <div><h2 className="font-semibold">دفعات أكواد الوصول</h2><p className="text-sm text-ink-500 mt-1">الأكواد نفسها لا تُعرض مرة أخرى بعد التوليد.</p></div>
    {error && <p className="text-sm text-danger-DEFAULT">{error}</p>}
    <div className="overflow-x-auto"><table className="w-full text-sm text-right"><thead><tr className="border-b"><th className="p-2">النوع</th><th>الكورس / المحاضرة</th><th>الدفعة</th><th>المستخدم</th><th>المتاح</th><th>تاريخ الإنشاء</th></tr></thead><tbody>
      {batches.map((batch) => <tr className="border-b" key={`${batch.batchId}-${batch.type}-${batch.lectureId || batch.courseId}`}><td className="p-2"><Badge variant={batch.type === 'single_lecture' ? 'info' : 'success'}>{labels[batch.type]}</Badge></td><td>{batch.course?.title_ar || batch.course?.title_en || '—'}{batch.lecture && <div className="text-xs text-ink-500">{batch.lecture.title_ar || batch.lecture.title_en}</div>}</td><td className="font-mono">{batch.batchId}</td><td>{batch.redeemed}/{batch.total}</td><td>{batch.available}</td><td>{batch.createdAt ? new Date(batch.createdAt).toLocaleDateString('ar') : '—'}</td></tr>)}
      {batches.length === 0 && !error && <tr><td colSpan={6} className="p-6 text-center text-ink-500">لا توجد دفعات أكواد وصول</td></tr>}
    </tbody></table></div>
  </section>;
}
