// src/pages/parent/ParentDashboard.jsx
export const route = {
  path: '/:instructorId/parent/dashboard',
  index: false,
  auth: 'parent',
  title: 'لوحة ولي الأمر'
};

import React, { useMemo } from 'react';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { children as mockChildren, reports as mockReports } from '../../mocks/parentData';
import { useSelectedChild } from '../../contexts/SelectedChildContext';

function StatCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl bg-surface-default shadow-card p-4 flex flex-col gap-2">
      <div className="text-xs text-ink-500">{title}</div>
      <div className="text-2xl font-semibold text-ink-900">{value}</div>
      {hint && <div className="text-sm text-ink-600">{hint}</div>}
    </div>
  );
}

function TimelineItem({ item }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-brand-500 mt-1" />
        <div className="w-px bg-surface-border flex-1" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-medium text-ink-900">{item.title}</div>
          <div className="text-xs text-ink-500">{item.date}</div>
        </div>
        <div className="text-sm text-ink-600 mt-1">{item.type === 'exam' ? 'اختبار' : 'واجب'}</div>
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  const { selectedChildId } = useSelectedChild();

  const activeChildId = selectedChildId ?? (mockChildren && mockChildren[0] && mockChildren[0].id) ?? null;

  const child = useMemo(() => {
    return mockChildren.find((c) => c.id === activeChildId) || mockChildren[0] || null;
  }, [activeChildId]);

  const report = useMemo(() => {
    if (!activeChildId) return null;
    return mockReports[activeChildId] || {
      summary: { averageScore: '-', trend: '—', pendingAssignments: 0, completedLessons: 0 },
      upcoming: [],
      alerts: []
    };
  }, [activeChildId]);

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
    } catch {
      return iso;
    }
  };

  const upcoming = (report?.upcoming && report.upcoming.length > 0)
    ? report.upcoming.map((u) => ({ ...u, date: formatDate(u.date) }))
    : [
        // FIX: was `3 * 24 * 3600` (seconds) added to Date.now() (ms) — added ~4.3 minutes
        // instead of 3 days. Now correctly multiplied by 1000 to convert to ms.
        { id: 'u1', title: 'اختبار منتصف الفصل', date: formatDate(new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString()), type: 'exam' },
        { id: 'u2', title: 'تسليم واجب رياضيات', date: formatDate(new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString()), type: 'assignment' }
      ];

  const alerts = (report?.alerts && report.alerts.length > 0)
    ? report.alerts
    : [
        { id: 'a1', type: 'danger', text: 'انخفاض في متوسط الدرجات خلال الأسبوع الماضي' },
        { id: 'a2', type: 'info', text: 'رسالة جديدة من المعيد بخصوص الواجب' }
      ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={child?.avatar} name={child?.name || 'الطفل'} size="lg" />
          <div>
            <div className="text-xl font-semibold text-ink-900">{child?.name || 'الطفل'}</div>
            <div className="text-sm text-ink-600 flex items-center gap-2">
              <Badge className="bg-surface-muted text-ink-700">{child?.grade || 'الصف غير محدد'}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* FIX: Button has no "outline" variant (only primary/ghost/subtle) */}
          <Button variant="ghost" size="sm">مراسلة المعلم</Button>
          <Button variant="primary" size="sm">عرض تقرير مفصل</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="الأداء الأكاديمي الحالي"
          value={report?.summary?.averageScore ?? '-'}
          hint={report?.summary?.trend ? `اتجاه: ${report.summary.trend}` : 'لا توجد بيانات كافية'}
        />
        {/* FIX: pendingAssignments/completedLessons live under report.summary in
            parentData.js, not on report directly — these were always showing 0. */}
        <StatCard
          title="الواجبات المعلقة"
          value={report?.summary?.pendingAssignments ?? 0}
          hint="عدد الواجبات التي لم تُسلم بعد"
        />
        <StatCard
          title="الدروس المكتملة"
          value={report?.summary?.completedLessons ?? 0}
          hint="عدد الدروس المكتملة حتى الآن"
        />
      </div>

      <section className="rounded-2xl bg-surface-default shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">المواعيد القادمة</h2>
          <div className="text-sm text-ink-500">{upcoming.length} عناصر</div>
        </div>

        <div className="space-y-4">
          {upcoming.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-surface-default shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">تنبيهات عاجلة</h2>
          <div className="text-sm text-ink-500">{alerts.length} تنبيه</div>
        </div>

        <div className="flex flex-col gap-3">
          {alerts.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Badge variant={a.type === 'danger' ? 'danger' : 'info'} className="min-w-[56px]">
                  {a.type === 'danger' ? 'عاجل' : 'معلومة'}
                </Badge>
                <div className="text-sm text-ink-800">{a.text}</div>
              </div>
              <div>
                {/* FIX: Button has no "xs" size (only sm/md/lg) */}
                <Button variant="ghost" size="sm">عرض</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}