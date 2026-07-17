// src/pages/public/LeaderboardPage.jsx
export const route = {
  path: '/:instructorId/leaderboard',
  index: false,
  auth: null,
  title: 'لوحة الشرف'
};

import React, { useMemo, useState } from 'react';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const MOCK_STUDENTS = [
  { id: 's1', name: 'أحمد علي', avatar: null, stage: 'الصف السابع', homeworkAvg: 92, examAvg: 88, totalScore: 90 },
  { id: 's2', name: 'سارة محمد', avatar: null, stage: 'الصف الثامن', homeworkAvg: 95, examAvg: 91, totalScore: 93 },
  { id: 's3', name: 'محمود حسن', avatar: null, stage: 'الصف التاسع', homeworkAvg: 88, examAvg: 85, totalScore: 86.5 },
  { id: 's4', name: 'ليلى إبراهيم', avatar: null, stage: 'الصف العاشر', homeworkAvg: 90, examAvg: 94, totalScore: 92 },
  { id: 's5', name: 'يوسف سمير', avatar: null, stage: 'الصف الحادي عشر', homeworkAvg: 84, examAvg: 80, totalScore: 82 },
  { id: 's6', name: 'نور خالد', avatar: null, stage: 'الصف الثاني عشر', homeworkAvg: 89, examAvg: 87, totalScore: 88 },
  { id: 's7', name: 'هند محمود', avatar: null, stage: 'الصف السابع', homeworkAvg: 78, examAvg: 82, totalScore: 80 },
  { id: 's8', name: 'علي سمير', avatar: null, stage: 'الصف الثامن', homeworkAvg: 85, examAvg: 86, totalScore: 85.5 },
  { id: 's9', name: 'منى أحمد', avatar: null, stage: 'الصف التاسع', homeworkAvg: 93, examAvg: 95, totalScore: 94 },
  { id: 's10', name: 'رامي فؤاد', avatar: null, stage: 'الصف العاشر', homeworkAvg: 76, examAvg: 70, totalScore: 73 },
  { id: 's11', name: 'دينا سمير', avatar: null, stage: 'الصف الحادي عشر', homeworkAvg: 91, examAvg: 89, totalScore: 90 },
  { id: 's12', name: 'كريم نبيل', avatar: null, stage: 'الصف الثاني عشر', homeworkAvg: 82, examAvg: 84, totalScore: 83 },
  { id: 's13', name: 'هالة رامي', avatar: null, stage: 'الصف السابع', homeworkAvg: 87, examAvg: 90, totalScore: 88.5 },
  { id: 's14', name: 'زياد عادل', avatar: null, stage: 'الصف الثامن', homeworkAvg: 80, examAvg: 78, totalScore: 79 },
  { id: 's15', name: 'سلمى ياسر', avatar: null, stage: 'الصف التاسع', homeworkAvg: 96, examAvg: 94, totalScore: 95 }
];

const STAGES = [
  'الصف السابع',
  'الصف الثامن',
  'الصف التاسع',
  'الصف العاشر',
  'الصف الحادي عشر',
  'الصف الثاني عشر'
];

function TrophyIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 3h8v2a4 4 0 01-4 4h0a4 4 0 01-4-4V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 7v2a6 6 0 006 6v2H6v2h12v-2h-4v-2a6 6 0 006-6V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LeaderboardPage() {
  const [stageFilter, setStageFilter] = useState('all');

  const sorted = useMemo(() => {
    return [...MOCK_STUDENTS].sort((a, b) => b.totalScore - a.totalScore);
  }, []);

  const filtered = useMemo(() => {
    if (stageFilter === 'all') return sorted;
    return sorted.filter((s) => s.stage === stageFilter);
  }, [sorted, stageFilter]);

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      <header className="bg-surface-default border-b border-surface-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="text-right">
            <div className="flex items-center gap-3">
              <TrophyIcon className="w-8 h-8 text-brand-500" />
              <h1 className="text-2xl font-semibold">لوحة الشرف</h1>
            </div>
            <p className="text-sm text-ink-600 mt-1">أفضل الطلاب في الواجبات والاختبارات</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-ink-600">تصفية حسب المرحلة</div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-white border border-surface-border rounded-md px-3 py-2 text-sm text-ink-700"
            >
              <option value="all">الكل</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Top 3 podium */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {top3.map((student, idx) => {
            const rank = idx + 1;
            const accent =
              rank === 1 ? 'bg-yellow-100 border-yellow-200' :
              rank === 2 ? 'bg-gray-100 border-gray-200' :
              'bg-amber-50 border-amber-200';
            const badgeLabel = rank === 1 ? 'الأول' : rank === 2 ? 'الثاني' : 'الثالث';
            return (
              <div key={student.id} className={`rounded-2xl shadow-card p-6 flex flex-col items-center text-center ${accent}`}>
                <div className="flex items-center gap-3">
                  <Avatar src={student.avatar} name={student.name} size="lg" />
                </div>
                <div className="mt-4">
                  <div className="text-lg font-semibold text-ink-900">{student.name}</div>
                  <div className="text-sm text-ink-600 mt-1">{student.stage}</div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge className="text-sm">{badgeLabel}</Badge>
                  <div className="text-sm text-ink-600">المجموع: <span className="font-bold text-brand-600">{student.totalScore}</span></div>
                </div>
                <div className="mt-4 w-full">
                  <div className="text-xs text-ink-500">متوسط الواجبات: {student.homeworkAvg}%</div>
                  <div className="text-xs text-ink-500">متوسط الاختبارات: {student.examAvg}%</div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Full table */}
        <section className="rounded-2xl bg-surface-default shadow-card p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-right" dir="rtl">
              <thead>
                <tr className="text-xs text-ink-500">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">الطالب</th>
                  <th className="py-3 px-3">المرحلة</th>
                  <th className="py-3 px-3">متوسط الواجبات</th>
                  <th className="py-3 px-3">متوسط الاختبارات</th>
                  <th className="py-3 px-3">المجموع</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const rank = i + 1;
                  const highlight = rank <= 3 ? 'bg-brand-50' : '';
                  return (
                    <tr key={s.id} className={`${highlight} border-t border-surface-border`}>
                      <td className="py-3 px-3 text-sm font-medium">{rank}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={s.avatar} name={s.name} size="sm" />
                          <div>
                            <div className="text-sm font-medium text-ink-900">{s.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-ink-700">{s.stage}</td>
                      <td className="py-3 px-3 text-sm text-ink-700">{s.homeworkAvg}%</td>
                      <td className="py-3 px-3 text-sm text-ink-700">{s.examAvg}%</td>
                      <td className="py-3 px-3 text-sm font-bold text-brand-600">{s.totalScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
