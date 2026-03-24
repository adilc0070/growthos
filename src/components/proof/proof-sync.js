"use client";

import { useState } from "react";
import * as api from "@/lib/proof-api";
import { TESTIMONIAL_TYPES } from "@/lib/proof-data";
import { Loader2, RefreshCw, Copy, Check, Globe } from "lucide-react";

export default function ProofSync() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState("10");
  const [type, setType] = useState("all");
  const [copied, setCopied] = useState(false);

  async function handleSync() {
    setLoading(true);
    try {
      const result = await api.fetchSyncData({ limit, type });
      setData(result);
    } catch (err) {
      alert("Sync failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyEndpoint() {
    const params = new URLSearchParams();
    if (limit) params.set("limit", limit);
    if (type && type !== "all") params.set("type", type);
    const url = `${window.location.origin}/api/proof/sync?${params}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyJson() {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
        <h3 className="mb-1 text-sm font-semibold text-stone-900 dark:text-stone-100">
          Landing Page Proof Sync
        </h3>
        <p className="mb-4 text-xs text-stone-500">
          Fetch published testimonials and case studies for your landing page. Use the API endpoint or copy the JSON directly.
        </p>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Limit</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              min="1"
              max="50"
              className="input w-20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="input">
              <option value="all">All</option>
              {TESTIMONIAL_TYPES.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSync}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Fetch Data
          </button>
          <button
            onClick={handleCopyEndpoint}
            className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <Globe size={16} />
            {copied ? "Copied!" : "Copy API URL"}
          </button>
        </div>
      </div>

      {data && (
        <div className="space-y-4">
          <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Synced Data
              </h3>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>
                  {data.testimonials?.length || 0} testimonials · {data.caseStudies?.length || 0} case studies
                </span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 rounded-md border border-stone-300 px-2 py-1 text-xs font-medium text-stone-600 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-400"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  Copy JSON
                </button>
              </div>
            </div>

            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-stone-50 p-4 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
