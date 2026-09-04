// src/pages/student/CoursePlayerPage.jsx
export const route = {
  path: '/:instructorId/courses/:courseId/learn',
  index: false,
  auth: 'student',
  title: 'مشغل الدورة'
};

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import api, { resolveApiAssetUrl } from '../../services/api';
import courseService from '../../services/courseService';

export default function CoursePlayerPage() {
  const { instructorId, courseId } = useParams();
  const { user } = useAuth();
  const videoRef = useRef(null);
  const sessionSecondsRef = useRef(0);
  const lastPlayedAtRef = useRef(null);
  const lastSavedAtRef = useRef(0);
  const [course, setCourse] = useState(null);
  const [access, setAccess] = useState(null);
  const [resumeSeconds, setResumeSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [progressError, setProgressError] = useState('');
  const [watermarkPosition, setWatermarkPosition] = useState({ top: '10%', left: '10%' });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    setProgressError('');
    setCourse(null);
    setAccess(null);
    setResumeSeconds(0);
    sessionSecondsRef.current = 0;
    lastPlayedAtRef.current = null;
    lastSavedAtRef.current = 0;

    const loadPlayer = async () => {
      try {
        // start-view is the authoritative access gate. Do not fetch/render a
        // playable source until it has granted this viewing session.
        const accessResponse = await api.post(`/courses/${courseId}/start-view`);
        const [courseResponse, progressResponse] = await Promise.all([
          courseService.get(instructorId, courseId),
          api.get(`/courses/${courseId}/watch-progress`)
        ]);

        if (!active) return;
        setAccess(accessResponse?.data?.data || null);
        setCourse(courseResponse?.data?.data || null);
        setResumeSeconds(Number(progressResponse?.data?.data?.watchedSeconds) || 0);
      } catch (error) {
        if (active) setLoadError(error?.message || 'تعذر التحقق من صلاحية مشاهدة هذه المحاضرة.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPlayer();
    return () => { active = false; };
  }, [courseId, instructorId]);

  useEffect(() => {
    const moveWatermark = () => {
      setWatermarkPosition({
        top: `${Math.floor(Math.random() * 72) + 8}%`,
        left: `${Math.floor(Math.random() * 82) + 8}%`
      });
    };
    const interval = window.setInterval(moveWatermark, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const saveProgress = async () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.currentTime)) return;

    const activeSessionSeconds = sessionSecondsRef.current + (lastPlayedAtRef.current
      ? (Date.now() - lastPlayedAtRef.current) / 1000
      : 0);

    try {
      await api.patch(`/courses/${courseId}/watch-progress`, {
        watchedSeconds: video.currentTime,
        sessionSeconds: Math.max(0, Math.round(activeSessionSeconds)),
        totalDurationSeconds: Number.isFinite(video.duration) ? video.duration : 0
      });
      lastSavedAtRef.current = video.currentTime;
      setProgressError('');
    } catch (error) {
      setProgressError(error?.message || 'تعذر حفظ تقدم المشاهدة.');
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || !resumeSeconds || resumeSeconds >= video.duration) return;
    video.currentTime = resumeSeconds;
  };

  const handlePlay = () => {
    if (!lastPlayedAtRef.current) lastPlayedAtRef.current = Date.now();
  };

  const handlePause = () => {
    if (lastPlayedAtRef.current) {
      sessionSecondsRef.current += (Date.now() - lastPlayedAtRef.current) / 1000;
      lastPlayedAtRef.current = null;
    }
    void saveProgress();
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.currentTime - lastSavedAtRef.current >= 15) void saveProgress();
  };

  const videoUrl = resolveApiAssetUrl(course?.videoUrl || access?.videoUrl);
  const title = course?.title_ar || course?.title_en || 'المحاضرة';
  const watermark = access?.watermark || { name: user?.name || 'طالب', studentId: user?.id || '---' };

  if (loading) {
    return <div dir="rtl" className="container mx-auto px-4 py-8 text-center text-sm text-ink-500">جارٍ التحقق من صلاحية المشاهدة...</div>;
  }

  if (loadError || !access || !videoUrl) {
    return (
      <div dir="rtl" className="container mx-auto max-w-2xl px-4 py-8">
        <section role="alert" className="rounded-2xl bg-danger-soft p-6 text-center">
          <h1 className="text-xl font-semibold text-danger-DEFAULT">تعذر تشغيل المحاضرة</h1>
          <p className="mt-2 text-sm text-danger-DEFAULT">{loadError || 'لا يتوفر ملف فيديو لهذه المحاضرة.'}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      <main className="container mx-auto max-w-5xl px-4 py-6 space-y-5">
        <section className="rounded-3xl bg-surface-default shadow-card p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar src={null} name={watermark.name} size="sm" />
              <div>
                <h1 className="text-lg font-bold text-ink-900">{title}</h1>
                <p className="text-xs text-ink-500">{watermark.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="info" className="text-xs">المشاهدات المتبقية: {access.viewsRemaining}</Badge>
              <Badge variant="info" className="text-xs">الأيام المتبقية: {access.daysRemaining}</Badge>
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl bg-black ring-1 ring-black/40">
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[60vh] bg-black"
              controls
              src={videoUrl}
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handlePause}
              onTimeUpdate={handleTimeUpdate}
            />
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-sm text-white opacity-30"
              style={watermarkPosition}
            >
              {`${watermark.name} - ${watermark.studentId}`}
            </div>
          </div>

          {progressError && <p role="alert" className="mt-3 text-sm text-danger-DEFAULT">{progressError}</p>}
        </section>

        <section className="rounded-3xl bg-surface-default shadow-card p-6 text-right">
          <h2 className="font-display text-2xl font-bold text-ink-900">{title}</h2>
          {course?.description_ar && <p className="mt-2 text-sm leading-relaxed text-ink-600">{course.description_ar}</p>}
          <div className="mt-5">
            <Button variant="ghost" onClick={() => { window.location.href = 'mailto:support@riyadiaty.example.com'; }}>
              تواصل مع الدعم
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
