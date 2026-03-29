"use client";

import { useState } from "react";
import {
  QUALIFICATION_TIMELINES,
  BUDGET_RANGES, COMMITMENT_LEVELS,
} from "@/lib/leads-data";
import { X, ClipboardCheck } from "lucide-react";

const EMPTY = {
  currentSituation: "",
  goal: "",
  timeline: "exploring",
  budgetRange: "below_10k",
  previousExperience: "",
  commitment: "unsure",
};

export default function QualificationForm({ lead, onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function set(key) {
    return (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(lead._id || lead.id, form);
      onClose();
    } catch {
      alert("Failed to save qualification data");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 p-0 sm:items-start sm:p-4 sm:pt-20">
      <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-stone-200 border-b-0 bg-white pb-[env(safe-area-inset-bottom)] shadow-xl sm:max-h-[calc(100dvh-5rem)] sm:rounded-xl sm:border-b dark:border-stone-700 dark:bg-stone-900">
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 dark:border-stone-700 sm:px-5">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={18} className="text-emerald-600" />
            <div>
              <h2 className="text-base font-semibold">Qualify Lead</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">{lead.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="touch-manipulation rounded-md p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-5">
          <Field label="Current Situation">
            <textarea
              value={form.currentSituation}
              onChange={set("currentSituation")}
              placeholder="What is the lead currently doing? (student, employed, etc.)"
              className="input min-h-[60px] resize-y"
              rows={2}
            />
          </Field>

          <Field label="Goal / Desired Outcome">
            <textarea
              value={form.goal}
              onChange={set("goal")}
              placeholder="What does the lead want to achieve?"
              className="input min-h-[60px] resize-y"
              rows={2}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="When do they want to start?">
              <select value={form.timeline} onChange={set("timeline")} className="input">
                {QUALIFICATION_TIMELINES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Budget Range">
              <select value={form.budgetRange} onChange={set("budgetRange")} className="input">
                {BUDGET_RANGES.map((b) => (
                  <option key={b.id} value={b.id}>{b.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Previous Experience">
            <input
              value={form.previousExperience}
              onChange={set("previousExperience")}
              placeholder="Any relevant background or experience?"
              className="input"
            />
          </Field>

          <Field label="Commitment Level">
            <select value={form.commitment} onChange={set("commitment")} className="input">
              {COMMITMENT_LEVELS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
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
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            >
              {saving ? "Saving…" : "Save Qualification"}
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
