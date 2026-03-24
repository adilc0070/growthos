"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  GraduationCap,
  MessageSquareQuote,
  BarChart3,
  Zap,
  Target,
  X,
} from "lucide-react";

const NAV = [
  { href: "/leads", label: "Leads", icon: Users, ready: true },
  { href: "#", label: "Dashboard", icon: LayoutDashboard, ready: false },
  { href: "/sales", label: "Sales", icon: ShoppingCart, ready: true },
  { href: "/students", label: "Students", icon: GraduationCap, ready: true },
  { href: "/proof", label: "Proof Engine", icon: MessageSquareQuote, ready: true },
  { href: "#", label: "Targeting", icon: Target, ready: false },
  { href: "#", label: "Scaling", icon: Zap, ready: false },
  { href: "#", label: "Analytics", icon: BarChart3, ready: false },
];

export default function AppSidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-stone-200 bg-white transition-transform duration-200 dark:border-stone-800 dark:bg-stone-950 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-stone-200 px-4 dark:border-stone-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">
              GrowthOS
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
          {NAV.map((item) => {
            const active = item.ready && pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : item.ready
                      ? "text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800/60"
                      : "cursor-default text-stone-400 dark:text-stone-600"
                }`}
              >
                <Icon size={18} />
                {item.label}
                {!item.ready && (
                  <span className="ml-auto text-[10px] font-normal tracking-wide text-stone-400 dark:text-stone-600">
                    SOON
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-stone-200 p-4 dark:border-stone-800">
          <p className="text-xs text-stone-400 dark:text-stone-600">
            Internal build &middot; v0.1
          </p>
        </div>
      </aside>
    </>
  );
}
