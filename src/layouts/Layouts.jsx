import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layouts() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = () => setMobileSidebarOpen((open) => !open);

  return (
    <div className="min-h-screen flex bg-surface-canvas text-ink-900">
      <aside className="sidebar hidden lg:block w-72 shrink-0">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar sidebarOpen={mobileSidebarOpen} onToggleSidebar={toggleMobileSidebar} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fadeIn">
          <Outlet />
        </main>
      </div>

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="absolute inset-0 bg-black/30"
            aria-label="إغلاق القائمة"
          />
          <aside className="absolute inset-y-0 right-0 w-full max-w-[320px] border-l border-surface-border bg-surface-default shadow-panel animate-fadeIn">
            <div className="h-full overflow-y-auto p-4">
              <Sidebar />
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
