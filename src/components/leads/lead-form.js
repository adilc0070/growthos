"use client";

import { useState, useEffect } from "react";
import { STATUSES, SOURCES, COURSES } from "@/lib/leads-data";
import { X } from "lucide-react";

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  source: "Ads",
  status: "new",
  budget: "",
  courseInterest: "",
  tags: "",
  followUpDate: "",
};

export default function LeadForm({ lead, onSubmit, onClose }) {
  const editing = !!lead;
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        phone: lead.phone,
        email: lead.email || "",
        source: lead.source,
        status: lead.status,
        budget: lead.budget || "",
        courseInterest: lead.courseInterest || "",
        tags: (lead.tags || []).join(", "),
        followUpDate: lead.followUpDate
          ? new Date(lead.followUpDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [lead]);

  function set(key) {
    return (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const now = new Date().toISOString();
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      source: form.source,
      status: form.status,
      budget: form.budget,
      courseInterest: form.courseInterest,
      tags,
      followUpDate: form.followUpDate || null,
    };

    if (editing) {
      onSubmit(lead._id || lead.id, payload);
    } else {
      onSubmit(payload);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-20">
      <div className="w-full max-w-lg rounded-xl border border-stone-200 bg-white shadow-xl dark:border-stone-700 dark:bg-stone-900">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3 dark:border-stone-700">
          <h2 className="text-base font-semibold">
            {editing ? "Edit Lead" : "Add Lead"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name *" required>
              <input
                required
                value={form.name}
                onChange={set("name")}
                placeholder="Full name"
                className="input"
              />
            </Field>
            <Field label="Phone *" required>
              <input
                required
                value={form.phone}
                onChange={set("phone")}
                placeholder="+91 00000 00000"
                className="input"
              />
            </Field>
          </div>

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="email@example.com"
              className="input"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Source">
              <select value={form.source} onChange={set("source")} className="input">
                {SOURCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={set("status")} className="input">
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Budget">
              <input
                value={form.budget}
                onChange={set("budget")}
                placeholder="₹15,000"
                className="input"
              />
            </Field>
            <Field label="Course Interest">
              <select
                value={form.courseInterest}
                onChange={set("courseInterest")}
                className="input"
              >
                <option value="">Select…</option>
                {COURSES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Tags (comma-separated)">
            <input
              value={form.tags}
              onChange={set("tags")}
              placeholder="hot-lead, student"
              className="input"
            />
          </Field>

          <Field label="Follow-up Date">
            <input
              type="date"
              value={form.followUpDate}
              onChange={set("followUpDate")}
              className="input"
            />
          </Field>

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
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            >
              {editing ? "Save Changes" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
        {label}
      </span>
      {children}
    </label>
  );
}
