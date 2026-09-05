// src/pages/student/StudentDashboard.jsx
export const route = {
  path: '/:instructorId/dashboard',
  index: false,
  auth: 'required',
  roles: ['student'],
  title: 'لوحة الطالب',
};

import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ThemeContext } from '../../contexts/ThemeProvider';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function StudentDashboard() {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [copied, setCopied] = useState(false);

  const walletBalance = user?.walletBalance ?? 0;
  const parentAccessCode = user?.parentAccessCode || null;

  const handleCopyCode = async () => {
    if (!parentAccessCode) return;
    try {
      await navigator.clipboard.writeText(parentAccessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable; fail silently
    }
  };

  return (
    <div dir="rtl" className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatarUrl || user?.avatar} name={user?.name} size="md" />
          <div>
            <div className="text-lg font-semibold text-ink-900">
              مرحباً {user?.name || 'الطالب'}
            </div>
            <div className="text-sm text-ink-500">لوحة الطالب</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="brand">المحفظة: {walletBalance} ج.م</Badge>
          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? 'وضع فاتح' : 'وضع داكن'}
          </Button>
        </div>
      </div>

      {/* Enrolled courses */}
      <section id="current-courses" className="scroll-mt-24 rounded-[var(--radius-xl)] border border-surface-border bg-surface-default p-5 shadow-card sm:p-6">
        <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-brand-600">تابع تقدّمك</p><h2 className="mt-1 text-xl font-extrabold text-ink-900">دوراتي الحالية</h2></div><Button variant="subtle" size="sm" onClick={() => navigate(`/${instructorId}/catalog`)}>استكشف الكورسات</Button></div>
        <div className="rounded-2xl bg-surface-muted p-6 text-center text-sm text-ink-500">
          ستظهر دوراتك المسجّل بها هنا عند إتاحة بياناتها من الخادم.
        </div>
      </section>

      {/* Parent access code */}
      <section id="parent-access-code" className="bg-surface-default rounded-2xl shadow-card p-6 scroll-mt-24">
        <h2 className="text-lg font-semibold text-ink-900 mb-2">كود ربط ولي الأمر</h2>
        <p className="text-sm text-ink-500 mb-4">
          شارك هذا الكود مع ولي أمرك لربط حسابه بحسابك عند التسجيل
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 px-4 py-2 rounded-lg bg-surface-muted font-mono text-ink-900 text-sm">
            {parentAccessCode || 'الكود غير متاح حالياً، حاول تحديث الصفحة'}
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopyCode} disabled={!parentAccessCode}>
            {copied ? 'تم النسخ' : 'نسخ'}
          </Button>
        </div>
      </section>

      {/* Quick links */}
      <section className="flex items-center gap-3 flex-wrap">
        <Button variant="subtle" onClick={() => navigate(`/${instructorId}/leaderboard`)}>
          لوحة الشرف
        </Button>
        <Button variant="subtle" onClick={() => navigate(`/${instructorId}/reels`)}>
          الفيديوهات القصيرة
        </Button>
      </section>
    </div>
  );
}
