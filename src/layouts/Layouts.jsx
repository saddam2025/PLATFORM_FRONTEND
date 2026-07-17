import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layouts() {
  return (
    <div className="min-h-screen flex bg-surface-canvas text-ink-900">
      {/* Sidebar (hidden on small screens via CSS) */}
      <aside className="sidebar hidden lg:block">
        <Sidebar />
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation */}
        <header className="border-b border-surface-border bg-surface-DEFAULT">
          <Navbar />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
