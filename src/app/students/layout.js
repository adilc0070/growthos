"use client";

import { useState } from "react";
import AppSidebar from "@/components/app-sidebar";
import { Menu } from "lucide-react";

export default function StudentsLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-50 dark:bg-stone-950">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-stone-200 bg-white/90 px-4 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-semibold tracking-tight">
            Student Success
          </h1>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
