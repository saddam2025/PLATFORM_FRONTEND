// src/components/dev/DevRoleSwitcher.jsx
//
// DEV-ONLY floating widget for previewing every role's dashboard with mock
// data, without a real backend. Renders nothing outside a dev build
// (import.meta.env.DEV is statically inlined by Vite, so the whole component
// tree below is dropped from production bundles by dead-code elimination).
//
// Mount it once, near the root, inside <AuthProvider>:
//   <AuthProvider>
//     ...
//     <DevRoleSwitcher />
//   </AuthProvider>

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { studentProfile } from '../../mocks/studentMockData';
import { assistantProfile } from '../../mocks/assistantMockData';
import { adminProfile } from '../../mocks/adminMockData';
import { parentProfile } from '../../mocks/parentData';

const ROLES = [
  { key: 'student', label: 'طالب', user: studentProfile, path: (iid) => `/${iid}/dashboard` },
  { key: 'assistant', label: 'مساعد', user: assistantProfile, path: (iid) => `/${iid}/assistant/dashboard` },
  { key: 'admin', label: 'مدير', user: adminProfile, path: (iid) => `/${iid}/admin/dashboard` },
  { key: 'parent', label: 'ولي أمر', user: parentProfile, path: (iid) => `/${iid}/parent/dashboard` },
];

export default function DevRoleSwitcher() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const auth = useAuth();

  // Belt-and-suspenders: even if this ever slipped into a prod bundle,
  // it renders nothing and devLoginAs() itself is a no-op outside dev.
  if (!import.meta.env.DEV) return null;

  const instructorId = params.instructorId || auth.user?.instructorId || 'ins-1';

  const handlePick = (role) => {
    auth.devLoginAs(role.user);
    setOpen(false);
    navigate(role.path(instructorId));
  };

  return (
    <div className="fixed bottom-4 left-4 z-[999]" dir="rtl">
      {open && (
        <div className="mb-2 w-52 rounded-xl border border-surface-border bg-surface-default shadow-lg p-2 space-y-1">
          <div className="px-2 pb-1 text-xs font-medium text-ink-500">
            معاينة الأدوار (Dev فقط)
          </div>

          {ROLES.map((role) => {
            const active = auth.user?.role === role.key;
            return (
              <button
                key={role.key}
                type="button"
                onClick={() => handlePick(role)}
                className={`w-full rounded-lg px-3 py-2 text-right text-sm transition-colors ${
                  active
                    ? 'bg-brand-500 text-ink-900 font-semibold'
                    : 'text-ink-700 hover:bg-surface-muted'
                }`}
              >
                {role.label}
              </button>
            );
          })}

          {auth.user && (
            <button
              type="button"
              onClick={() => {
                auth.logout();
                setOpen(false);
              }}
              className="w-full rounded-lg px-3 py-2 text-right text-sm text-danger-DEFAULT hover:bg-surface-muted transition-colors"
            >
              تسجيل الخروج
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-brand-500 text-ink-900 text-xs font-bold px-4 py-2 shadow-lg hover:bg-brand-600 transition-colors"
      >
        DEV{auth.user ? ` · ${auth.user.role}` : ''}
      </button>
    </div>
  );
}
