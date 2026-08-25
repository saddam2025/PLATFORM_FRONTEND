// src/pages/admin/ExportStudentsPage.jsx
export const route = {
  path: '/:instructorId/admin/students/export',
  index: false,
  auth: 'admin',
  title: 'تصدير بيانات الطلاب'
};

import React, { useMemo, useState } from 'react';
import Avatar from '../../components/ui/Avatar';
import { adminStudents } from '../../mocks/adminMockData';

const GRADES = [
  'الصف الخامس',
  'الصف السابع',
  'الصف الثامن',
  'الصف التاسع',
  'الصف العاشر',
  'الصف الحادي عشر',
  'الصف الثاني عشر'
];

const STATUS_LABELS = {
  active: 'نشط',
  expired: 'منتهي',
  'pending-exam': 'بانتظار الاختبار'
};

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  expired: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  'pending-exam': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-400/15 dark:text-yellow-300'
};

function DownloadIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 20h16" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <circle cx="11" cy="11" r="7" strokeWidth="1.75" />
      <path d="M21 21l-4.35-4.35" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

// Builds a CSV blob and triggers a browser download — no server round trip,
// since this is exporting whatever the admin currently has filtered/selected.
function downloadCsv(students) {
  const headers = ['الاسم', 'البريد الإلكتروني', 'الصف', 'حالة الاشتراك', 'متوسط الدرجات', 'آخر نشاط'];
  const rows = students.map((s) => [
    s.name,
    s.email,
    s.grade,
    STATUS_LABELS[s.subscriptionStatus] || s.subscriptionStatus,
    s.averageScore,
    formatDate(s.lastActive)
  ]);

  const escapeCell = (cell) => `"${String(cell).replace(/"/g, '""')}"`;
  const csvContent = [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n');

  // Leading BOM so Excel opens Arabic text as UTF-8 instead of mangling it.
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `students-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ExportStudentsPage() {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return adminStudents.filter((s) => {
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchesGrade = gradeFilter === 'all' || s.grade === gradeFilter;
      const matchesStatus = statusFilter === 'all' || s.subscriptionStatus === statusFilter;
      return matchesSearch && matchesGrade && matchesStatus;
    });
  }, [search, gradeFilter, statusFilter]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((s) => selectedIds.has(s.id));

  const toggleOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filtered.forEach((s) => next.delete(s.id));
      } else {
        filtered.forEach((s) => next.add(s.id));
      }
      return next;
    });
  };

  const handleExport = () => {
    const toExport = selectedIds.size > 0 ? filtered.filter((s) => selectedIds.has(s.id)) : filtered;
    if (toExport.length === 0) return;
    downloadCsv(toExport);
  };

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-right">
            <h1 className="text-2xl font-semibold">تصدير بيانات الطلاب</h1>
            <p className="text-sm text-ink-600 mt-1">
              اختر الطلاب المطلوبين ثم صدّر البيانات كملف CSV
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 text-ink-900 text-sm font-semibold px-5 py-2.5 transition-colors hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DownloadIcon />
            {selectedIds.size > 0 ? `تصدير المحدد (${selectedIds.size})` : 'تصدير الكل CSV'}
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-2xl bg-surface-default border border-surface-border p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-ink-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو البريد الإلكتروني"
              className="w-full rounded-xl border border-surface-border bg-surface-canvas text-ink-900 text-right pr-9 pl-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="rounded-xl border border-surface-border bg-surface-canvas text-ink-900 text-sm px-3 py-2.5 transition-colors hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">كل الصفوف</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-surface-border bg-surface-canvas text-ink-900 text-sm px-3 py-2.5 transition-colors hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">كل حالات الاشتراك</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-surface-default border border-surface-border p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-right" dir="rtl">
              <thead>
                <tr className="text-xs text-ink-500">
                  <th className="py-3 px-3 w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleAllFiltered}
                      className="w-4 h-4 rounded border-surface-border accent-brand-500 cursor-pointer"
                      aria-label="تحديد الكل"
                    />
                  </th>
                  <th className="py-3 px-3 font-medium">الطالب</th>
                  <th className="py-3 px-3 font-medium">الصف</th>
                  <th className="py-3 px-3 font-medium">حالة الاشتراك</th>
                  <th className="py-3 px-3 font-medium">متوسط الدرجات</th>
                  <th className="py-3 px-3 font-medium">آخر نشاط</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const isSelected = selectedIds.has(s.id);
                  return (
                    <tr
                      key={s.id}
                      className={`border-t border-surface-border transition-colors cursor-default ${
                        isSelected ? 'bg-brand-50 dark:bg-brand-500/10' : 'hover:bg-surface-muted'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(s.id)}
                          className="w-4 h-4 rounded border-surface-border accent-brand-500 cursor-pointer"
                          aria-label={`تحديد ${s.name}`}
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} size="sm" />
                          <div>
                            <div className="text-sm font-medium text-ink-900 transition-colors hover:text-brand-600 dark:hover:text-brand-400">
                              {s.name}
                            </div>
                            <div className="text-xs text-ink-500">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-ink-700">{s.grade}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[s.subscriptionStatus]}`}>
                          {STATUS_LABELS[s.subscriptionStatus] || s.subscriptionStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm font-semibold text-brand-600 dark:text-brand-400">{s.averageScore}%</td>
                      <td className="py-3 px-3 text-sm text-ink-500">{formatDate(s.lastActive)}</td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-ink-500">
                      لا يوجد طلاب مطابقون لهذا البحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-sm text-ink-500 text-right">
          {filtered.length} طالب مطابق للفلاتر الحالية{selectedIds.size > 0 ? ` — ${selectedIds.size} محدد` : ''}
        </div>
      </div>
    </div>
  );
}