// src/components/forms/LoginForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function LoginForm({ onSuccess, instructorId }) {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError(null);
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'البريد الإلكتروني مطلوب';
    if (!form.password) errs.password = 'كلمة المرور مطلوبة';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    try {
      const res = await login({ email: form.email, password: form.password }, instructorId);
      if (res.ok) {
        onSuccess?.();
      } else {
        setServerError(res.error?.message || res.error || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      setServerError(err?.message || 'حدث خطأ غير متوقع');
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
        <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1">البريد الإلكتروني</label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="name@example.com"
          error={fieldErrors.email}
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

      <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
        {loading ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
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
