// src/pages/public/InstructorSelectorPage.jsx
export const route = {
  path: '/',
  index: true,
  auth: null,
  title: 'اختر المدرس'
};

import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { InstructorContext } from '../../contexts/InstructorContext';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import heroImg from '../../assets/hero.png';

export default function InstructorSelectorPage() {
  const navigate = useNavigate();
  const ctx = useContext(InstructorContext) || {};
  const {
    instructors = [],
    loading = false,
    selectInstructor = () => {},
    fetchInstructors = null
  } = ctx;

  const handleSelect = (ins) => {
    const id = ins?.id || ins?._id || ins?.name;
    if (!id) return;
    try {
      selectInstructor(ins);
    } catch {
      // ignore
    }
    navigate(`/${id}/stages`);
  };

  const retry = () => {
    if (typeof fetchInstructors === 'function') {
      fetchInstructors();
    }
  };

  const skeletons = useMemo(() => Array.from({ length: 6 }), []);

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      {/* Hero */}
      <header
        className="w-full h-56 md:h-72 lg:h-80 flex items-center"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="w-full h-full bg-black/40 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-right">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">منصة التعليم</h1>
              <p className="mt-2 text-sm md:text-base text-white/90">اختر مدرسك وابدأ رحلة التعلم الآن مع محتوى منسق ومتابعة دقيقة</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skeletons.map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-muted rounded-2xl h-40" />
            ))}
          </div>
        ) : instructors && instructors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((ins) => {
              const id = ins?.id || ins?._id || ins?.name;
              return (
                <button
                  key={id}
                  onClick={() => handleSelect(ins)}
                  className="text-right bg-surface-default rounded-2xl shadow-card p-4 flex flex-col items-stretch hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <Avatar src={ins.avatar} name={ins.name} size="lg" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-lg font-semibold text-ink-900">{ins.name}</div>
                        {ins.subject && <Badge className="text-xs">{ins.subject}</Badge>}
                      </div>
                      <div className="mt-2 text-sm text-ink-700 line-clamp-2 overflow-hidden" style={{ WebkitLineClamp: 2 }}>
                        {ins.tagline || ins.bio || 'مدرس متخصص يقدم محتوى متميز ومتابعة شخصية.'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-ink-500">{ins.location || ''}</div>
                    <div>
                      <span className="text-sm text-ink-600">عرض المسارات</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-surface-default shadow-card p-8 text-center">
            <div className="text-ink-800 text-lg font-semibold">لا يوجد مدرسون متاحون حالياً</div>
            <div className="text-ink-600 mt-2">حاول إعادة المحاولة لاحقًا أو تواصل مع الدعم للحصول على مساعدة.</div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button variant="primary" onClick={retry}>إعادة المحاولة</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
