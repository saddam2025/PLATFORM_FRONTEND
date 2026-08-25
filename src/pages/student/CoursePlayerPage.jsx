// src/pages/student/CoursePlayerPage.jsx
export const route = {
  path: '/:instructorId/courses/:courseId/learn',
  index: false,
  auth: 'student',
  title: 'مشغل الدورة'
};

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
// FIX: was importing from '../../contexts/AuthContext' — file doesn't exist,
// and even AuthProvider.jsx has no named useAuth export. Real hook lives at hooks/useAuth.
import { useAuth } from '../../hooks/useAuth';

function formatDaysRemaining(iso) {
  try {
    const now = new Date();
    const d = new Date(iso);
    const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  } catch {
    return 0;
  }
}

export default function CoursePlayerPage() {
  const { instructorId, courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth() || { user: { name: 'طالب', id: 'unknown' } };

  const access = useMemo(
    () => ({
      expiresAt: '2026-07-25T00:00:00Z',
      maxViews: 10,
      viewsUsed: 3
    }),
    []
  );

  const isExpired = useMemo(() => new Date() > new Date(access.expiresAt), [access]);
  const isLimitReached = useMemo(() => access.viewsUsed >= access.maxViews, [access]);
  const remainingViews = Math.max(0, access.maxViews - access.viewsUsed);
  const daysRemaining = formatDaysRemaining(access.expiresAt);

  const items = useMemo(
    () => [
      { id: 'l1', type: 'lesson', title: 'المحاضرة 1: أساسيات', homeworkDone: true, quizPassed: true },
      { id: 'l2', type: 'lesson', title: 'المحاضرة 2: تطبيقات', homeworkDone: false, quizPassed: false },
      { id: 'q1', type: 'quiz', title: 'اختبار قصير 1', homeworkDone: false, quizPassed: false },
      { id: 'l3', type: 'lesson', title: 'المحاضرة 3: مسائل', homeworkDone: false, quizPassed: false },
      { id: 'a1', type: 'assignment', title: 'واجب 1', homeworkDone: false, quizPassed: false }
    ],
    []
  );

  const computed = useMemo(() => {
    return items.map((it, idx) => {
      if (idx === 0) return { ...it, locked: false };
      const prev = items[idx - 1];
      const locked = !(prev.homeworkDone && prev.quizPassed);
      return { ...it, locked };
    });
  }, [items]);

  const [wmStyle, setWmStyle] = useState({ top: '10%', left: '10%' });
  const wmRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    function randomPercent(min = 5, max = 85) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function moveOnce() {
      if (!mounted) return;
      const top = `${randomPercent(8, 80)}%`;
      const left = `${randomPercent(8, 90)}%`;
      setWmStyle({ top, left });
      const next = Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000;
      timerRef.current = setTimeout(moveOnce, next);
    }

    timerRef.current = setTimeout(moveOnce, 800);

    return () => {
      mounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const videoSrc = '/media/mock-course-video.mp4';

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@riyadiaty.example.com';
  };

  const goToAssignment = () => {
    navigate(`/${instructorId}/courses/${courseId}/assignments/a1`);
  };

  const goToQuiz = () => {
    navigate(`/${instructorId}/courses/${courseId}/quizzes/quiz-1`);
  };

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Playlist */}
        <aside className="lg:col-span-1 order-2 lg:order-1">
          <div className="rounded-3xl bg-surface-default shadow-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-brand-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M4 5h16M4 12h16M4 19h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="text-sm font-bold text-ink-900">محتوى الدورة</div>
              </div>
              <div className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-ink-500">{items.length} عناصر</div>
            </div>

            <div className="space-y-2.5">
              {computed.map((it, idx) => (
                <div
                  key={it.id}
                  className={`flex items-center justify-between gap-3 rounded-2xl border p-3 transition-colors ${
                    it.locked
                      ? 'border-transparent bg-surface-muted/50 text-ink-400'
                      : idx === 0
                        ? 'border-accent/40 bg-accent/8 cursor-pointer'
                        : 'border-surface-border bg-surface-default hover:bg-surface-muted/50 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (it.locked) return;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        it.locked ? 'bg-surface-muted text-ink-400' : 'bg-brand-500/12 text-brand-600'
                      }`}
                    >
                      {it.type === 'lesson' && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {it.type === 'quiz' && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M9 11l3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      )}
                      {it.type === 'assignment' && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M5 4h14v16l-7-3-7 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-ink-900">{it.title}</div>
                      <div className="text-xs text-ink-500">نوع: {it.type}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {it.locked ? (
                      <div className="flex items-center gap-1 text-xs text-ink-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M12 17v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        مقفل
                      </div>
                    ) : (
                      <Badge className="text-xs">متاح</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Player */}
        <section className="lg:col-span-3 order-1 lg:order-2 space-y-5">
          <div className="rounded-3xl bg-surface-default shadow-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={null} name={user?.name || 'طالب'} size="sm" />
                <div>
                  <div className="text-sm font-bold text-ink-900">مشاهدة المحاضرة</div>
                  <div className="text-xs text-ink-500">{user?.name || 'طالب'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isExpired && !isLimitReached && (
                  <>
                    <Badge variant="info" className="text-xs">المشاهدات المتبقية: {remainingViews}</Badge>
                    <Badge variant="info" className="text-xs">الأيام المتبقية: {daysRemaining}</Badge>
                  </>
                )}
              </div>
            </div>

            {(isExpired || isLimitReached) ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-muted/40 py-16 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-danger-DEFAULT/10 text-danger-DEFAULT">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M6 10V8a6 6 0 1112 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="mb-2 text-lg font-bold text-ink-900">
                  {isExpired ? 'انتهت صلاحية الوصول لهذه المحاضرة' : 'لقد استنفدت عدد مرات المشاهدة المسموحة'}
                </div>
                <div className="mb-5 max-w-md text-sm text-ink-500">
                  {isExpired ? 'يرجى تجديد الاشتراك للوصول إلى هذه المحاضرة.' : 'يمكنك التواصل مع الدعم لطلب تمديد أو شراء مشاهدة إضافية.'}
                </div>
                <Button variant="primary" onClick={handleContactSupport}>تواصل مع الدعم</Button>
              </div>
            ) : (
              <>
                <div className="relative w-full overflow-hidden rounded-2xl bg-black ring-1 ring-black/40">
                  <video
                    className="w-full h-auto max-h-[60vh] bg-black"
                    controls
                    src={videoSrc}
                    preload="metadata"
                  />

                  <div
                    ref={wmRef}
                    className="pointer-events-none opacity-30 text-white text-sm whitespace-nowrap absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ top: wmStyle.top, left: wmStyle.left }}
                  >
                    {`${user?.name || 'طالب'} - ${user?.id || '---'}`}
                  </div>
                </div>
              </>
            )}
          </div>

          {!isExpired && !isLimitReached && (
            <div className="rounded-3xl bg-surface-default shadow-card p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="text-right">
                  <h1 className="font-display text-2xl font-bold text-ink-900">عنوان المحاضرة الحالية</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
                    وصف قصير للمحاضرة يوضح النقاط الأساسية والنتائج المتوقعة.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {/* FIX: Button has no "outline" variant */}
                  <Button variant="ghost" onClick={goToAssignment}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M5 4h14v16l-7-3-7 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                    الواجب
                  </Button>
                  <Button variant="primary" onClick={goToQuiz}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M9 11l3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                    الاختبار
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
