"use client";

import { SOURCES, COURSES, TEMPERATURES, PERSONAS } from "@/lib/leads-data";
import { Filter, X } from "lucide-react";

const DEFAULTS = {
  source: "all",
  courseInterest: "all",
  temperature: "all",
  persona: "all",
};

export default function LeadFilters({ filters, onChange, totalCount, filteredCount }) {
  function set(key) {
    return (e) => onChange({ ...filters, [key]: e.target.value });
  }

  function reset() {
    onChange({ ...DEFAULTS });
  }

  const hasFilters =
    filters.source !== "all" ||
    filters.courseInterest !== "all" ||
    filters.temperature !== "all" ||
    filters.persona !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400">
        <Filter size={14} />
        <span>Filters</span>
      </div>

      <select
        value={filters.temperature || "all"}
        onChange={set("temperature")}
        className="select-sm"
      >
        <option value="all">All temps</option>
        {TEMPERATURES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>

      <select
        value={filters.persona || "all"}
        onChange={set("persona")}
        className="select-sm"
      >
        <option value="all">All personas</option>
        {PERSONAS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.icon} {p.label}
          </option>
        ))}
      </select>

      <select
        value={filters.source}
        onChange={set("source")}
        className="select-sm"
      >
        <option value="all">All sources</option>
        {SOURCES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={filters.courseInterest}
        onChange={set("courseInterest")}
        className="select-sm"
      >
        <option value="all">All courses</option>
        {COURSES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={reset}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-stone-500 transition hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
        >
          <X size={12} />
          Clear
        </button>
      )}

      <span className="ml-auto text-xs text-stone-400 dark:text-stone-500">
        {hasFilters
          ? `${filteredCount} of ${totalCount} leads`
          : `${totalCount} leads`}
      </span>
    </div>
  );
}
