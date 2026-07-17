// src/layouts/ParentSidebar.jsx
import React, { useContext, useMemo } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { InstructorContext } from '../contexts/InstructorContext';
import { useAuth } from '../hooks/useAuth'; // FIX: was importing non-existent useAuth from AuthProvider
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useSelectedChild } from '../contexts/SelectedChildContext';
import { children as childrenList } from '../mocks/parentData'; // FIX: parentData has no default export, only named exports

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-surface-muted'}`
      }
    >
      {children}
    </NavLink>
  );
}

export default function ParentSidebar() {
  const { selected } = useContext(InstructorContext);
  const { user, logout } = useAuth();
  const { instructorId } = useParams();
  const base = instructorId ? `/${instructorId}` : '';

  const { selectedChildId, setSelectedChildId } = useSelectedChild();

  const selectedChild = useMemo(
    () => childrenList.find((c) => c.id === selectedChildId) || childrenList[0] || null,
    [selectedChildId]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 px-3">
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatar || selected?.avatar} name={user?.name || selected?.name || 'ولي الأمر'} size="md" />
          <div className="flex-1">
            <div className="font-semibold">{user?.name || 'ولي الأمر'}</div>
            <div className="text-xs text-ink-500">{selected?.name || 'منصة الرياضيات'}</div>
          </div>
          <div>
            <Badge className="text-xs">{user?.role || 'ولي أمر'}</Badge>
          </div>
        </div>

        <div className="mt-3">
          {childrenList.length > 0 ? (
            <div className="flex items-center gap-2">
              <label htmlFor="child-select" className="sr-only">اختر الطفل</label>
              <select
                id="child-select"
                value={selectedChildId ?? (childrenList[0] && childrenList[0].id) ?? ''}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="w-full rounded-md border border-surface-border bg-white text-sm p-2"
                dir="rtl"
              >
                {childrenList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-xs text-ink-500 mt-2">لا يوجد أطفال مرتبطين</div>
          )}
        </div>

        <div className="mt-4">
          <Button variant="ghost" size="sm" className="w-full" onClick={logout}>
            تسجيل الخروج
          </Button>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-1">
        <Item to={`${base}/parent/dashboard`}>لوحة التحكم</Item>
        <Item to={`${base}/parent/reports`}>تقارير الأبناء</Item>
        <Item to={`${base}/parent/activity`}>النشاط والرسائل</Item>
        <Item to={`${base}/leaderboard`}>لوحة الشرف</Item>
      </nav>

      <div className="mt-6 px-3 pb-6">
        <div className="text-xs text-ink-500 mb-2">معلومات الطفل المحدد</div>
        {selectedChild ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded bg-surface-muted">
            <Avatar src={selectedChild.avatar} name={selectedChild.name} size="sm" />
            <div className="flex-1">
              <div className="text-sm font-medium">{selectedChild.name}</div>
              {/* FIX: mock data field is `grade`, not `class` */}
              <div className="text-xs text-ink-500">{selectedChild.grade || ''}</div>
            </div>
            <div>
              {/* FIX: Button has no 'xs' size — was silently dropping all size padding classes */}
              <Button variant="ghost" size="sm" onClick={() => setSelectedChildId(null)}>
                مسح
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-ink-600 px-2">لم يتم اختيار طفل</div>
        )}
      </div>
    </div>
  );
}