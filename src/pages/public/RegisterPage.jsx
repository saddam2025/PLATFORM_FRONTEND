// src/pages/public/RegisterPage.jsx
// NOTE: No changes needed here — this file was already correct against the spec
// (uses InstructorContext for header, passes instructorId down to RegisterForm).
// Kept as-is; the bugs were all inside RegisterForm.jsx.
export const route = {
  path: '/:instructorId/register',
  index: false,
  auth: null,
  title: 'إنشاء حساب'
};

import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import RegisterForm from '../../components/forms/RegisterForm';
import { InstructorContext } from '../../contexts/InstructorContext';
import Avatar from '../../components/ui/Avatar';

export default function RegisterPage() {
  const { instructorId } = useParams();
  const { selected: instructor } = useContext(InstructorContext) || {};

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      <header className="bg-surface-default border-b border-surface-border">
        <div className="container mx-auto px-4 py-6 flex items-center gap-4">
          <Avatar src={instructor?.avatar} name={instructor?.name || 'المدرس'} size="md" />
          <div className="text-right">
            <h1 className="text-2xl font-semibold">إنشاء حساب جديد</h1>
            <p className="text-sm text-ink-500 mt-1">
              {instructor?.name ? `${instructor.name} — إنشاء حساب جديد` : 'إنشاء حساب جديد'}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <RegisterForm instructorId={instructorId} />
        </div>
      </main>
    </div>
  );
}