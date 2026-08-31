// src/contexts/AuthProvider.jsx
import React, { createContext, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { setAuthToken as setApiAuthToken } from '../services/api';

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {},
  updateUser: () => {},
});

function readStoredToken() {
  try {
    return localStorage.getItem('math-auth-token') || localStorage.getItem('mp_token') || null;
  } catch {
    return null;
  }
}

function dashboardPathFor(userObj, instructorId) {
  if (userObj?.role === 'super_admin') return '/super-admin';
  const base = instructorId || userObj?.instructorId;
  if (!base) return '/';
  switch (userObj?.role) {
    case 'admin':
    case 'teacher': return `/${base}/admin/dashboard`;
    case 'assistant': return `/${base}/assistant/dashboard`;
    case 'parent': return `/${base}/parent/dashboard`;
    case 'student': return `/${base}/dashboard`;
    default: return `/${base}`;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => readStoredToken());
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('mp_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(token) && !user);

  const saveSession = useCallback((tkn, userObj) => {
    if (tkn) {
      setApiAuthToken(tkn);
    } else {
      setApiAuthToken(null);
    }

    if (userObj) {
      try {
        localStorage.setItem('mp_user', JSON.stringify(userObj));
      } catch {}
    } else {
      try {
        localStorage.removeItem('mp_user');
      } catch {}
    }

    setToken(tkn || null);
    setUser(userObj || null);
  }, []);

  const login = useCallback(
    async (credentials, instructorId) => {
      setLoading(true);
      try {
        const res = await authService.login(credentials);
        const payload = res?.data || {};
        const tkn = payload.token || payload.accessToken || payload.data?.token;
        const userObj = payload.user || payload.data?.user || payload;
        if (!tkn && !userObj) {
          setLoading(false);
          return { ok: false, error: 'Invalid server response' };
        }

        saveSession(tkn, userObj);
        setLoading(false);
        navigate(dashboardPathFor(userObj, instructorId), { replace: true });
        return { ok: true, data: userObj };
      } catch (err) {
        setLoading(false);
        return { ok: false, error: err?.message || err || 'خطأ في تسجيل الدخول' };
      }
    },
    [navigate, saveSession]
  );

  const logout = useCallback(() => {
    try {
      authService.logout().catch(() => {});
    } catch {}
    saveSession(null, null);
    navigate('/login', { replace: true });
  }, [navigate, saveSession]);

  // Applies a local update from authenticated profile actions (such as avatar
  // upload) so every consumer of useAuth rerenders without a page reload.
  const updateUser = useCallback((updates) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const nextUser = { ...currentUser, ...updates };
      try {
        localStorage.setItem('mp_user', JSON.stringify(nextUser));
      } catch {}
      return nextUser;
    });
  }, []);

  // DEV-ONLY: lets a role-switcher UI preview each dashboard (student, admin,
  // assistant, parent) with mock data, without hitting the real backend.
  // Bypasses authService.login entirely and writes straight to the session.
  // Guarded so it's a no-op in production builds (import.meta.env.DEV is
  // statically replaced by Vite, so this branch is dropped from prod bundles).
  const devLoginAs = useCallback(
    (mockUser) => {
      if (!import.meta.env.DEV) return;
      saveSession('dev-mock-token', mockUser);
    },
    [saveSession]
  );

  const refreshUser = useCallback(async () => {
    const stored = readStoredToken();
    if (!stored) {
      setLoading(false);
      return null;
    }

    setLoading(true);
    try {
      setApiAuthToken(stored);
      const res = await authService.me();
      const payload = res?.data || null;
      setUser(payload);
      try {
        localStorage.setItem('mp_user', JSON.stringify(payload));
      } catch {}
      setToken(stored);
      setLoading(false);
      return payload;
    } catch (err) {
      saveSession(null, null);
      setLoading(false);
      return null;
    }
  }, [saveSession]);

  useEffect(() => {
    if (token && !user) {
      refreshUser();
    } else {
      setLoading(false);
      if (token) setApiAuthToken(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token) setApiAuthToken(token);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
        updateUser,
        devLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
