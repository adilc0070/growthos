"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  FileJson,
  ClipboardPaste,
} from "lucide-react";

const SAMPLE_DATA = [
  {
    from_me: false,
    timestamp: 1774545318,
    source: "UAV/CAN",
    body: "Hi, I want to know about your Full Stack course",
    from: "+919876543210",
    to: "+911234567890",
    from_name: "Rahul Sharma",
    type: "text",
    audio_file: "",
    forwarded: false,
  },
  {
    from_me: true,
    timestamp: 1774545400,
    source: "UAV/CAN",
    body: "Hi Rahul! Sure, let me share the details.",
    from: "+911234567890",
    to: "+919876543210",
    from_name: "",
    type: "text",
    audio_file: "",
    forwarded: false,
  },
];

function Tab({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-2.5 text-sm font-medium transition ${
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

function downloadTemplate() {
  const blob = new Blob([JSON.stringify(SAMPLE_DATA, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "whatsapp-messages-template.json";
  a.click();
  URL.revokeObjectURL(url);
}

export default function WhatsAppBulkUpload({ onClose, onDone }) {
  const [tab, setTab] = useState("file");
  const fileRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [jsonText, setJsonText] = useState("");
  const [parseError, setParseError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError("");
    setResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const arr = Array.isArray(data) ? data : [data];
        setMessages(arr);
      } catch {
        setParseError("Invalid JSON file");
        setMessages([]);
      }
    };
    reader.readAsText(file);
  }

  function handlePasteSubmit() {
    setParseError("");
    setResult(null);
    try {
      const data = JSON.parse(jsonText);
      const arr = Array.isArray(data) ? data : [data];
      setMessages(arr);
    } catch {
      setParseError("Invalid JSON. Please paste a valid JSON array.");
      setMessages([]);
    }
  }

  async function handleUpload() {
    if (messages.length === 0) return;
    setUploading(true);
    setResult(null);

    try {
      const res = await fetch("/api/automation/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messages),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({ success: false, message: data.error });
      } else {
        setResult({
          success: true,
          processed: data.processed,
          leadsCreated: data.leads_created,
          errors: data.errors || [],
        });
        if (data.processed > 0 && onDone) onDone();
      }
    } catch (err) {
      setResult({ success: false, message: err.message });
    } finally {
      setUploading(false);
    }
  }

  function reset() {
    setMessages([]);
    setJsonText("");
    setParseError("");
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16">
      <div className="w-full max-w-lg rounded-xl border border-stone-200 bg-white shadow-xl dark:border-stone-700 dark:bg-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3 dark:border-stone-700">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <MessageCircle size={18} className="text-green-600" />
            WhatsApp Bulk Upload
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-700">
          <Tab
            active={tab === "file"}
            onClick={() => { setTab("file"); reset(); }}
            icon={<FileJson size={15} />}
            label="JSON File"
          />
          <Tab
            active={tab === "paste"}
            onClick={() => { setTab("paste"); reset(); }}
            icon={<ClipboardPaste size={15} />}
            label="Paste JSON"
          />
        </div>

        <div className="space-y-4 p-5">
          {/* Template download */}
          <button
            onClick={downloadTemplate}
            className="flex w-full items-center gap-3 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3 text-left transition hover:border-stone-400 dark:border-stone-700 dark:bg-stone-900/50 dark:hover:border-stone-600"
          >
            <FileJson size={18} className="shrink-0 text-stone-400" />
            <div className="flex-1">
              <p className="text-sm font-medium">Download JSON template</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Sample array with from_me, body, from, to, timestamp…
              </p>
            </div>
            <Download size={16} className="shrink-0 text-stone-400" />
          </button>

          {tab === "file" && (
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFile}
              className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-green-700 file:transition hover:file:bg-green-100 dark:text-stone-400 dark:file:bg-green-950/50 dark:file:text-green-300"
            />
          )}

          {tab === "paste" && (
            <div className="space-y-2">
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='Paste JSON array here…\n[\n  { "from_me": false, "body": "Hi", ... }\n]'
                rows={6}
                className="input w-full resize-y font-mono text-xs"
              />
              <button
                onClick={handlePasteSubmit}
                disabled={!jsonText.trim()}
                className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-200 disabled:opacity-40 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
              >
                Parse JSON
              </button>
            </div>
          )}

          {parseError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <p>{parseError}</p>
            </div>
          )}

          {/* Preview */}
          {messages.length > 0 && !result?.success && (
            <div className="max-h-52 overflow-auto rounded-lg border border-stone-200 dark:border-stone-700">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-stone-100 dark:bg-stone-800">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">#</th>
                    <th className="px-2 py-1.5 font-medium">Dir</th>
                    <th className="px-2 py-1.5 font-medium">From</th>
                    <th className="px-2 py-1.5 font-medium">Body</th>
                    <th className="px-2 py-1.5 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {messages.slice(0, 50).map((msg, i) => (
                    <tr key={i} className="bg-white dark:bg-stone-900">
                      <td className="px-2 py-1 text-stone-400">{i + 1}</td>
                      <td className="px-2 py-1">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${msg.from_me ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"}`}>
                          {msg.from_me ? "Sent" : "Received"}
                        </span>
                      </td>
                      <td className="max-w-[100px] truncate px-2 py-1">
                        {msg.from_name || msg.from || "—"}
                      </td>
                      <td className="max-w-[140px] truncate px-2 py-1">
                        {msg.body || "—"}
                      </td>
                      <td className="px-2 py-1">{msg.type || "text"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {messages.length > 50 && (
                <p className="border-t border-stone-200 px-3 py-1.5 text-center text-xs text-stone-400 dark:border-stone-700">
                  Showing first 50 of {messages.length}
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
                      {result.processed} messages processed
                    </p>
                    {result.leadsCreated > 0 && (
                      <p className="text-xs opacity-80">
                        {result.leadsCreated} new lead{result.leadsCreated !== 1 ? "s" : ""} created
                      </p>
                    )}
                    {result.errors.length > 0 && (
                      <ul className="mt-1 space-y-0.5 text-xs opacity-80">
                        {result.errors.slice(0, 5).map((err, i) => (
                          <li key={i}>
                            Message {err.index + 1}: {err.error}
                          </li>
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
            {messages.length > 0 && !result?.success && (
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
                disabled={messages.length === 0 || uploading}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-40 dark:bg-green-500 dark:hover:bg-green-400"
              >
                <Upload size={14} />
                {uploading
                  ? "Uploading…"
                  : `Import ${messages.length} message${messages.length !== 1 ? "s" : ""}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
