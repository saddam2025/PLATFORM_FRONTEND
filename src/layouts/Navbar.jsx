// src/layouts/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeProvider';
import { AuthContext } from '../contexts/AuthProvider';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const { instructorId } = useParams();

  // FIX: '/select-instructor' was never a registered route — the instructor
  // selector actually lives at '/' (InstructorSelectorPage.jsx's route export).
  const homeLink = user
    ? instructorId
      ? `/${instructorId}`
      : '/'
    : '/';

  return (
    <div className="navbar px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to={homeLink} className="inline-flex items-center gap-3">
          <img src="/src/assets/vite.svg" alt="logo" className="w-8 h-8" />
          <span className="text-lg font-semibold">Mathematics</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? 'وضع فاتح' : 'وضع داكن'}
        </Button>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-ink-500">{user.email}</div>
            </div>
            <Avatar src={user.avatar} name={user.name} size="sm" status={user.online ? 'online' : 'offline'} />
            <Button variant="ghost" size="sm" onClick={logout}>
              تسجيل الخروج
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">تسجيل الدخول</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">إنشاء حساب</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}