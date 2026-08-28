import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-default text-ink-900">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div className="text-right">
            <Logo className="mb-3" />
            <p className="text-sm leading-6 text-ink-600">كل اللي محتاجه عشان تتعلم وتطوّر مستواك، موجود في مكان واحد.</p>
          </div>

          <div className="text-right">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-900">روابط سريعة</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-600">
              <li><Link to="/" className="transition hover:text-ink-900">الصفحة الرئيسية</Link></li>
              <li><Link to="/" className="transition hover:text-ink-900">تصفح المعلمين</Link></li>
              <li><Link to="/ins-1/leaderboard" className="transition hover:text-ink-900">لوحة الشرف</Link></li>
              <li><Link to="/ins-1/stages/grade-7/plans" className="transition hover:text-ink-900">خطط الاشتراك</Link></li>
            </ul>
          </div>

          <div className="text-right">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-900">أولياء الأمور</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-600">
              <li><Link to="/ins-1/parent/dashboard" className="transition hover:text-ink-900">لوحة تحكم ولي الأمر</Link></li>
              <li><Link to="/ins-1/parent/reports" className="transition hover:text-ink-900">تقارير الحضور والغياب</Link></li>
            </ul>
          </div>

          <div className="text-right">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-900">الدعم الفني</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-600">
              <li><a href="mailto:support@riyadiaty.example.com" className="transition hover:text-ink-900">تواصل معنا</a></li>
              <li><Link to="/ins-1/notifications" className="transition hover:text-ink-900">الإشعارات والمساعدة</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-border bg-surface-muted px-4 py-4 text-center text-xs text-ink-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} منصة. كل الحقوق محفوظة.
      </div>
    </footer>
  );
}
