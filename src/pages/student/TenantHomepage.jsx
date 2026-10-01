export const route = {
  path: '/:instructorId',
  index: true,
  auth: null,
  title: 'الصفحة الرئيسية'
};

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseCard from '../../components/common/CourseCard.jsx';
import Button from '../../components/ui/Button';
import AtiaIntroduction from '../../components/hero/AtiaIntroduction';
import useTenantData from '../../hooks/useTenantData.js';
import { useAuth } from '../../hooks/useAuth';
import instructorService from '../../services/instructorService';
import standaloneExamService from '../../services/standaloneExamService';
import { egyptianWhatsappUrl } from '../../utils/phone';

export default function TenantHomepage() {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const { instructorProfile, catalogCourses, loading, error } = useTenantData(instructorId);
  const { user } = useAuth() || {};
  const [exams, setExams] = useState([]);
  const [featuredLectures, setFeaturedLectures] = useState([]);
  const suggestedCourses = catalogCourses.filter((course) => course.isPublished).slice(0, 6);

  useEffect(() => {
    let active = true;
    instructorService.getFeaturedLectures(instructorId)
      .then((response) => { if (active) setFeaturedLectures(response.data || []); })
      .catch(() => { if (active) setFeaturedLectures([]); });
    return () => { active = false; };
  }, [instructorId]);

  useEffect(() => {
    let active = true;
    if (user?.role !== 'student') { setExams([]); return () => { active = false; }; }
    standaloneExamService.getAvailable()
      .then((response) => { if (active) setExams(response.data?.data || []); })
      .catch(() => { if (active) setExams([]); });
    return () => { active = false; };
  }, [user?.role]);

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="rounded-[var(--radius-xl)] bg-surface-muted p-8 sm:p-12 animate-pulse" style={{ minHeight: '240px' }} />
        <div className="space-y-4">
          <div className="h-12 rounded-2xl bg-surface-muted animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-56 rounded-2xl bg-surface-muted animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !instructorProfile) {
    return (
      <div className="rounded-[var(--radius-xl)] bg-surface-muted p-8 sm:p-12 text-center text-ink-500">
        حدث خطأ أثناء تحميل الصفحة. يرجى إعادة المحاولة لاحقًا.
      </div>
    );
  }



  const supportHref = egyptianWhatsappUrl(instructorProfile.supportPhone || '201060369537');

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[var(--radius-xl)] bg-navy-900 shadow-panel">
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 h-52 w-52 rounded-full bg-teal-DEFAULT/20 blur-3xl" />
        <div className="relative">
          <AtiaIntroduction
            showActions
            primaryLabel="استعرض الكورسات"
            secondaryLabel="تواصل مع الدعم"
            onPrimary={() => navigate(`/${instructorId}/catalog`)}
            onSecondary={() => { if (supportHref) window.open(supportHref, '_blank', 'noopener,noreferrer'); }}
          />
        </div>
      </section>

      {suggestedCourses.length > 0 && <section className="rounded-[var(--radius-xl)] border border-surface-border bg-surface-default p-6 shadow-card">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2"><h2 className="font-display text-2xl font-semibold text-ink-900">كورسات مقترحة</h2><p className="text-sm text-ink-500">اختيارات مقترحة من أحدث كورسات المنصة.</p></div>
          <Button variant="subtle" size="md" onClick={() => navigate(`/${instructorId}/catalog`)}>عرض الكل</Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{suggestedCourses.map((course) => <CourseCard key={course.id} course={course} openLabel={course.owned ? 'ادخل الكورس' : 'عرض التفاصيل'} enrollLabel="اشترك" singleAction={course.owned} onOpen={() => navigate(`/${instructorId}/courses/${course.id}`)} onEnroll={() => navigate(`/${instructorId}/checkout/${course.id}`)} status={course.hasPartialLectureAccess ? { label: `لديك وصول إلى ${course.partialLectureCount} محاضرة`, variant: 'info' } : null} />)}</div>
      </section>}

      {featuredLectures.length > 0 && <section className="rounded-[var(--radius-xl)] border border-surface-border bg-surface-default p-6 shadow-card">
        <div className="mb-6 space-y-2"><h2 className="font-display text-2xl font-semibold text-ink-900">محاضرات مقترحة</h2><p className="text-sm text-ink-500">محاضرات منشورة متاحة للشراء بشكل منفصل.</p></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{featuredLectures.map((lecture) => <CourseCard key={lecture.id} course={{ ...lecture, title: `${lecture.order}. ${lecture.title}`, level: 'محاضرة', levelVariant: 'info' }} showInstructor={false} meta={lecture.courseTitle ? `من دورة: ${lecture.courseTitle}` : 'محاضرة متاحة للشراء بشكل منفصل'} openLabel="عرض الكورس" enrollLabel="عرض المحاضرة" onOpen={() => navigate(`/${instructorId}/courses/${lecture.courseId}`)} onEnroll={() => navigate(`/${instructorId}/courses/${lecture.courseId}`)} />)}</div>
      </section>}

      <section className="rounded-[var(--radius-xl)] border border-surface-border bg-surface-default p-6 shadow-card">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-ink-900">الكورسات المتاحة</h2>
            <p className="text-sm text-ink-500">اختر من بين أحدث الدورات المصممة لتقوية مهاراتك الحسابية.</p>
          </div>
          <Button variant="subtle" size="md" onClick={() => navigate(`/${instructorId}/catalog`)}>
            عرض الكل
          </Button>
        </div>

        {catalogCourses.length === 0 && exams.length === 0 ? (
          <div className="rounded-2xl border border-surface-border bg-surface-muted p-10 text-center text-ink-500">
            لا توجد دورات منشورة بعد. تابعنا قريبًا للحصول على محتوى جديد.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {catalogCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                openLabel={course.owned ? 'ادخل الكورس' : 'عرض التفاصيل'}
                enrollLabel="اشترك"
                singleAction={course.owned}
                onOpen={() => navigate(`/${instructorId}/courses/${course.id}`)}
                onEnroll={() => navigate(`/${instructorId}/checkout/${course.id}`)}
                status={course.hasPartialLectureAccess ? { label: `لديك وصول إلى ${course.partialLectureCount} محاضرة`, variant: 'info' } : null}
              />
            ))}
            {exams.map((exam) => (
              <CourseCard
                key={`exam-${exam._id || exam.id}`}
                course={{ ...exam, id: exam._id || exam.id, level: 'امتحان' }}
                hidePrice
                showInstructor={false}
                meta={`${exam.durationMinutes} دقيقة`}
                openLabel="تفاصيل الامتحان"
                enrollLabel="ابدأ الامتحان الآن"
                openDisabled
                status={{ label: 'امتحان مستقل', variant: 'info' }}
                onEnroll={() => navigate(`/${instructorId}/exams/${exam._id || exam.id}/take`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
