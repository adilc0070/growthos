"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  GraduationCap,
  MessageSquareQuote,
  BarChart3,
  Zap,
  Target,
  Settings,
  LogOut,
  X,
  Shield,
} from "lucide-react";

const NAV = [
  { href: "/leads", label: "Leads", icon: Users, ready: true },
  { href: "#", label: "Dashboard", icon: LayoutDashboard, ready: false },
  { href: "/sales", label: "Sales", icon: ShoppingCart, ready: true },
  { href: "/students", label: "Students", icon: GraduationCap, ready: true },
  { href: "/proof", label: "Proof Engine", icon: MessageSquareQuote, ready: true },
  { href: "/targeting", label: "Targeting", icon: Target, ready: true },
  { href: "#", label: "Scaling", icon: Zap, ready: false },
  { href: "#", label: "Analytics", icon: BarChart3, ready: false },
];

export default function AppSidebar({ open, onClose }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

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

          {isAdmin && (
            <>
              <div className="mx-3 my-2 border-t border-stone-200 dark:border-stone-800" />
              <Link
                href="/settings/users"
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith("/settings")
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : "text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800/60"
                }`}
              >
                <Settings size={18} />
                Settings
              </Link>
            </>
          )}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-stone-200 p-3 dark:border-stone-800">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                {user.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-tight">
                  {user.name}
                </p>
                <p className="flex items-center gap-1 text-[11px] text-stone-400 dark:text-stone-500">
                  {isAdmin && <Shield size={10} />}
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                title="Sign out"
                className="shrink-0 rounded-md p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-300"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <p className="text-xs text-stone-400 dark:text-stone-600">
              Internal build &middot; v0.1
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
