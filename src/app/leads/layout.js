"use client";

import { useState } from "react";
import AppSidebar from "@/components/app-sidebar";
import { Menu } from "lucide-react";

export default function LeadsLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-50 dark:bg-stone-950">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Reserve width for fixed sidebar on lg+ (fixed nodes don’t consume flex space). */}
      <div
        className="hidden w-60 shrink-0 lg:block"
        aria-hidden
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90">
          <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="touch-manipulation rounded-md p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold tracking-tight">
              Lead Management
            </h1>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
