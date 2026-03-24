"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/sales-api";
import { SCRIPT_CATEGORIES, getWhatsAppUrl } from "@/lib/sales-data";
import {
  Plus, Database, Copy, MessageCircle, Pencil, Trash2,
  Loader2, ChevronDown, ChevronUp, X, Check,
} from "lucide-react";

export default function ScriptsLibrary() {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await api.fetchScripts(category);
      setScripts(data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { load(); }, [load]);

  async function handleSeed() {
    try {
      const res = await api.seedScripts();
      if (res.seeded) await load();
      else alert(res.message);
    } catch (err) {
      alert("Seed failed: " + err.message);
    }
  }

  async function handleSave(data) {
    try {
      if (editing) {
        await api.updateScript(editing._id, data);
      } else {
        await api.createScript(data);
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this script?")) return;
    try {
      await api.deleteScript(id);
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select-sm"
        >
          <option value="all">All Categories</option>
          {SCRIPT_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          {scripts.length === 0 && (
            <button onClick={handleSeed} className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800">
              <Database size={16} /> Seed Scripts
            </button>
          )}
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            <Plus size={16} /> Add Script
          </button>
        </div>
      </div>

      {scripts.length === 0 && !loading && (
        <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <p className="text-sm text-stone-500">No scripts yet. Seed demo scripts or add your own.</p>
        </div>
      )}

      <div className="space-y-3">
        {scripts.map((script) => (
          <div
            key={script._id}
            className="rounded-lg border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
          >
            <button
              onClick={() => setExpanded(expanded === script._id ? null : script._id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {script.title}
                  </h3>
                  {script.whatsappReady && (
                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                      WhatsApp Ready
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-stone-500">{script.category}</p>
              </div>
              {expanded === script._id ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
            </button>

            {expanded === script._id && (
              <div className="border-t border-stone-200 p-4 dark:border-stone-800">
                <pre className="whitespace-pre-wrap rounded-lg bg-stone-50 p-4 text-sm text-stone-700 dark:bg-stone-950 dark:text-stone-300">
                  {script.content}
                </pre>

                {script.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {script.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(script.content, script._id)}
                    className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    {copied === script._id ? <Check size={14} /> : <Copy size={14} />}
                    {copied === script._id ? "Copied!" : "Copy"}
                  </button>
                  {script.whatsappReady && (
                    <a
                      href={getWhatsAppUrl("919876543210", script.content)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                    >
                      <MessageCircle size={14} /> Send via WhatsApp
                    </a>
                  )}
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={() => { setEditing(script); setShowForm(true); }}
                      className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(script._id)}
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
        <ScriptFormModal
          script={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function ScriptFormModal({ script, onSave, onClose }) {
  const [title, setTitle] = useState(script?.title || "");
  const [category, setCategory] = useState(script?.category || "General");
  const [content, setContent] = useState(script?.content || "");
  const [tags, setTags] = useState(script?.tags?.join(", ") || "");
  const [whatsappReady, setWhatsappReady] = useState(script?.whatsappReady || false);

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      title,
      category,
      content,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      whatsappReady,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{script ? "Edit Script" : "Add Script"}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Script title" required className="input" />

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
            {SCRIPT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Script content... Use {name}, {course}, {salesperson} as placeholders"
            required
            rows={8}
            className="input"
          />

          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" className="input" />

          <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
            <input type="checkbox" checked={whatsappReady} onChange={(e) => setWhatsappReady(e.target.checked)} className="rounded" />
            WhatsApp ready (short enough to send directly)
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            {script ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
