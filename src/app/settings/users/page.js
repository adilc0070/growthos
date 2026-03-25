"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Plus,
  Loader2,
  UserPlus,
  Shield,
  ShoppingCart,
  GraduationCap,
  MoreVertical,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const ROLE_CONFIG = {
  admin: { label: "Admin", icon: Shield, cls: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  sales: { label: "Sales", icon: ShoppingCart, cls: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  student: { label: "Student", icon: GraduationCap, cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
};

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await fetch("/api/users");
      if (res.ok) setUsers(await res.json());
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(user) {
    await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    loadUsers();
    setMenuOpen(null);
  }

  async function deleteUser(user) {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    await fetch(`/api/users/${user._id}`, { method: "DELETE" });
    loadUsers();
    setMenuOpen(null);
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <p className="text-sm text-stone-500">Admin access required</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <Loader2 size={24} className="animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 lg:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Team Members</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {users.length} user{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
        >
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      <div className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
        {users.map((user) => {
          const rc = ROLE_CONFIG[user.role] || ROLE_CONFIG.sales;
          const Icon = rc.icon;
          const isMe = user._id === session?.user?.id;

          return (
            <div
              key={user._id}
              className="flex items-center gap-4 px-4 py-3"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  {isMe && (
                    <span className="text-[10px] font-medium text-stone-400">
                      YOU
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                  {user.email}
                </p>
              </div>

              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${rc.cls}`}
              >
                <Icon size={12} />
                {rc.label}
              </span>

              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  user.isActive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>

              <div className="relative">
                <button
                  onClick={() =>
                    setMenuOpen(menuOpen === user._id ? null : user._id)
                  }
                  className="rounded-md p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <MoreVertical size={16} />
                </button>

                {menuOpen === user._id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(null)}
                    />
                    <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-stone-200 bg-white py-1 shadow-lg dark:border-stone-700 dark:bg-stone-900">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowForm(true);
                          setMenuOpen(null);
                        }}
                        className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-stone-50 dark:hover:bg-stone-800"
                      >
                        Edit
                      </button>
                      {!isMe && (
                        <>
                          <button
                            onClick={() => toggleActive(user)}
                            className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-stone-50 dark:hover:bg-stone-800"
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => deleteUser(user)}
                            className="flex w-full items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <UserFormModal
          user={editingUser}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          onDone={() => {
            loadUsers();
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}

function UserFormModal({ user, onClose, onDone }) {
  const editing = !!user;
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "sales",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(key) {
    return (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = editing ? `/api/users/${user._id}` : "/api/users";
      const method = editing ? "PUT" : "POST";
      const body = editing
        ? { name: form.name, role: form.role, ...(form.password ? { password: form.password } : {}) }
        : { name: form.name, email: form.email, password: form.password, role: form.role };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setSaving(false);
        return;
      }
      onDone();
    } catch {
      setError("Something went wrong");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-20">
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white shadow-xl dark:border-stone-700 dark:bg-stone-900">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3 dark:border-stone-700">
          <h2 className="text-base font-semibold">
            {editing ? "Edit User" : "Add Team Member"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <label className="block space-y-1">
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
              Full Name *
            </span>
            <input
              required
              autoFocus
              value={form.name}
              onChange={set("name")}
              placeholder="Name"
              className="input"
            />
          </label>

          {!editing && (
            <label className="block space-y-1">
              <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                Email *
              </span>
              <input
                type="email"
                required
                value={form.email}
                onChange={set("email")}
                placeholder="user@example.com"
                className="input"
              />
            </label>
          )}

          <label className="block space-y-1">
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
              {editing ? "New Password (leave blank to keep)" : "Password *"}
            </span>
            <input
              type="password"
              required={!editing}
              value={form.password}
              onChange={set("password")}
              placeholder={editing ? "Leave blank to keep current" : "Min 6 characters"}
              className="input"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
              Role *
            </span>
            <select value={form.role} onChange={set("role")} className="input">
              <option value="sales">Sales</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : editing ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
