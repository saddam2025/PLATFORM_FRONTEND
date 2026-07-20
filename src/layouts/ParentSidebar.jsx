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
        `flex items-center gap-3 justify-start flex-row-reverse px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-300 ${
          isActive
            ? 'bg-surface-canvas text-[var(--sidebar-bg)] font-bold shadow-card'
            : 'text-white/70 hover:text-white hover:bg-[var(--sidebar-bg-soft)]'
        }`
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
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] text-white px-4 py-8 overflow-y-auto">
      <div className="mb-8 flex items-center gap-3 px-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-ink-900 text-xl font-extrabold shadow-pop">
          Σ
        </span>
        <div className="leading-tight">
          <div className="text-lg font-extrabold text-white">رياضياتي</div>
          <div className="text-xs text-white/60">بوابة ولي الأمر</div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatar || selected?.avatar} name={user?.name || selected?.name || 'ولي الأمر'} size="md" />
          <div className="flex-1 min-w-0">
            <div className="truncate font-semibold text-white">{user?.name || 'ولي الأمر'}</div>
            <div className="truncate text-xs text-white/60">{selected?.name || 'منصة الرياضيات'}</div>
          </div>
          <div>
            <Badge className="text-xs">{user?.role || 'ولي أمر'}</Badge>
          </div>
        </div>

        <div className="mt-4">
          {childrenList.length > 0 ? (
            <div className="flex items-center gap-2">
              <label htmlFor="child-select" className="sr-only">اختر الطفل</label>
              <select
                id="child-select"
                value={selectedChildId ?? (childrenList[0] && childrenList[0].id) ?? ''}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 text-white text-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
                dir="rtl"
              >
                {childrenList.map((c) => (
                  <option key={c.id} value={c.id} className="text-ink-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-xs text-white/60 mt-2">لا يوجد أطفال مرتبطين</div>
          )}
        </div>

        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full !bg-white/10 !text-white !border-white/20 !shadow-none hover:!bg-white/20"
            onClick={logout}
          >
            تسجيل الخروج
          </Button>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        <Item to={`${base}/parent/dashboard`}>لوحة التحكم</Item>
        <Item to={`${base}/parent/reports`}>تقارير الأبناء</Item>
        <Item to={`${base}/parent/activity`}>النشاط والرسائل</Item>
        <Item to={`${base}/leaderboard`}>لوحة الشرف</Item>
      </nav>

      <div className="mt-6 px-1 pb-2">
        <div className="text-xs font-medium text-white/50 mb-2 px-2">معلومات الطفل المحدد</div>
        {selectedChild ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 ring-1 ring-white/10">
            <Avatar src={selectedChild.avatar} name={selectedChild.name} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium text-white">{selectedChild.name}</div>
              {/* FIX: mock data field is `grade`, not `class` */}
              <div className="truncate text-xs text-white/60">{selectedChild.grade || ''}</div>
            </div>
            <div>
              {/* FIX: Button has no 'xs' size — was silently dropping all size padding classes */}
              <Button
                variant="ghost"
                size="sm"
                className="!bg-white/10 !text-white !border-white/20 !shadow-none hover:!bg-white/20"
                onClick={() => setSelectedChildId(null)}
              >
                مسح
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-white/70 px-2">لم يتم اختيار طفل</div>
        )}
      </div>
    </div>
  );
}
