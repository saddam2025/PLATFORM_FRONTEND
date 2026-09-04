export const route = { path: '/:instructorId/admin/scratchcards', index: false, auth: 'required', roles: ['admin', 'assistant', 'teacher'], title: 'أكواد التفعيل' };

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';

export default function ScratchCardManager() {
  const { instructorId } = useParams();
  const { user } = useAuth() || {};
  const canGenerate = user?.role === 'admin' || user?.permissions?.includes('can_generate_access_codes');
  const [count, setCount] = useState(10);
  const [batchId, setBatchId] = useState('');
  const [value, setValue] = useState(50);
  const [cards, setCards] = useState([]);
  const [batches, setBatches] = useState([]);
  const [status, setStatus] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [oneTimeCodes, setOneTimeCodes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [lectureCount, setLectureCount] = useState(10);
  const [lectureCodes, setLectureCodes] = useState([]);
  const [activeTab, setActiveTab] = useState('scratchcard');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCards = async () => {
    const params = new URLSearchParams();
    if (filterBatch.trim()) params.set('batchId', filterBatch.trim());
    if (status) params.set('status', status);
    const response = await api.get(`/instructors/${instructorId}/scratchcards${params.toString() ? `?${params}` : ''}`);
    setCards(response.data.data.cards || []);
    setBatches(response.data.data.batches || []);
  };

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [cardsResponse, coursesResponse] = await Promise.all([api.get(`/instructors/${instructorId}/scratchcards`), api.get(`/instructors/${instructorId}/courses`)]);
        if (!active) return;
        setCards(cardsResponse.data.data.cards || []);
        setBatches(cardsResponse.data.data.batches || []);
        const loadedCourses = coursesResponse.data.data || [];
        setCourses(loadedCourses);
        setCourseId(loadedCourses[0]?._id || '');
      } catch (err) {
        if (active) setError(err?.message || 'تعذر تحميل البطاقات.');
      } finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [instructorId]);

  const handleGenerateScratchCards = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await api.post(`/instructors/${instructorId}/scratchcards/generate`, { count: Number(count), value: Number(value), ...(batchId.trim() ? { batchId: batchId.trim() } : {}) });
      setOneTimeCodes(response.data.data.codes || []);
      setBatchId('');
      await loadCards();
    } catch (err) { setError(err?.message || 'تعذر توليد بطاقات الشحن.'); }
  };

  const handleGenerateLectureCodes = async (event) => {
    event.preventDefault();
    if (!courseId) return;
    setError('');
    try {
      const response = await api.post(`/instructors/${instructorId}/courses/${courseId}/access-codes/generate`, { count: Number(lectureCount) });
      setLectureCodes(response.data.data.codes || []);
    } catch (err) { setError(err?.message || 'تعذر توليد أكواد المحاضرة.'); }
  };

  if (loading) return <div dir="rtl" className="p-6 text-ink-600">جارٍ تحميل البطاقات...</div>;
  return <div dir="rtl" className="space-y-6"><div><h1 className="text-xl font-semibold text-ink-900">أكواد التفعيل</h1><p className="text-sm text-ink-500 mt-1">الأكواد تظهر مرة واحدة عند التوليد فقط.</p></div>{error && <div className="rounded-md p-3 bg-danger-soft text-danger-DEFAULT">{error}</div>}{!canGenerate && <Badge variant="danger">لا تملك صلاحية توليد الأكواد.</Badge>}
    <div className="flex gap-2"><Button variant={activeTab === 'scratchcard' ? 'primary' : 'ghost'} onClick={() => setActiveTab('scratchcard')}>بطاقات الشحن</Button><Button variant={activeTab === 'lectureCodes' ? 'primary' : 'ghost'} onClick={() => setActiveTab('lectureCodes')}>أكواد المحاضرات</Button></div>
    {activeTab === 'scratchcard' && <div className="space-y-6"><form onSubmit={handleGenerateScratchCards} className="bg-surface-default rounded-2xl shadow-card p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"><div><label className="block text-sm mb-1">عدد البطاقات</label><Input type="number" min={1} value={count} onChange={(e) => setCount(e.target.value)} disabled={!canGenerate} /></div><div><label className="block text-sm mb-1">معرف الدفعة</label><Input value={batchId} onChange={(e) => setBatchId(e.target.value)} disabled={!canGenerate} /></div><div><label className="block text-sm mb-1">القيمة</label><Input type="number" min={1} value={value} onChange={(e) => setValue(e.target.value)} disabled={!canGenerate} /></div><Button type="submit" variant="primary" disabled={!canGenerate}>توليد</Button></form>
      {oneTimeCodes.length > 0 && <section className="bg-success-soft rounded-2xl p-6"><h2 className="font-semibold mb-3">الأكواد الجديدة — انسخها الآن، لن يمكن عرضها لاحقاً</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{oneTimeCodes.map((code) => <code key={code} className="bg-surface-default rounded p-2 text-center">{code}</code>)}</div></section>}
      <section className="bg-surface-default rounded-2xl shadow-card p-6 space-y-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-3"><Input placeholder="معرف الدفعة" value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)} /><select className="input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">كل الحالات</option><option value="available">متاح</option><option value="redeemed">مستخدم</option></select><Button variant="ghost" onClick={() => loadCards().catch((err) => setError(err?.message || 'تعذر التصفية.'))}>تطبيق الفلتر</Button></div><div className="text-xs text-ink-500">ملخص الدفعات: {batches.map((batch) => `${batch._id}: ${batch.redeemed}/${batch.total}`).join(' | ') || 'لا توجد دفعات'}</div><div className="overflow-x-auto"><table className="w-full text-sm text-right"><thead><tr className="border-b"><th className="p-2">معرف البطاقة</th><th>القيمة</th><th>الحالة</th><th>المستخدم</th><th>تاريخ الاستخدام</th><th>الدفعة</th></tr></thead><tbody>{cards.map((card) => <tr key={card._id} className="border-b"><td className="p-2 font-mono">{card._id}</td><td>{card.value} ج.م</td><td><Badge variant={card.isRedeemed ? 'success' : 'neutral'}>{card.isRedeemed ? 'مستخدم' : 'متاح'}</Badge></td><td>{card.redeemedBy?.name || '—'}</td><td>{card.redeemedAt ? new Date(card.redeemedAt).toLocaleDateString('ar') : '—'}</td><td>{card.batchId}</td></tr>)}{cards.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-ink-500">لا توجد بطاقات مطابقة</td></tr>}</tbody></table></div></section></div>}
    {activeTab === 'lectureCodes' && <div className="space-y-4"><form onSubmit={handleGenerateLectureCodes} className="bg-surface-default rounded-2xl shadow-card p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end"><div><label className="block text-sm mb-1">عدد الأكواد</label><Input type="number" min={1} value={lectureCount} onChange={(e) => setLectureCount(e.target.value)} disabled={!canGenerate} /></div><div><label className="block text-sm mb-1">المحاضرة</label><select className="input w-full" value={courseId} onChange={(e) => setCourseId(e.target.value)} disabled={!canGenerate}>{courses.map((course) => <option key={course._id} value={course._id}>{course.title_ar || course.title_en}</option>)}</select></div><Button type="submit" variant="primary" disabled={!canGenerate || !courseId}>توليد</Button></form>{lectureCodes.length > 0 && <div className="bg-success-soft rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-2">{lectureCodes.map((code) => <code key={code} className="bg-surface-default rounded p-2 text-center">{code}</code>)}</div>}</div>}
  </div>;
}
