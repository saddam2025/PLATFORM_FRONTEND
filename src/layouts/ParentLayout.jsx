// src/layouts/ParentLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import ParentSidebar from './ParentSidebar';
import Navbar from './Navbar';
// FIX: SelectedChildProvider is now mounted globally in App.jsx.
// Wrapping again here created a second, disconnected instance that reset
// selectedChildId whenever the user entered/left /parent/* routes.

export default function ParentLayout() {
  return (
    <div className="min-h-screen flex bg-surface-canvas text-ink-900">
      <aside className="sidebar hidden lg:block w-72 shrink-0">
        <ParentSidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-6 lg:p-8 animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
