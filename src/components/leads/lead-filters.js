"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  SOURCES,
  TEMPERATURES,
  PERSONAS,
  STATUSES,
  AD_SOURCES,
  URGENCY_LEVELS,
  ENGAGEMENT_LEVELS,
} from "@/lib/leads-data";
import useCourses from "@/hooks/use-courses";
import * as api from "@/lib/leads-api";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Users,
  LayoutGrid,
} from "lucide-react";

export const LEAD_FILTER_DEFAULTS = {
  assignedTo: "all",
  status: "all",
  createdFrom: "",
  createdTo: "",
  source: "all",
  adSource: "all",
  courseInterest: "all",
  temperature: "all",
  persona: "all",
  minScore: "",
  maxScore: "",
  urgency: "all",
  engagement: "all",
};

const AD_GROUP_ORDER = ["Ads", "Organic", "Referral", "Other"];

function countActiveFilters(filters) {
  return Object.keys(LEAD_FILTER_DEFAULTS).filter(
    (k) => filters[k] !== LEAD_FILTER_DEFAULTS[k]
  ).length;
}

export default function LeadFilters({ filters, onChange, resultCount }) {
  const { data: session } = useSession();
  const { courses } = useCourses();
  const [assignable, setAssignable] = useState([]);
  const [assignableLoading, setAssignableLoading] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const users = await api.fetchAssignableUsers();
        if (!cancelled) setAssignable(Array.isArray(users) ? users : []);
      } catch {
        if (!cancelled) setAssignable([]);
      } finally {
        if (!cancelled) setAssignableLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function set(key) {
    return (e) => onChange({ ...filters, [key]: e.target.value });
  }

  function reset() {
    onChange({ ...LEAD_FILTER_DEFAULTS });
  }

  const adByGroup = useMemo(() => {
    const map = new Map();
    for (const item of AD_SOURCES) {
      const g = item.group || "Other";
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(item);
    }
    return map;
  }, []);

  const isAdmin = session?.user?.role === "admin";

  return (
    <section
      className="rounded-xl border border-stone-200 bg-stone-50/90 shadow-sm dark:border-stone-800 dark:bg-stone-900/50"
      aria-label="Lead filters"
    >
      <div className="flex flex-col gap-3 border-b border-stone-200/80 px-4 py-3 dark:border-stone-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-stone-600 shadow-sm ring-1 ring-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700">
            <Filter size={18} strokeWidth={2} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Pipeline filters
              </h2>
              {activeCount > 0 && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {activeCount} active
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
              {isAdmin
                ? "Slice the board by owner, stage, dates, and lead quality for rep reviews."
                : "Narrow leads by assignment, stage, and attributes."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
            >
              <X size={14} />
              Clear all
            </button>
          )}
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
            <LayoutGrid size={14} className="text-stone-400" />
            <span>{resultCount}</span>
            <span className="text-stone-400">leads match</span>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            <Users size={12} />
            Sales &amp; pipeline
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block min-w-0 space-y-1">
              <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                Assigned to
              </span>
              <select
                value={filters.assignedTo}
                onChange={set("assignedTo")}
                disabled={assignableLoading}
                className="input truncate"
              >
                <option value="all">All team members</option>
                <option value="unassigned">Unassigned</option>
                {assignable.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                    {u.role === "admin" ? " (admin)" : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="block min-w-0 space-y-1">
              <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                Stage
              </span>
              <select
                value={filters.status}
                onChange={set("status")}
                className="input truncate"
              >
                <option value="all">All stages</option>
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block min-w-0 space-y-1">
              <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                Created from
              </span>
              <input
                type="date"
                value={filters.createdFrom}
                onChange={set("createdFrom")}
                className="input"
              />
            </label>

            <label className="block min-w-0 space-y-1">
              <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                Created to
              </span>
              <input
                type="date"
                value={filters.createdTo}
                onChange={set("createdTo")}
                className="input"
              />
            </label>
          </div>
        </div>

        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Lead profile
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block min-w-0 space-y-1">
              <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                Source
              </span>
              <select
                value={filters.source}
                onChange={set("source")}
                className="input truncate"
              >
                <option value="all">All sources</option>
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="block min-w-0 space-y-1">
              <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                Course interest
              </span>
              <select
                value={filters.courseInterest}
                onChange={set("courseInterest")}
                className="input truncate"
              >
                <option value="all">All courses</option>
                {courses.map((c) => (
                  <option key={c._id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block min-w-0 space-y-1">
              <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                Temperature
              </span>
              <select
                value={filters.temperature}
                onChange={set("temperature")}
                className="input truncate"
              >
                <option value="all">All</option>
                {TEMPERATURES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block min-w-0 space-y-1">
              <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                Persona
              </span>
              <select
                value={filters.persona}
                onChange={set("persona")}
                className="input truncate"
              >
                <option value="all">All personas</option>
                {PERSONAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setAdvancedOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-lg border border-stone-200 bg-white px-3 py-2 text-left text-xs font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-200 dark:hover:bg-stone-800"
            aria-expanded={advancedOpen}
          >
            <span>Advanced — channel, score &amp; engagement</span>
            {advancedOpen ? (
              <ChevronUp size={16} className="shrink-0 text-stone-400" />
            ) : (
              <ChevronDown size={16} className="shrink-0 text-stone-400" />
            )}
          </button>

          {advancedOpen && (
            <div className="mt-3 grid gap-3 border-t border-stone-200/80 pt-3 dark:border-stone-800 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block min-w-0 space-y-1 lg:col-span-1">
                <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                  Acquisition channel
                </span>
                <select
                  value={filters.adSource}
                  onChange={set("adSource")}
                  className="input truncate"
                >
                  <option value="all">All channels</option>
                  {[
                    ...AD_GROUP_ORDER,
                    ...Array.from(adByGroup.keys()).filter(
                      (g) => !AD_GROUP_ORDER.includes(g)
                    ),
                  ].map((group) => {
                    const items = adByGroup.get(group);
                    if (!items?.length) return null;
                    return (
                      <optgroup key={group} label={group}>
                        {items.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </label>

              <label className="block min-w-0 space-y-1">
                <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                  Min lead score
                </span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0"
                  value={filters.minScore}
                  onChange={set("minScore")}
                  className="input"
                />
              </label>

              <label className="block min-w-0 space-y-1">
                <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                  Max lead score
                </span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="100"
                  value={filters.maxScore}
                  onChange={set("maxScore")}
                  className="input"
                />
              </label>

              <label className="block min-w-0 space-y-1">
                <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                  Urgency
                </span>
                <select
                  value={filters.urgency}
                  onChange={set("urgency")}
                  className="input truncate"
                >
                  <option value="all">All</option>
                  {URGENCY_LEVELS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block min-w-0 space-y-1">
                <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                  Engagement
                </span>
                <select
                  value={filters.engagement}
                  onChange={set("engagement")}
                  className="input truncate"
                >
                  <option value="all">All</option>
                  {ENGAGEMENT_LEVELS.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
