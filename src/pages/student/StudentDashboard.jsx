// src/pages/student/StudentDashboard.jsx
export const route = {
  path: '/:instructorId/dashboard',
  index: false,
  auth: 'required',
  roles: ['student'],
  title: 'لوحة الطالب',
};

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import { resolveApiAssetUrl } from '../../services/api';
import reelService from '../../services/reelService';
import { trackReelViewOnce } from '../../services/reelViewTracking';
import { stageLabel } from '../../constants/stages';
import useEnrolledCourses from '../../hooks/useEnrolledCourses';
import MyCourseCard from '../../components/common/MyCourseCard';

export default function StudentDashboard() {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [reels, setReels] = useState([]);
  const [reelsLoading, setReelsLoading] = useState(true);
  const [reelsError, setReelsError] = useState('');
  const [videoErrors, setVideoErrors] = useState({});

  const walletBalance = user?.walletBalance ?? 0;
  const parentAccessCode = user?.parentAccessCode || null;
  const { courses: enrolledCourses, tenant, loading: coursesLoading } = useEnrolledCourses(instructorId);

  useEffect(() => {
    let active = true;
    setReelsLoading(true);
    setReelsError('');
    reelService.list(instructorId, 1, 10)
      .then((response) => {
        if (active) setReels(Array.isArray(response?.data?.data) ? response.data.data : []);
      })
      .catch((error) => {
        if (active) setReelsError(error?.message || 'تعذر تحميل الريلز.');
      })
      .finally(() => { if (active) setReelsLoading(false); });
    return () => { active = false; };
  }, [instructorId]);

  const handleReelPlay = async (reelId) => {
    try {
      await trackReelViewOnce(reelId);
    } catch {
      // A view tracking failure must not interrupt video playback.
    }
  };

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
          <Button variant="subtle" size="sm" onClick={() => navigate(`/${instructorId}/wallet`)}>محفظتي: {walletBalance} ج.م</Button>
        </div>
      </div>

      {/* Enrolled courses */}
      <section id="current-courses" className="scroll-mt-24 rounded-[var(--radius-xl)] border border-surface-border bg-surface-default p-5 shadow-card sm:p-6">
        <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-brand-600">تابع تقدّمك</p><h2 className="mt-1 text-xl font-extrabold text-ink-900">كورساتي</h2></div><Button variant="subtle" size="sm" onClick={() => navigate(`/${instructorId}/my-courses`)}>عرض كل الكورسات</Button></div>
        {coursesLoading ? <div className="rounded-2xl bg-surface-muted p-6 text-center text-sm text-ink-500">جارٍ تحميل كورساتي...</div> : enrolledCourses.length === 0 ? <div className="rounded-2xl bg-surface-muted p-6 text-center text-sm text-ink-500">لا توجد كورسات في قائمتك حتى الآن.</div> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">{enrolledCourses.slice(0, 4).map((enrollment) => <MyCourseCard key={enrollment.course._id} enrollment={enrollment} instructorId={instructorId} tenant={tenant} />)}</div>}
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

      {/* Dashboard reels */}
      <section aria-labelledby="dashboard-reels-title" className="rounded-[var(--radius-xl)] border border-surface-border bg-surface-default p-5 shadow-card sm:p-6">
        <div className="mb-5"><p className="text-sm font-semibold text-brand-600">مقاطع جديدة</p><h2 id="dashboard-reels-title" className="mt-1 text-xl font-extrabold text-ink-900">ريلز</h2></div>
        {reelsLoading ? <div className="rounded-2xl bg-surface-muted p-4 text-center text-sm text-ink-500">جارٍ تحميل الريلز...</div>
          : reelsError ? <div role="alert" className="rounded-2xl bg-surface-muted p-4 text-center text-sm text-ink-500">{reelsError}</div>
            : reels.length === 0 ? <div className="rounded-2xl bg-surface-muted p-6 text-center text-sm text-ink-500">لا توجد ريلز حتى الآن</div>
              : <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2" aria-label="أحدث الريلز">
                {reels.map((reel) => <article key={reel._id} className="w-[min(72vw,18rem)] shrink-0 snap-start overflow-hidden rounded-2xl bg-navy-900 shadow-panel">
                  <div className="aspect-[9/16] w-full bg-black">
                    <video className="h-full w-full object-cover" controls playsInline preload="metadata" src={resolveApiAssetUrl(reel.videoUrl)} onPlay={() => handleReelPlay(reel._id)} onError={() => setVideoErrors((current) => ({ ...current, [reel._id]: true }))}>
                      متصفحك لا يدعم تشغيل الفيديو.
                    </video>
                  </div>
                  {(reel.caption || reel.stage || videoErrors[reel._id]) && <div className="p-3 text-white">
                    {reel.caption && <p className="leading-6">{reel.caption}</p>}
                    {reel.stage && <p className="mt-2 text-xs text-white/65">{stageLabel(reel.stage)}</p>}
                    {videoErrors[reel._id] && <p role="alert" className="mt-2 text-sm text-danger-DEFAULT">تعذر تشغيل هذا الفيديو.</p>}
                  </div>}
                </article>)}
              </div>}
      </section>
    </div>
  );
}
