// src/pages/admin/AdminDashboard.jsx
export const route = {
  path: '/:instructorId/admin/dashboard',
  index: false,
  auth: 'required',
  roles: ['admin', 'teacher'],
  title: 'لوحة التحكم'
};

import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const MOCK_SUMMARY = {
  activeStudents: 1284,
  publishedCourses: 37,
  pendingAssistantTasks: 12,
  monthlyRevenue: 86450
};

const MOCK_REVENUE_TREND = [
  { label: 'يناير', value: 42000 },
  { label: 'فبراير', value: 51000 },
  { label: 'مارس', value: 47500 },
  { label: 'أبريل', value: 63000 },
  { label: 'مايو', value: 71200 },
  { label: 'يونيو', value: 86450 }
];

const MOCK_REVENUE_SOURCES = [
  { key: 'paymob', label: 'Paymob (دفع إلكتروني)', amount: 58210, variant: 'info' },
  { key: 'scratch', label: 'كروت الشحن (Scratch Cards)', amount: 28240, variant: 'success' }
];

const MOCK_STUDENTS_EXPORT = [
  { id: 'STU-1001', name: 'أحمد محمود', phone: '01012345678', stage: 'الصف الأول الثانوي', status: 'مشترك' },
  { id: 'STU-1002', name: 'سارة علي', phone: '01098765432', stage: 'الصف الثاني الثانوي', status: 'مشترك' },
  { id: 'STU-1003', name: 'يوسف كمال', phone: '01111223344', stage: 'الصف الثالث الثانوي', status: 'منتهي' },
  { id: 'STU-1004', name: 'مريم حسن', phone: '01234567890', stage: 'الصف الأول الثانوي', status: 'مشترك' },
  { id: 'STU-1005', name: 'كريم عادل', phone: '01055667788', stage: 'الصف الثاني الثانوي', status: 'موقوف' }
];

function formatCurrency(n) {
  return `${n.toLocaleString('ar-EG')} ج.م`;
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-surface-default rounded-2xl shadow-card p-5">
      <p className="text-sm text-ink-500">{label}</p>
      <p className="text-2xl font-bold text-ink-900 mt-2">{value}</p>
    </div>
  );
}

function exportStudentsCsv(students) {
  const headers = ['المعرف', 'الاسم', 'رقم الهاتف', 'المرحلة', 'الحالة'];
  const rows = students.map((s) => [s.id, s.name, s.phone, s.stage, s.status]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  // BOM so Excel opens Arabic text as UTF-8 correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `students-export-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { instructorId } = useParams();

  const maxRevenue = useMemo(
    () => Math.max(...MOCK_REVENUE_TREND.map((m) => m.value)),
    []
  );

  const totalRevenueSources = useMemo(
    () => MOCK_REVENUE_SOURCES.reduce((acc, s) => acc + s.amount, 0),
    []
  );

  const handleExportStudents = () => {
    exportStudentsCsv(MOCK_STUDENTS_EXPORT);
  };

  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">
          مرحباً {user?.name || 'المشرف'} 👋
        </h1>
        <p className="text-sm text-ink-500 mt-1">نظرة عامة على أداء المنصة</p>
      </div>

      {/* 1. Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="إجمالي الطلاب النشطين" value={MOCK_SUMMARY.activeStudents.toLocaleString('ar-EG')} />
        <SummaryCard label="الدورات المنشورة" value={MOCK_SUMMARY.publishedCourses.toLocaleString('ar-EG')} />
        <SummaryCard label="واجبات معلقة للمساعدين" value={MOCK_SUMMARY.pendingAssistantTasks.toLocaleString('ar-EG')} />
        <SummaryCard label="إجمالي الإيرادات هذا الشهر" value={formatCurrency(MOCK_SUMMARY.monthlyRevenue)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Revenue bar chart */}
        <div className="lg:col-span-2 bg-surface-default rounded-2xl shadow-card p-6">
          <h2 className="text-lg font-medium text-ink-900 mb-6">الإيرادات خلال آخر 6 أشهر</h2>
          <div className="flex items-end justify-between gap-3 h-48">
            {MOCK_REVENUE_TREND.map((m) => {
              const heightPct = Math.max(6, Math.round((m.value / maxRevenue) * 100));
              return (
                <div key={m.label} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                  <span className="text-xs text-ink-500">{formatCurrency(m.value)}</span>
                  <div
                    className="w-full bg-brand-500 rounded-t-md transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-xs text-ink-700 font-medium">{m.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Revenue by source breakdown */}
        <div className="bg-surface-default rounded-2xl shadow-card p-6">
          <h2 className="text-lg font-medium text-ink-900 mb-4">الإيرادات حسب المصدر</h2>
          <div className="space-y-4">
            {MOCK_REVENUE_SOURCES.map((source) => {
              const pct = Math.round((source.amount / totalRevenueSources) * 100);
              return (
                <div key={source.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={source.variant}>{source.label}</Badge>
                    <span className="text-sm text-ink-700 font-medium">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        source.variant === 'info' ? 'bg-info-DEFAULT' : 'bg-success-DEFAULT'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-ink-500">{formatCurrency(source.amount)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Quick actions */}
      <div className="bg-surface-default rounded-2xl shadow-card p-6">
        <h2 className="text-lg font-medium text-ink-900 mb-4">إجراءات سريعة</h2>
        <div className="flex flex-wrap gap-3">
          <Link to={`/${instructorId}/admin/courses`}>
            <Button variant="primary">إدارة الدورات</Button>
          </Link>
          <Link to={`/${instructorId}/admin/scratchcards`}>
            <Button variant="ghost">أكواد الدخول / كروت الشحن</Button>
          </Link>
          {user?.role === 'admin' && <Link to={`/${instructorId}/admin/settings`}><Button variant="ghost">الإعدادات</Button></Link>}
          <Link to={`/${instructorId}/admin/students/export`}><Button variant="ghost">تصدير بيانات الطلاب</Button></Link>
        </div>
      </div>
    </div>
  );
}
