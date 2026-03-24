"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { X, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";

const TEMPLATE_HEADERS = [
  "name",
  "phone",
  "email",
  "source",
  "status",
  "budget",
  "courseInterest",
  "tags",
  "followUpDate",
];

const SAMPLE_ROW = [
  "Rahul Sharma",
  "+91 98765 43210",
  "rahul@example.com",
  "Ads",
  "new",
  "₹15,000",
  "Full Stack Development",
  "student, hot-lead",
  "2026-04-01",
];

function csvEscape(value) {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadTemplate() {
  const header = TEMPLATE_HEADERS.join(",");
  const row = SAMPLE_ROW.map(csvEscape).join(",");
  const csv = [header, row].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function BulkUpload({ onClose, onDone }) {
  const fileRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
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
    setFileName("");
    setParseError("");
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const validRows = rows.filter((r) => r.name?.trim() && r.phone?.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16">
      <div className="w-full max-w-2xl rounded-xl border border-stone-200 bg-white shadow-xl dark:border-stone-700 dark:bg-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3 dark:border-stone-700">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Upload size={18} />
            Bulk Upload Leads
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Template download */}
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-900/50">
            <FileSpreadsheet size={20} className="shrink-0 text-stone-400" />
            <div className="flex-1">
              <p className="text-sm font-medium">CSV template</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Columns: name, phone, email, source, status, budget,
                courseInterest, tags, followUpDate
              </p>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <Download size={14} />
              Download
            </button>
          </div>

          {/* File picker */}
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400">
              Upload CSV file
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              className="mt-1 block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-emerald-700 file:transition hover:file:bg-emerald-100 dark:text-stone-400 dark:file:bg-emerald-950/50 dark:file:text-emerald-300"
            />
          </div>

          {parseError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{parseError}</p>
            </div>
          )}

          {/* Preview */}
          {rows.length > 0 && !result?.success && (
            <div>
              <p className="mb-2 text-xs font-medium text-stone-600 dark:text-stone-400">
                Preview ({rows.length} rows parsed, {validRows.length} valid)
              </p>
              <div className="max-h-64 overflow-auto rounded-lg border border-stone-200 dark:border-stone-700">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-stone-100 dark:bg-stone-800">
                    <tr>
                      <th className="px-2 py-1.5 font-medium">#</th>
                      <th className="px-2 py-1.5 font-medium">Name</th>
                      <th className="px-2 py-1.5 font-medium">Phone</th>
                      <th className="px-2 py-1.5 font-medium">Source</th>
                      <th className="px-2 py-1.5 font-medium">Status</th>
                      <th className="px-2 py-1.5 font-medium">Budget</th>
                      <th className="px-2 py-1.5 font-medium">Course</th>
                      <th className="px-2 py-1.5 font-medium">Tags</th>
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
                          <td className="px-2 py-1">{row.status || "—"}</td>
                          <td className="px-2 py-1">{row.budget || "—"}</td>
                          <td className="px-2 py-1">
                            {row.courseInterest || "—"}
                          </td>
                          <td className="px-2 py-1">{row.tags || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {rows.length > 50 && (
                  <p className="border-t border-stone-200 px-3 py-2 text-center text-xs text-stone-400 dark:border-stone-700">
                    Showing first 50 of {rows.length} rows
                  </p>
                )}
              </div>
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
                      successfully
                    </p>
                    {result.errors.length > 0 && (
                      <ul className="mt-1 space-y-0.5 text-xs opacity-80">
                        {result.errors.slice(0, 10).map((err, i) => (
                          <li key={i}>
                            Row {err.row}: {err.message}
                          </li>
                        ))}
                        {result.errors.length > 10 && (
                          <li>…and {result.errors.length - 10} more errors</li>
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
          <div className="flex justify-end gap-3 pt-2">
            {result?.success ? (
              <button
                onClick={onClose}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Done
              </button>
            ) : (
              <>
                {rows.length > 0 && (
                  <button
                    onClick={reset}
                    className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handleUpload}
                  disabled={validRows.length === 0 || uploading}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-40 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                >
                  <Upload size={16} />
                  {uploading
                    ? "Uploading…"
                    : `Import ${validRows.length} lead${validRows.length !== 1 ? "s" : ""}`}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
