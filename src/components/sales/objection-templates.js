"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/sales-api";
import { OBJECTION_CATEGORIES } from "@/lib/sales-data";
import {
  Plus, Database, Copy, Pencil, Trash2, Loader2,
  ChevronDown, ChevronUp, X, Check, Lightbulb,
} from "lucide-react";

export default function ObjectionTemplates() {
  const [objections, setObjections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await api.fetchObjections(category);
      setObjections(data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { load(); }, [load]);

  async function handleSeed() {
    try {
      const res = await api.seedObjections();
      if (res.seeded) await load();
      else alert(res.message);
    } catch (err) {
      alert("Seed failed: " + err.message);
    }
  }

  async function handleSave(data) {
    try {
      if (editing) {
        await api.updateObjection(editing._id, data);
      } else {
        await api.createObjection(data);
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this template?")) return;
    try {
      await api.deleteObjection(id);
      await load();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  }

  function copyToClipboard(text, id) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const categoryColors = {
    Price: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    Timing: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    Trust: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
    Competition: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    General: "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="select-sm">
          <option value="all">All Categories</option>
          {OBJECTION_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          {objections.length === 0 && (
            <button onClick={handleSeed} className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800">
              <Database size={16} /> Seed Templates
            </button>
          )}
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            <Plus size={16} /> Add Template
          </button>
        </div>
      </div>

      {objections.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <p className="text-sm text-stone-500">No objection templates yet. Seed demo templates or add your own.</p>
        </div>
      )}

      <div className="space-y-3">
        {objections.map((obj) => (
          <div key={obj._id} className="rounded-lg border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
            <button
              onClick={() => setExpanded(expanded === obj._id ? null : obj._id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${categoryColors[obj.category] || categoryColors.General}`}>
                    {obj.category}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">
                  &ldquo;{obj.objection}&rdquo;
                </p>
              </div>
              {expanded === obj._id ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
            </button>

            {expanded === obj._id && (
              <div className="border-t border-stone-200 p-4 dark:border-stone-800">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-500">Response:</div>
                <pre className="whitespace-pre-wrap rounded-lg bg-stone-50 p-4 text-sm text-stone-700 dark:bg-stone-950 dark:text-stone-300">
                  {obj.response}
                </pre>

                {obj.tips && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                    <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-600" />
                    <p className="text-xs text-amber-800 dark:text-amber-300">{obj.tips}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(obj.response, obj._id)}
                    className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    {copied === obj._id ? <Check size={14} /> : <Copy size={14} />}
                    {copied === obj._id ? "Copied!" : "Copy Response"}
                  </button>
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={() => { setEditing(obj); setShowForm(true); }}
                      className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(obj._id)}
                      className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <ObjectionFormModal
          objection={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function ObjectionFormModal({ objection, onSave, onClose }) {
  const [obj, setObj] = useState(objection?.objection || "");
  const [category, setCategory] = useState(objection?.category || "General");
  const [response, setResponse] = useState(objection?.response || "");
  const [tips, setTips] = useState(objection?.tips || "");

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ objection: obj, category, response, tips });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{objection ? "Edit Template" : "Add Objection Template"}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <input value={obj} onChange={(e) => setObj(e.target.value)} placeholder='Customer says: "..."' required className="input" />

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
            {OBJECTION_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Your response script..."
            required
            rows={6}
            className="input"
          />

          <textarea
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder="Tips for handling this objection (optional)"
            rows={3}
            className="input"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            {objection ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
