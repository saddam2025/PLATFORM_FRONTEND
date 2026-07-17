// src/components/forms/RegisterForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import api from '../../services/api';
// FIX: real hook file is src/hooks/useAuth.js (there is no src/contexts/AuthContext.jsx —
// the context itself lives in AuthProvider.jsx and is exposed via this hook).
import { useAuth } from '../../hooks/useAuth';

export default function RegisterForm({ instructorId: propInstructorId }) {
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const loginFn = auth.login || null;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    parentAccessCode: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
    setServerError('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!form.email.trim()) e.email = 'البريد الإلكتروني مطلوب';
    else if (!validateEmail(form.email.trim())) e.email = 'البريد الإلكتروني غير صالح';
    if (!form.password) e.password = 'كلمة المرور مطلوبة';
    if (!form.confirmPassword) e.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      e.confirmPassword = 'كلمتا المرور غير متطابقتين';
    }
    if (form.role === 'parent' && !form.parentAccessCode.trim()) {
      e.parentAccessCode = 'كود ربط الطالب مطلوب لولي الأمر';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        instructorId: propInstructorId || null,
        // TODO(backend): parentAccessCode must be validated against a real student
        // record and used to set parent.childId — do not store as a loose string.
        ...(form.role === 'parent' ? { parentAccessCode: form.parentAccessCode.trim() } : {})
      };

      // FIX: api.js baseURL already resolves to `${VITE_API_URL}` which itself
      // already ends in /api/v1 — prefixing '/api/v1' again here would call
      // /api/v1/api/v1/auth/register and 404. Use the relative path only.
      await api.post('/auth/register', payload);

      // On success, log the user in immediately using the same credentials
      // to establish a session (AuthProvider only exposes login/logout/refreshUser,
      // there's no separate "register+session" helper).
      if (loginFn) {
        try {
          await loginFn({ email: form.email.trim(), password: form.password });
        } catch (loginErr) {
          setServerError(loginErr?.message || 'تم التسجيل ولكن فشل تسجيل الدخول تلقائياً');
          setSubmitting(false);
          return;
        }
      }

      // NOTE: AuthProvider's login() already navigates internally to
      // '/select-instructor' on success. This navigate() call runs right after
      // that await resolves, so it fires second and wins, sending the user to
      // the correct role-based dashboard instead of the generic selector page.
      if (form.role === 'parent') {
        navigate(`/${propInstructorId}/parent/dashboard`);
      } else {
        navigate(`/${propInstructorId}/dashboard`);
      }
    } catch (err) {
      // FIX: api.js's response interceptor already normalizes axios errors into
      // a plain { message, status } object before rejecting (see api.js), so the
      // caught error here is NOT a raw axios error — err.response does not exist.
      const msg = err?.message || 'فشل التسجيل. حاول مرة أخرى.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-default rounded-2xl shadow-card p-6 space-y-4" dir="rtl">
      <div className="text-right">
        <div className="text-lg font-semibold text-ink-900">معلومات الحساب</div>
        <div className="text-sm text-ink-500 mt-1">املأ البيانات لإنشاء حساب جديد</div>
      </div>

      {serverError && (
        <div className="rounded-md p-3 bg-danger-soft text-danger-DEFAULT text-sm">
          {serverError}
        </div>
      )}

      {/* FIX: Input component (src/components/ui/Input.jsx) has no `label` prop —
          passing label="..." was previously a no-op. Each field now gets its own
          explicit <label> wrapper, consistent with the rest of the design system. */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink-700 mb-1">الاسم الكامل</label>
          <Input id="name" name="name" value={form.name} onChange={onChange('name')} error={errors.name} required />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1">البريد الإلكتروني</label>
          <Input id="email" name="email" type="email" value={form.email} onChange={onChange('email')} error={errors.email} required />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1">كلمة المرور</label>
          <Input id="password" name="password" type="password" value={form.password} onChange={onChange('password')} error={errors.password} required />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink-700 mb-1">تأكيد كلمة المرور</label>
          <Input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange('confirmPassword')} error={errors.confirmPassword} required />
        </div>
      </div>

      {/* Role selector — student / parent only. Assistants are invited by
          instructors (see the Assistant Manager flow), never self-register. */}
      <div className="pt-2">
        <div className="text-right text-sm font-medium text-ink-900 mb-2">نوع الحساب</div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setForm((s) => ({ ...s, role: 'student' }))}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              form.role === 'student' ? 'bg-brand-500 text-ink-900' : 'bg-surface-default border border-surface-border text-ink-700'
            }`}
            aria-pressed={form.role === 'student'}
          >
            طالب
          </button>

          <button
            type="button"
            onClick={() => setForm((s) => ({ ...s, role: 'parent' }))}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              form.role === 'parent' ? 'bg-brand-500 text-ink-900' : 'bg-surface-default border border-surface-border text-ink-700'
            }`}
            aria-pressed={form.role === 'parent'}
          >
            ولي أمر
          </button>

          <Badge variant="neutral" className="text-xs">المساعدون يتم دعوتهم من قبل المدرسين</Badge>
        </div>
      </div>

      {/* Conditional parent access code field */}
      {form.role === 'parent' && (
        <div>
          <label htmlFor="parentAccessCode" className="block text-sm font-medium text-ink-700 mb-1">كود ربط الطالب</label>
          <Input
            id="parentAccessCode"
            name="parentAccessCode"
            value={form.parentAccessCode}
            onChange={onChange('parentAccessCode')}
            required
            error={errors.parentAccessCode}
          />
          {/* helperText isn't a supported Input prop, so it's rendered manually here,
              same pattern used for the error message inside Input.jsx itself. */}
          {!errors.parentAccessCode && (
            <p className="text-xs text-ink-500 mt-1">احصل على هذا الكود من ابنك/ابنتك داخل لوحة الطالب</p>
          )}
        </div>
      )}

      <div>
        <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
          {submitting ? 'جارٍ الإنشاء...' : 'إنشاء حساب'}
        </Button>
      </div>

      <div className="text-center text-sm text-ink-500">
        لديك حساب بالفعل؟{' '}
        <Link to="/login" className="text-brand-700 underline">
          تسجيل الدخول
        </Link>
      </div>
    </form>
  );
}