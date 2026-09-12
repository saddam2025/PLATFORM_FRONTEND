// src/components/forms/LoginForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function LoginForm({ onSuccess, instructorId }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  // Local, per-submit loading state — deliberately NOT the global
  // AuthContext `loading` flag. That flag also drives RouteGuard (it
  // replaces the entire routed page with a placeholder while true), so
  // reusing it here would unmount/remount this whole page mid-request and
  // wipe serverError right before it could render. See AuthProvider.jsx.
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError(null);
  };

  const validate = () => {
    const errs = {};
    const identifier = form.identifier.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const phoneDigits = identifier.replace(/[^\d\u0660-\u0669]/g, '');
    if (!identifier) errs.identifier = 'البريد الإلكتروني أو رقم الهاتف مطلوب';
    else if (!isEmail && (phoneDigits.length < 7 || phoneDigits.length > 15)) errs.identifier = 'أدخل بريدًا إلكترونيًا أو رقم هاتف صالحًا';
    if (!form.password) errs.password = 'كلمة المرور مطلوبة';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await login({ identifier: form.identifier, password: form.password }, instructorId);
      if (res.ok) {
        onSuccess?.();
      } else {
        setServerError(res.error?.message || res.error || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      setServerError(err?.message || 'حدث خطأ غير متوقع');
    } finally {
      setSubmitting(false);
    }
  };

  // RegisterPage supports both the instructor-scoped route and the
  // generic /register fallback now, so unauthenticated users can arrive
  // at either path without 404.
  const registerLink = instructorId ? `/${instructorId}/register` : '/register';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full" dir="rtl">
      {serverError && (
        <div className="rounded-md p-3 bg-danger-soft text-danger-DEFAULT text-sm">{serverError}</div>
      )}

      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-ink-700 mb-1">البريد الإلكتروني أو رقم الهاتف</label>
        <Input
          id="identifier"
          name="identifier"
          type="text"
          inputMode="email"
          value={form.identifier}
          onChange={handleChange}
          placeholder="name@example.com أو 010..."
          error={fieldErrors.identifier}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1">كلمة المرور</label>
        <Input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={fieldErrors.password}
        />
      </div>

      <Button type="submit" variant="primary" size="md" className="w-full" disabled={submitting}>
        {submitting ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
      </Button>

      <div className="text-center text-sm text-ink-500">
        ليس لديك حساب؟{' '}
        <Link to={registerLink} className="text-brand-700 underline">
          إنشاء حساب
        </Link>
      </div>
    </form>
  );
}

LoginForm.propTypes = {
  onSuccess: PropTypes.func,
  instructorId: PropTypes.string,
};