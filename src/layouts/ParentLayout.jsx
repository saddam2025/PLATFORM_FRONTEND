// src/layouts/ParentLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ParentSidebar from './ParentSidebar';
import Navbar from './Navbar';
import MobileNavigation from './MobileNavigation';
// FIX: SelectedChildProvider is now mounted globally in App.jsx.
// Wrapping again here created a second, disconnected instance that reset
// selectedChildId whenever the user entered/left /parent/* routes.

export default function ParentLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const location = useLocation();
  const toggleMobileSidebar = () => setMobileSidebarOpen((open) => !open);
  useEffect(() => { setMobileSidebarOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!mobileSidebarOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen flex bg-surface-canvas text-ink-900">
      <aside className={`sidebar fixed inset-y-0 right-0 z-30 hidden h-[100dvh] transition-[width] duration-200 md:block ${sidebarCollapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-72'}`}>
        <ParentSidebar collapsed={sidebarCollapsed} onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)} />
      </aside>

      <div className={`flex-1 min-w-0 flex flex-col transition-[margin] duration-200 ${sidebarCollapsed ? 'md:mr-[var(--sidebar-collapsed-width)]' : 'md:mr-72'}`}>
        <Navbar sidebarOpen={mobileSidebarOpen} onToggleSidebar={toggleMobileSidebar} sticky sidebarOffset sidebarCollapsed={sidebarCollapsed} />

        <main className="dot-grid-background flex-1 p-4 pb-28 sm:p-6 sm:pb-28 md:pb-6 lg:p-8 animate-fadeIn">
          <Outlet />
        </main>
      </div>

      <MobileNavigation />

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" onClick={toggleMobileSidebar} className="absolute inset-0 bg-black/30" aria-label="إغلاق القائمة" />
          <aside className="absolute inset-y-0 right-0 h-[100dvh] w-full max-w-[320px] overscroll-contain border-l border-surface-border bg-surface-default shadow-panel animate-fadeIn">
            <div className="sidebar-scroll h-full overflow-y-auto overscroll-contain"><ParentSidebar collapsed={false} /></div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
