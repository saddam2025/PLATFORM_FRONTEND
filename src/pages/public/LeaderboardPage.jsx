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

const VISIBLE_REST_STEP = 3;

function TrophyIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 3h8v2a4 4 0 01-4 4h0a4 4 0 01-4-4V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 7v2a6 6 0 006 6v2H6v2h12v-2h-4v-2a6 6 0 006-6V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrownIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8z" />
    </svg>
  );
}

function StarIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.9L6 21l1.6-7L2.2 9.2l7.1-.6L12 2z" />
    </svg>
  );
}

function ChevronDownIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M6 9l6 6 6-6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Simple, theme-aware styling per podium rank. Colors are kept minimal and
// reuse the app's surface/ink tokens so they adapt automatically to dark mode;
// only the small rank badge/score pill carry an accent color, with an
// explicit dark: variant so they stay legible on a dark background.
const RANK_STYLES = {
  1: {
    cardBorder: 'border-yellow-400/60 dark:border-yellow-300/40',
    ring: 'ring-2 ring-yellow-400 dark:ring-yellow-300',
    badge: 'bg-yellow-400 text-ink-900 dark:bg-yellow-300 dark:text-ink-900',
    scorePill: 'bg-yellow-400 text-ink-900 dark:bg-yellow-300 dark:text-ink-900',
    elevated: true,
    label: '1'
  },
  2: {
    cardBorder: 'border-surface-border',
    ring: 'ring-2 ring-surface-border',
    badge: 'bg-surface-muted text-ink-700 border border-surface-border',
    scorePill: 'bg-surface-muted text-ink-800 border border-surface-border',
    elevated: false,
    label: '2'
  },
  3: {
    cardBorder: 'border-surface-border',
    ring: 'ring-2 ring-amber-600/50 dark:ring-amber-400/50',
    badge: 'bg-amber-600 text-white dark:bg-amber-500',
    scorePill: 'bg-surface-muted text-ink-800 border border-surface-border',
    elevated: false,
    label: '3'
  }
};

// Right-to-left DOM order so, under dir="rtl", 2nd place renders on the
// right, 1st place is centered and raised, and 3rd place renders on the left.
const PODIUM_ORDER = [2, 1, 3];

export default function LeaderboardPage() {
  const [stageFilter, setStageFilter] = useState('all');
  const [visibleRestCount, setVisibleRestCount] = useState(VISIBLE_REST_STEP);

  const sorted = useMemo(() => {
    return [...MOCK_STUDENTS].sort((a, b) => b.totalScore - a.totalScore);
  }, []);

  const filtered = useMemo(() => {
    if (stageFilter === 'all') return sorted;
    return sorted.filter((s) => s.stage === stageFilter);
  }, [sorted, stageFilter]);

  const byRank = {
    1: filtered[0],
    2: filtered[1],
    3: filtered[2]
  };
  const rest = filtered.slice(3);
  const visibleRest = rest.slice(0, visibleRestCount);
  const hasMore = visibleRestCount < rest.length;

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

          <div className="relative">
            <select
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value);
                setVisibleRestCount(VISIBLE_REST_STEP);
              }}
              className="appearance-none bg-surface-default border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-ink-700 cursor-pointer transition-colors hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">كل المراحل</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Top 3 podium */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          {PODIUM_ORDER.map((rank) => {
            const student = byRank[rank];
            if (!student) return <div key={rank} />;
            const style = RANK_STYLES[rank];

            return (
              <div
                key={student.id}
                className={`group relative rounded-2xl border bg-surface-default p-6 pt-10 flex flex-col items-center text-center
                  transition-all duration-200 ease-out cursor-default
                  hover:-translate-y-1.5 hover:shadow-lg
                  ${style.cardBorder}
                  ${style.elevated ? 'sm:-mt-4' : ''}`}
              >
                {style.elevated && (
                  <CrownIcon className="w-6 h-6 text-yellow-400 dark:text-yellow-300 mb-1 transition-transform duration-200 group-hover:-translate-y-0.5" />
                )}

                <div className="relative">
                  <Avatar src={student.avatar} name={student.name} size="lg" className={`rounded-full ${style.ring}`} />
                  <span
                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${style.badge}`}
                  >
                    {style.label}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-base font-semibold text-ink-900 transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {student.name}
                  </div>
                  <div className="text-xs text-ink-500 mt-1">{student.stage}</div>
                </div>

                <div className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${style.scorePill}`}>
                  <StarIcon className="w-3.5 h-3.5" />
                  {student.totalScore}
                </div>
              </div>
            );
          })}
        </section>

        {/* Full table */}
        <section className="rounded-2xl bg-surface-default border border-surface-border p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-right" dir="rtl">
              <thead>
                <tr className="text-xs text-ink-500">
                  <th className="py-3 px-3 font-medium">الترتيب</th>
                  <th className="py-3 px-3 font-medium">الطالب</th>
                  <th className="py-3 px-3 font-medium">المرحلة</th>
                  <th className="py-3 px-3 font-medium">متوسط الواجبات</th>
                  <th className="py-3 px-3 font-medium">متوسط الاختبارات</th>
                  <th className="py-3 px-3 font-medium">المجموع</th>
                </tr>
              </thead>
              <tbody>
                {visibleRest.map((s, i) => {
                  const rank = i + 4;
                  return (
                    <tr
                      key={s.id}
                      className="border-t border-surface-border transition-colors hover:bg-surface-muted cursor-default"
                    >
                      <td className="py-4 px-3">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-muted text-sm font-semibold text-ink-700">
                          {rank}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={s.avatar} name={s.name} size="sm" />
                          <div className="text-sm font-medium text-ink-900 transition-colors hover:text-brand-600 dark:hover:text-brand-400">
                            {s.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-sm text-ink-700">{s.stage}</td>
                      <td className="py-4 px-3 text-sm text-ink-700">{s.homeworkAvg}%</td>
                      <td className="py-4 px-3 text-sm text-ink-700">{s.examAvg}%</td>
                      <td className="py-4 px-3 text-sm font-bold text-brand-600 dark:text-brand-400">{s.totalScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setVisibleRestCount((c) => c + VISIBLE_REST_STEP)}
                className="inline-flex items-center gap-1.5 text-sm text-ink-600 transition-colors hover:text-brand-600 dark:hover:text-brand-400"
              >
                <ChevronDownIcon className="w-4 h-4" />
                عرض المزيد
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}