"use client";

import { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import { SOURCES } from "@/lib/leads-data";
import useCourses from "@/hooks/use-courses";
import {
  X,
  UserPlus,
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

// ── Shared ──────────────────────────────────────────────────

function Tab({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 touch-manipulation items-center justify-center gap-2 border-b-2 py-2.5 text-sm font-medium transition ${
        active
          ? "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300"
          : "border-transparent text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
      }`}
    >
      {icon}
      {label}
    </button>
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

// ── Single lead form ────────────────────────────────────────

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  source: "Ads",
  budget: "",
  courseInterest: "",
  tags: "",
  followUpDate: "",
};

function SingleForm({ lead, onSubmit, saving }) {
  const editing = !!lead;
  const { courses } = useCourses();
  const [form, setForm] = useState(EMPTY);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        phone: lead.phone,
        email: lead.email || "",
        source: lead.source,
        budget: lead.budget || "",
        courseInterest: lead.courseInterest || "",
        tags: (lead.tags || []).join(", "),
        followUpDate: lead.followUpDate
          ? new Date(lead.followUpDate).toISOString().split("T")[0]
          : "",
      });
      setShowMore(true);
    }
  }, [lead]);

  function set(key) {
    return (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      source: form.source,
      status: "new",
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
    <form onSubmit={handleSubmit} className="space-y-3 p-5">
      {/* Essential fields */}
      <Field label="Name *">
        <input
          required
          value={form.name}
          onChange={set("name")}
          placeholder="Full name"
          className="input"
          autoFocus
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Phone *">
          <input
            required
            value={form.phone}
            onChange={set("phone")}
            placeholder="+91 00000 00000"
            className="input"
          />
        </Field>
        <Field label="Source">
          <select value={form.source} onChange={set("source")} className="input">
            {SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Toggle for optional fields */}
      {!showMore && (
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="flex items-center gap-1 text-xs font-medium text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <ChevronDown size={14} />
          More details (optional)
        </button>
      )}

      {showMore && (
        <div className="space-y-3 rounded-lg border border-stone-200 bg-stone-50/50 p-3 dark:border-stone-800 dark:bg-stone-900/30">
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="email@example.com"
              className="input"
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
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
                {courses.map((c) => (
                  <option key={c._id} value={c.title}>{c.title}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
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
          </div>
        </div>
      )}

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-400"
        >
          {saving ? "Saving…" : editing ? "Save Changes" : "Add Lead"}
        </button>
      </div>
    </form>
  );
}

// ── CSV bulk upload ─────────────────────────────────────────

const TEMPLATE_HEADERS = [
  "name",
  "phone",
  "email",
  "source",
  "budget",
  "courseInterest",
  "tags",
  "followUpDate",
];

const SAMPLE_ROWS = [
  ["Rahul Sharma", "+91 98765 43210", "rahul@example.com", "Ads", "₹15,000", "Full Stack Development", "student; hot-lead", "2026-04-01"],
  ["Priya Patel", "+91 87654 32109", "priya@example.com", "Organic", "₹20,000", "Digital Marketing", "freelancer", ""],
];

function csvEscape(value) {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadTemplate() {
  const lines = [
    TEMPLATE_HEADERS.join(","),
    ...SAMPLE_ROWS.map((r) => r.map(csvEscape).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function CsvUpload({ onDone }) {
  const fileRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [parseError, setParseError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError("");
    setResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete(res) {
        if (res.errors.length > 0) {
          setParseError(
            res.errors.map((e) => `Row ${e.row}: ${e.message}`).join("; ")
          );
        }
        setRows(res.data);
      },
      error(err) {
        setParseError(err.message);
      },
    });
  }

  async function handleUpload() {
    if (rows.length === 0) return;
    setUploading(true);
    setResult(null);

    try {
      const res = await fetch("/api/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: rows }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({ success: false, message: data.error });
      } else {
        setResult({
          success: true,
          imported: data.imported,
          errors: data.errors,
          total: data.total,
        });
        if (data.imported > 0) onDone();
      }
    } catch (err) {
      setResult({ success: false, message: err.message });
    } finally {
      setUploading(false);
    }
  }

  function reset() {
    setRows([]);
    setParseError("");
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const validRows = rows.filter((r) => r.name?.trim() && r.phone?.trim());

  return (
    <div className="space-y-4 p-5">
      {/* Template */}
      <button
        onClick={downloadTemplate}
        className="flex w-full items-center gap-3 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3 text-left transition hover:border-stone-400 dark:border-stone-700 dark:bg-stone-900/50 dark:hover:border-stone-600"
      >
        <FileSpreadsheet size={18} className="shrink-0 text-stone-400" />
        <div className="flex-1">
          <p className="text-sm font-medium">Download CSV template</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            name, phone, email, source, budget, courseInterest, tags, followUpDate
          </p>
        </div>
        <Download size={16} className="shrink-0 text-stone-400" />
      </button>

      {/* File picker */}
      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFile}
        className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-emerald-700 file:transition hover:file:bg-emerald-100 dark:text-stone-400 dark:file:bg-emerald-950/50 dark:file:text-emerald-300"
      />

      {parseError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <p>{parseError}</p>
        </div>
      )}

      {/* Preview */}
      {rows.length > 0 && !result?.success && (
        <div className="max-h-52 overflow-auto rounded-lg border border-stone-200 dark:border-stone-700">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-stone-100 dark:bg-stone-800">
              <tr>
                <th className="px-2 py-1.5 font-medium">#</th>
                <th className="px-2 py-1.5 font-medium">Name</th>
                <th className="px-2 py-1.5 font-medium">Phone</th>
                <th className="px-2 py-1.5 font-medium">Source</th>
                <th className="px-2 py-1.5 font-medium">Course</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {rows.slice(0, 50).map((row, i) => {
                const missing = !row.name?.trim() || !row.phone?.trim();
                return (
                  <tr
                    key={i}
                    className={
                      missing
                        ? "bg-red-50/60 dark:bg-red-950/20"
                        : "bg-white dark:bg-stone-900"
                    }
                  >
                    <td className="px-2 py-1 text-stone-400">{i + 1}</td>
                    <td className="px-2 py-1">{row.name || "—"}</td>
                    <td className="px-2 py-1">{row.phone || "—"}</td>
                    <td className="px-2 py-1">{row.source || "—"}</td>
                    <td className="px-2 py-1">{row.courseInterest || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length > 50 && (
            <p className="border-t border-stone-200 px-3 py-1.5 text-center text-xs text-stone-400 dark:border-stone-700">
              Showing first 50 of {rows.length}
            </p>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
            result.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
          }`}
        >
          {result.success ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
          )}
          <div>
            {result.success ? (
              <>
                <p className="font-medium">
                  {result.imported} of {result.total} leads imported
                </p>
                {result.errors.length > 0 && (
                  <ul className="mt-1 space-y-0.5 text-xs opacity-80">
                    {result.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>Row {err.row}: {err.message}</li>
                    ))}
                    {result.errors.length > 5 && (
                      <li>…and {result.errors.length - 5} more</li>
                    )}
                  </ul>
                )}
              </>
            ) : (
              <p>{result.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {rows.length > 0 && !result?.success && (
          <button
            onClick={reset}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            Clear
          </button>
        )}
        {result?.success ? (
          <button
            onClick={reset}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Upload more
          </button>
        ) : (
          <button
            onClick={handleUpload}
            disabled={validRows.length === 0 || uploading}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-40 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            <Upload size={14} />
            {uploading
              ? "Uploading…"
              : `Import ${validRows.length} lead${validRows.length !== 1 ? "s" : ""}`}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main modal ──────────────────────────────────────────────

export default function AddLeads({
  lead,
  onSubmitSingle,
  onBulkDone,
  onClose,
  saving,
}) {
  const editing = !!lead;
  const [tab, setTab] = useState(editing ? "single" : "single");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 p-0 sm:items-start sm:p-4 sm:pt-16">
      <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-stone-200 border-b-0 bg-white pb-[env(safe-area-inset-bottom)] shadow-xl sm:max-h-[calc(100dvh-4rem)] sm:rounded-xl sm:border-b dark:border-stone-700 dark:bg-stone-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 dark:border-stone-700 dark:bg-stone-900 sm:px-5">
          <h2 className="text-base font-semibold">
            {editing ? "Edit Lead" : "Add Leads"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="touch-manipulation rounded-md p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs (hidden when editing) */}
        {!editing && (
          <div className="flex border-b border-stone-200 dark:border-stone-700">
            <Tab
              active={tab === "single"}
              onClick={() => setTab("single")}
              icon={<UserPlus size={15} />}
              label="Single"
            />
            <Tab
              active={tab === "csv"}
              onClick={() => setTab("csv")}
              icon={<Upload size={15} />}
              label="CSV Upload"
            />
          </div>
        )}

        {/* Content */}
        {tab === "single" && (
          <SingleForm lead={lead} onSubmit={onSubmitSingle} saving={saving} />
        )}
        {tab === "csv" && !editing && <CsvUpload onDone={onBulkDone} />}
      </div>
    </div>
  );
}
