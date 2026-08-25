// src/pages/public/RegisterPage.jsx
export const route = {
  path: ['/register', '/:instructorId/register'],
  index: false,
  auth: null,
  title: 'إنشاء حساب'
};

import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import RegisterForm from '../../components/forms/RegisterForm';
import { InstructorContext } from '../../contexts/InstructorContext';
import Navbar from '../../layouts/Navbar';

// Image assets configuration - easily replaceable
// @vite-ignore
const REGISTER_ASSETS = {
  illustration: new URL('../../assets/auth-register-illustration.png', import.meta.url).href
};

export default function RegisterPage() {
  const { instructorId } = useParams();
  const { selected: instructor } = useContext(InstructorContext) || {};

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      <Navbar />

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Decorative panel - Hidden on mobile, visible on desktop/tablet */}
        <aside className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center bg-gradient-to-br from-brand-100 to-surface-muted overflow-hidden p-8">
          <div className="w-full max-w-md space-y-6 text-right">
            <div className="relative">
              <div className="w-full aspect-square bg-surface-default rounded-3xl shadow-lg flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 400 400" fill="none" className="w-full h-full text-brand-500">
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.1 }} />
                    </linearGradient>
                  </defs>
                  <circle cx="200" cy="200" r="180" fill="url(#grad)" />
                  <g opacity="0.4">
                    <circle cx="150" cy="140" r="35" fill="currentColor" />
                    <path d="M 100 220 Q 100 180 150 180 Q 200 180 200 220 L 200 260" fill="currentColor" />
                    <circle cx="270" cy="140" r="35" fill="currentColor" />
                    <path d="M 220 220 Q 220 180 270 180 Q 320 220 320 220 L 320 260" fill="currentColor" />
                    <path d="M 150 280 L 150 320 M 270 280 L 270 320" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </g>
                  <path d="M 200 100 L 280 160 L 240 240 L 160 240 L 120 160 Z" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-ink-900">انضم الآن</h2>
              <p className="text-sm text-ink-600 leading-relaxed">
                ابدأ رحلتك التعليمية مع أفضل المحتوى والمعلمين المتخصصين.
              </p>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="text-right mb-8">
              <h1 className="text-3xl font-bold text-ink-900">إنشاء حساب</h1>
              <p className="text-sm text-ink-500 mt-2">
                {instructor?.name ? `${instructor.name} — ابدأ رحلتك الآن` : 'ابدأ رحلتك التعليمية معنا'}
              </p>
            </div>

            <div className="bg-surface-default rounded-3xl shadow-card p-6 sm:p-8">
              <RegisterForm instructorId={instructorId} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
