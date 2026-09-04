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

const MOCK_ENROLLED_COURSES = [
  {
    id: 'course-101',
    title: 'أساسيات الجبر',
    thumbnailUrl: null,
    progressPercent: 65,
    accessExpiresAt: '2026-07-27T00:00:00Z',
    viewsRemaining: 4,
  },
  {
    id: 'course-102',
    title: 'الهندسة المستوية',
    thumbnailUrl: null,
    progressPercent: 30,
    accessExpiresAt: '2026-07-22T00:00:00Z',
    viewsRemaining: 7,
  },
  {
    id: 'course-103',
    title: 'التفاضل والتكامل',
    thumbnailUrl: null,
    progressPercent: 100,
    accessExpiresAt: '2026-08-01T00:00:00Z',
    viewsRemaining: 1,
  },
];

function daysLeft(dateString) {
  const diff = Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

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
      <section className="rounded-[var(--radius-xl)] border border-surface-border bg-surface-default p-5 shadow-card sm:p-6">
        <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-brand-600">تابع تقدّمك</p><h2 className="mt-1 text-xl font-extrabold text-ink-900">دوراتي الحالية</h2></div><Button variant="subtle" size="sm" onClick={() => navigate(`/${instructorId}/catalog`)}>استكشف الكورسات</Button></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_ENROLLED_COURSES.map((course) => {
            const remainingDays = daysLeft(course.accessExpiresAt);
            return (
              <div key={course.id} className="group overflow-hidden rounded-[var(--radius-md)] border border-surface-border bg-surface-default p-3 transition hover:-translate-y-1 hover:shadow-soft">
                <div className="relative h-32 w-full overflow-hidden rounded-xl bg-surface-muted">
                  <img
                    src={course.thumbnailUrl || '/src/assets/vite.svg'}
                    alt={course.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 right-2 rounded-lg bg-navy-900/85 px-2 py-1 text-xs font-bold text-white">{course.progressPercent}% مكتمل</span>
                </div>
                <div className="space-y-3 p-1 pt-4"><h3 className="font-bold text-ink-900 truncate">{course.title}</h3><div>
                  <div className="w-full h-2 rounded-full bg-surface-muted overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-ink-500">استمر، أنت على الطريق الصحيح</div></div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="info">متبقي {course.viewsRemaining} مشاهدات</Badge>
                  <Badge variant={remainingDays <= 2 ? 'danger' : 'neutral'}>
                    {remainingDays} يوم متبقي
                  </Badge>
                </div>

                <Button className="w-full"
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/${instructorId}/courses/${course.id}/learn`)}
                >
                  استمرار
                </Button></div>
              </div>
            );
          })}
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