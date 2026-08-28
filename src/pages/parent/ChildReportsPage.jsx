// src/pages/parent/ChildReportsPage.jsx
export const route = {
  path: '/:instructorId/parent/reports',
  index: false,
  auth: 'parent',
  title: 'تقارير الطالب'
};

import React, { useMemo, useState } from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { children as mockChildren, reports as mockReports, activities as mockActivities } from '../../mocks/parentData';
import { useSelectedChild } from '../../contexts/SelectedChildContext';
import Avatar from '../../components/ui/Avatar';

const TABS = [
  { id: 'grades', label: 'الدرجات' },
  { id: 'attendance', label: 'الحضور' },
  { id: 'assignments', label: 'الواجبات' },
  { id: 'progress', label: 'تقدم المحاضرات' }
];

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

/* -------------------- Grades Tab -------------------- */
function GradesTab({ childId }) {
  const grades = (mockReports[childId] && mockReports[childId].recentGrades) || [];

  return (
    <div className="rounded-2xl bg-surface-default shadow-card p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-right" dir="rtl">
          <thead>
            <tr className="text-xs text-ink-500">
              <th className="py-2 px-3 text-right">المادة</th>
              <th className="py-2 px-3 text-right">الدرجة</th>
              <th className="py-2 px-3 text-right">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {grades.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-4 text-center text-ink-600">لا توجد درجات حديثة</td>
              </tr>
            ) : (
              grades.map((g) => {
                const score = Number(g.score);
                const colorClass =
                  score >= 85 ? 'text-green-700' : score >= 60 ? 'text-yellow-700' : 'text-red-700';
                return (
                  <tr key={g.id} className="border-t border-surface-border">
                  <td className="py-3 px-3 text-right">{g.title}</td>
                    <td className={`py-3 px-3 text-right font-semibold ${colorClass}`}>{g.score}</td>
                    <td className="py-3 px-3 text-right text-sm text-ink-500">{formatDate(g.date)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------- Attendance Tab -------------------- */
function AttendanceTab() {
  const rows = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const status = i % 6 === 0 ? 'غائب' : 'حاضر';
    return { id: `att-${i}`, date: d.toISOString(), status };
  });

  return (
    <div className="rounded-2xl bg-surface-default shadow-card p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-right" dir="rtl">
          <thead>
            <tr className="text-xs text-ink-500">
              <th className="py-2 px-3 text-right">التاريخ</th>
              <th className="py-2 px-3 text-right">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-surface-border">
                <td className="py-3 px-3 text-right text-sm text-ink-600">{formatDate(r.date)}</td>
                <td className="py-3 px-3 text-right">
                  {r.status === 'حاضر' ? (
                    <Badge variant="success">حاضر</Badge>
                  ) : (
                    <Badge variant="danger">غائب</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------- Assignments Tab -------------------- */
// FIX: mockReports[childId].assignments never existed in parentData.js — this tab
// was permanently empty. Added an inline mock array (same pattern as taFeedback
// in ParentActivityPage) so the tab actually renders per-child data.
function AssignmentsTab({ childId }) {
  const assignmentsByChild = {
    'child-1': [
      { id: 'as1', title: 'واجب: نظرية فيثاغورس', status: 'graded', grade: 78 },
      { id: 'as2', title: 'واجب: الكسور والأعداد العشرية', status: 'pending', grade: null },
      { id: 'as3', title: 'واجب: مسائل هندسية', status: 'resubmit', grade: null }
    ],
    'child-2': [
      { id: 'as4', title: 'واجب: مسائل تطبيقية', status: 'graded', grade: 89 },
      { id: 'as5', title: 'واجب: معادلات تفاضلية', status: 'pending', grade: null }
    ]
  };
  const assignments = assignmentsByChild[childId] || [];

  return (
    <div className="rounded-2xl bg-surface-default shadow-card p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-right" dir="rtl">
          <thead>
            <tr className="text-xs text-ink-500">
              <th className="py-2 px-3 text-right">المهمة</th>
              <th className="py-2 px-3 text-right">الحالة</th>
              <th className="py-2 px-3 text-right">الدرجة</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-4 text-center text-ink-600">لا توجد واجبات</td>
              </tr>
            ) : (
              assignments.map((a) => (
                <tr key={a.id} className="border-t border-surface-border">
                  <td className="py-3 px-3 text-right">{a.title}</td>
                  <td className="py-3 px-3 text-right">
                    {/* FIX: Badge has no "warning" variant (only brand/info/success/danger/neutral) */}
                    {a.status === 'pending' && <Badge variant="neutral">معلق</Badge>}
                    {a.status === 'graded' && <Badge variant="success">مصحح</Badge>}
                    {a.status === 'resubmit' && <Badge variant="danger">إعادة تسليم</Badge>}
                  </td>
                  <td className="py-3 px-3 text-right">{a.grade ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------- Lecture Progress Tab -------------------- */
function LectureProgressTab({ childId }) {
  const courses = (mockReports[childId] && mockReports[childId].courses) || [];

  return (
    <div className="rounded-2xl bg-surface-default shadow-card p-4 space-y-4">
      {courses.length === 0 ? (
        <div className="text-ink-600">لا توجد دورات مسجلة</div>
      ) : (
        courses.map((c) => {
          // FIX: mock course objects use `progressPercent`, not `progress`
          const percent = Math.max(0, Math.min(100, Number(c.progressPercent || 0)));
          return (
            <div key={c.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-ink-900">{c.title}</div>
                  <div className="text-sm text-ink-600">{c.instructor}</div>
                </div>
                <div className="text-sm text-ink-500">{formatDate(c.lastActivity)}</div>
              </div>

              <div className="w-full bg-surface-muted rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full bg-brand-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

/* -------------------- Main Page -------------------- */
export default function ChildReportsPage() {
  const { selectedChildId } = useSelectedChild();
  const activeChildId = selectedChildId ?? (mockChildren && mockChildren[0] && mockChildren[0].id) ?? null;

  const child = useMemo(() => {
    return mockChildren.find((c) => c.id === activeChildId) || mockChildren[0] || null;
  }, [activeChildId]);

  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={child?.avatar} name={child?.name || 'الطالب'} size="lg" />
          <div>
            <div className="text-xl font-semibold text-ink-900">{child?.name || 'الطالب'}</div>
            {/* FIX: mock data field is `grade`, not `class` */}
            <div className="text-sm text-ink-600">{child?.grade || ''}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* FIX: Button has no "outline" variant (only primary/ghost/subtle) */}
          <Button variant="ghost" size="sm">تصدير تقرير</Button>
          <Button variant="primary" size="sm">طلب اجتماع</Button>
        </div>
      </div>

      <div className="rounded-2xl bg-surface-default shadow-card p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 border-b border-surface-border pb-3 overflow-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`py-2 px-3 text-sm font-medium ${activeTab === t.id ? 'text-brand-700 border-b-2 border-brand-500' : 'text-ink-700 hover:text-brand-700'}`}
                aria-current={activeTab === t.id ? 'true' : 'false'}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div>
            {activeTab === 'grades' && <GradesTab childId={activeChildId} />}
            {activeTab === 'attendance' && <AttendanceTab />}
            {activeTab === 'assignments' && <AssignmentsTab childId={activeChildId} />}
            {activeTab === 'progress' && <LectureProgressTab childId={activeChildId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
