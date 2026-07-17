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

const MOCK_PARENT_ACCESS_CODE = 'PARENT-7X4K9Q';

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

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_PARENT_ACCESS_CODE);
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
          <Avatar src={user?.avatar} name={user?.name} size="md" />
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
      <section>
        <h2 className="text-lg font-semibold text-ink-900 mb-4">دوراتي</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_ENROLLED_COURSES.map((course) => {
            const remainingDays = daysLeft(course.accessExpiresAt);
            return (
              <div key={course.id} className="bg-surface-default rounded-2xl shadow-card p-4 flex flex-col gap-3">
                <div className="w-full h-32 rounded-lg overflow-hidden bg-surface-muted">
                  <img
                    src={course.thumbnailUrl || '/src/assets/vite.svg'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-semibold text-ink-900 truncate">{course.title}</h3>

                <div>
                  <div className="w-full h-2 rounded-full bg-surface-muted overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-ink-500 mt-1">{course.progressPercent}% مكتمل</div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="info">متبقي {course.viewsRemaining} مشاهدات</Badge>
                  <Badge variant={remainingDays <= 2 ? 'danger' : 'neutral'}>
                    {remainingDays} يوم متبقي
                  </Badge>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/${instructorId}/player/${course.id}`)}
                >
                  استمرار
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Parent access code */}
      <section className="bg-surface-default rounded-2xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-2">كود ربط ولي الأمر</h2>
        <p className="text-sm text-ink-500 mb-4">
          شارك هذا الكود مع ولي أمرك لربط حسابه بحسابك عند التسجيل
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 px-4 py-2 rounded-lg bg-surface-muted font-mono text-ink-900 text-sm">
            {MOCK_PARENT_ACCESS_CODE}
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopyCode}>
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