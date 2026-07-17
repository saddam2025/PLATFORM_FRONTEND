// src/pages/public/LoginPage.jsx
export const route = {
  path: '/:instructorId/login',
  index: false,
  auth: 'guest',
  title: 'تسجيل الدخول'
};

import React from 'react';
import { useParams } from 'react-router-dom';
import LoginForm from '../../components/forms/LoginForm';

export default function LoginPage() {
  const { instructorId } = useParams();
  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900 flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-md bg-surface-default rounded-2xl shadow-card p-6">
        <div className="text-right mb-6">
          <h1 className="text-2xl font-semibold">تسجيل الدخول</h1>
          <p className="text-sm text-ink-500 mt-1">أدخل بياناتك للوصول إلى حسابك</p>
        </div>

        <LoginForm instructorId={instructorId} />
      </div>
    </div>
  );
}