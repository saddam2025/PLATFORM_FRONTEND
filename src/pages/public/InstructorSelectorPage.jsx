// src/pages/public/InstructorSelectorPage.jsx
export const route = {
  path: '/',
  index: true,
  auth: null,
  title: 'اختر المدرس'
};

import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InstructorContext } from '../../contexts/InstructorContext';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';
import CourseCard from '../../components/common/CourseCard.jsx';
import Footer from '../../components/common/Footer';
import { landingAssets, landingTeachers, landingCourses, landingFeatures } from '../../mocks/landingMockData';
import Navbar from '../../layouts/Navbar';

export default function InstructorSelectorPage() {
  const navigate = useNavigate();
  const { instructors = [], selectInstructor = () => {} } = useContext(InstructorContext) || {};
  const teachersRef = useRef(null);

  const handleSelect = (ins) => {
    const id = ins?.id || ins?._id || ins?.name;
    if (!id) return;
    try {
      selectInstructor(ins);
    } catch {}
    navigate(`/${id}`);
  };

  const scrollToTeachers = () => {
    if (teachersRef.current) {
      teachersRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openLogin = () => navigate('/login');

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      {/* HERO */}
      <header
        className="relative overflow-hidden bg-surface-default"
        style={{ backgroundImage: `url(${landingAssets.hero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative">
          <Navbar />

          <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="max-w-3xl text-right">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">منصة التعليم الذكي</span>
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">اتعلم الرياضيات بطريقة أبسط مع رياضياتي</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">انضم لمجموعة من المدرسين المتميزين، اختر مسارك وتعامل مع محتوى منسق يساعدك على التفوق.</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button variant="primary" size="lg" onClick={openLogin}>ابدأ رحلتك الآن</Button>
                <Button variant="primary" size="lg" onClick={scrollToTeachers}>تصفح المعلمين</Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* TEACHERS */}
        <section ref={teachersRef} className="text-right mb-12">
          <div className="mb-6 max-w-3xl">
            <h2 className="text-2xl font-semibold text-ink-900">المدرسين عندنا مش زي أي مدرسين</h2>
            <p className="mt-2 text-sm text-ink-600">تعلم مع خبراء في مجال الرياضيات مستعدين لمساعدتك في تحقيق أهدافك.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {landingTeachers.map((teacher) => (
              <article key={teacher.id} className="overflow-hidden rounded-3xl border border-surface-border bg-surface-default p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <Avatar src={teacher.avatar} name={teacher.name} size="lg" />
                  <div className="min-w-0 text-right">
                    <div className="text-lg font-semibold text-ink-900">{teacher.name}</div>
                    <div className="mt-1 text-sm text-ink-600">{teacher.stage}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge variant="brand">{teacher.subject}</Badge>
                  <span className="text-xs text-ink-500">{teacher.rating} ★</span>
                  <span className="text-xs text-ink-500">{teacher.studentsCount} طالب</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-ink-700">{teacher.bio}</p>
                <div className="mt-4 flex gap-3">
                  <Button variant="primary" onClick={() => handleSelect(teacher)}>عرض المدرس</Button>
                  <Button variant="ghost" onClick={() => navigate(`/${teacher.id}/stages`)}>عرض المسارات</Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mb-12">
          <div className="how-head text-center mb-8">
            <h2 className="text-2xl font-semibold">إزاي رياضياتي بتشتغل؟</h2>
            <p className="mt-2 text-sm text-ink-600">خطوات بسيطة عشان تبدأ وتتقدم مع مدرسين متميزين ومحتوى منسق.</p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {landingFeatures.map((f) => (
                <article
                  key={f.id}
                  className="relative rounded-2xl border border-surface-border bg-surface-default p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:translate-y-0"
                  tabIndex={0}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-surface-muted flex items-center justify-center text-lg">{f.icon}</div>
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="text-lg font-semibold text-ink-900">{f.title}</h3>
                      <p className="mt-2 text-sm text-ink-600">{f.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 text-4xl font-extrabold text-ink-900 opacity-90">{f.number}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED COURSES */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-ink-900">كورسات مختارة مخصوصة ليك</h2>
              <p className="mt-2 text-sm text-ink-600">كورسات مميزة مختارة لمستواك ومرحلتك.</p>
            </div>
            <div>
              <Button variant="subtle" onClick={() => navigate(`/${landingTeachers[0]?.id || 'teacher-1'}/catalog`)}>عرض الكل</Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {landingCourses.slice(0,4).map((course) => (
              <CourseCard key={course.id} course={course} onOpen={() => navigate(`/${course.instructorId}/courses/${course.id}`)} onEnroll={() => navigate(`/${course.instructorId}/checkout/${course.id}`)} />
            ))}
          </div>
        </section>

        {/* COURSES CAROUSEL */}
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">محاضرات موصى بها</h3>
          </div>
          <div className="carousel-wrap">
            <div className="carousel-track flex gap-4 overflow-x-auto py-2">
              {landingCourses.map((c) => (
                <div key={c.id} style={{minWidth: 280}}>
                  <CourseCard course={c} onOpen={() => navigate(`/${c.instructorId}/courses/${c.id}`)} onEnroll={() => navigate(`/${c.instructorId}/checkout/${c.id}`)} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <div className="cta-banner">
            <div>
              <h2 className="text-2xl font-semibold">ابدأ رحلتك التعليمية الآن</h2>
              <p className="mt-3 text-sm text-ink-600">اختر مدرسك وابدأ مسارك الدراسي مع محتوى منسق ومتابعة شخصية.</p>
                <div className="mt-6">
                <Button variant="primary" size="lg" onClick={scrollToTeachers}>تصفح المعلمين</Button>
              </div>
            </div>
            <div className="cta-media" aria-hidden>
              {/* decorative */}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
