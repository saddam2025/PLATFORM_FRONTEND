// src/pages/public/LoginPage.jsx
export const route = {
  path: ['/login', '/:instructorId/login'],
  index: false,
  auth: 'guest',
  title: 'تسجيل الدخول'
};

import React from 'react';
import { useParams } from 'react-router-dom';
import LoginForm from '../../components/forms/LoginForm';
import Navbar from '../../layouts/Navbar';

// Image assets configuration - easily replaceable
// @vite-ignore
const LOGIN_ASSETS = {
  illustration: new URL('../../assets/auth-login-illustration.png', import.meta.url).href
};

export default function LoginPage() {
  const { instructorId } = useParams();

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
                  <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="2" opacity="0.1" />
                  <g opacity="0.2">
                    <circle cx="200" cy="180" r="40" fill="currentColor" />
                    <path d="M 140 260 Q 140 220 200 220 Q 260 220 260 260" fill="currentColor" />
                    <path d="M 200 260 L 200 320 M 160 280 L 160 320 M 240 280 L 240 320 M 140 180 Q 100 180 100 140" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </g>
                  <path d="M 200 80 L 280 160 L 200 240 L 120 160 Z" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-ink-900">اتعلم بذكاء</h2>
              <p className="text-sm text-ink-600 leading-relaxed">
                منصتنا توفر لك تجربة تعليمية شاملة مع محتوى متخصص وتفاعلي.
              </p>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="text-right mb-8">
              <h1 className="text-3xl font-bold text-ink-900">تسجيل الدخول</h1>
              <p className="text-sm text-ink-500 mt-2">أدخل بياناتك للوصول إلى حسابك</p>
            </div>

            <div className="bg-surface-default rounded-3xl shadow-card p-6 sm:p-8">
              <LoginForm instructorId={instructorId} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}