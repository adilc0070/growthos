"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/proof-api";
import {
  TESTIMONIAL_TYPES, TESTIMONIAL_STATUSES, TESTIMONIAL_TAGS, PLATFORMS,
  TYPE_COLORS, STATUS_COLORS, TAG_COLORS, PLATFORM_LABELS, formatDate, formatCurrency,
} from "@/lib/proof-data";
import {
  Plus, Loader2, Trash2, Pencil, X, ChevronDown, ChevronUp,
  Video, FileText, Image, Star, StarOff, Eye, MousePointerClick,
  TrendingUp, Database,
} from "lucide-react";

const TYPE_ICONS = { video: Video, text: FileText, screenshot: Image };

export default function TestimonialList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await api.fetchTestimonials({
        type: typeFilter,
        status: statusFilter,
        tag: tagFilter,
      });
      setItems(data);
    } catch {} finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, tagFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(data) {
    try {
      if (editing) {
        await api.updateTestimonial(editing._id, data);
      } else {
        await api.createTestimonial(data);
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await api.deleteTestimonial(id);
      await load();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  }

  async function handleToggleFeatured(item) {
    try {
      await api.updateTestimonial(item._id, { featured: !item.featured });
      await load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleStatusChange(item, newStatus) {
    try {
      await api.updateTestimonial(item._id, { status: newStatus });
      await load();
    } catch (err) {
      alert(err.message);
    }
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
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="select-sm">
          <option value="all">All Types</option>
          {TESTIMONIAL_TYPES.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-sm">
          <option value="all">All Statuses</option>
          {TESTIMONIAL_STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="select-sm">
          <option value="all">All Tags</option>
          {TESTIMONIAL_TAGS.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={async () => {
              try {
                const res = await api.seedTestimonials();
                if (!res.seeded) alert(res.message);
                else await load();
              } catch (err) { alert(err.message); }
            }}
            className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <Database size={16} /> Seed
          </button>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            <Plus size={16} /> Add Testimonial
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <p className="text-sm text-stone-500">No testimonials found.</p>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => {
          const TypeIcon = TYPE_ICONS[item.type] || FileText;
          return (
            <div
              key={item._id}
              className="rounded-lg border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
            >
              <button
                onClick={() => setExpanded(expanded === item._id ? null : item._id)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
                  <TypeIcon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {item.studentName}
                    </h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[item.status]}`}>
                      {item.status}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[item.type]}`}>
                      {item.type}
                    </span>
                    {item.featured && (
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-stone-500">
                    {item.content?.slice(0, 80)}
                    {(item.content?.length || 0) > 80 ? "..." : ""}
                  </p>
                </div>
                <div className="hidden items-center gap-4 sm:flex">
                  {item.resultAmount > 0 && (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(item.resultAmount)}
                    </span>
                  )}
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <span className="flex items-center gap-0.5"><Eye size={12} /> {item.views}</span>
                    <span className="flex items-center gap-0.5"><MousePointerClick size={12} /> {item.clicks}</span>
                    <span className="flex items-center gap-0.5"><TrendingUp size={12} /> {item.conversions}</span>
                  </div>
                </div>
                {expanded === item._id ? (
                  <ChevronUp size={16} className="text-stone-400" />
                ) : (
                  <ChevronDown size={16} className="text-stone-400" />
                )}
              </button>

              {expanded === item._id && (
                <div className="border-t border-stone-200 p-4 dark:border-stone-800">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-stone-500">Content</p>
                      <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                        {item.content || "—"}
                      </p>
                      {item.mediaUrl && (
                        <a
                          href={item.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-xs text-emerald-600 underline dark:text-emerald-400"
                        >
                          View media
                        </a>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-stone-500">Result</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(item.resultAmount)}
                      </p>
                      <p className="text-xs text-stone-500">{item.resultDescription || "—"}</p>
                      <p className="text-xs text-stone-500">
                        Platform: {PLATFORM_LABELS[item.platform] || item.platform}
                      </p>
                      <p className="text-xs text-stone-500">Added: {formatDate(item.createdAt)}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-stone-500">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {(item.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TAG_COLORS[tag] || "bg-stone-100 text-stone-600"}`}
                          >
                            {tag}
                          </span>
                        ))}
                        {(!item.tags || item.tags.length === 0) && (
                          <span className="text-xs text-stone-400">No tags</span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-stone-500 pt-2">Performance</p>
                      <div className="flex gap-3 text-xs text-stone-600 dark:text-stone-400">
                        <span>{item.views} views</span>
                        <span>{item.clicks} clicks</span>
                        <span>{item.conversions} conv.</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item, e.target.value)}
                      className="rounded-md border border-stone-300 px-2 py-1 text-xs dark:border-stone-600 dark:bg-stone-800"
                    >
                      {TESTIMONIAL_STATUSES.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
                    >
                      {item.featured ? <StarOff size={14} /> : <Star size={14} />}
                      {item.featured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      onClick={() => { setEditing(item); setShowForm(true); }}
                      className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showForm && (
        <TestimonialFormModal
          testimonial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function TestimonialFormModal({ testimonial, onSave, onClose }) {
  const [studentName, setStudentName] = useState(testimonial?.studentName || "");
  const [type, setType] = useState(testimonial?.type || "text");
  const [content, setContent] = useState(testimonial?.content || "");
  const [mediaUrl, setMediaUrl] = useState(testimonial?.mediaUrl || "");
  const [tags, setTags] = useState(testimonial?.tags || []);
  const [resultAmount, setResultAmount] = useState(testimonial?.resultAmount || 0);
  const [resultDescription, setResultDescription] = useState(testimonial?.resultDescription || "");
  const [platform, setPlatform] = useState(testimonial?.platform || "direct");
  const [status, setStatus] = useState(testimonial?.status || "pending");

  function toggleTag(tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      studentName, type, content, mediaUrl, tags,
      resultAmount: Number(resultAmount), resultDescription, platform, status,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{testimonial ? "Edit Testimonial" : "Add Testimonial"}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name" required className="input" />

          <select value={type} onChange={(e) => setType(e.target.value)} className="input">
            {TESTIMONIAL_TYPES.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Testimonial content or description..."
            rows={3}
            className="input"
          />

          {(type === "video" || type === "screenshot") && (
            <input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="Media URL" className="input" />
          )}

          <div>
            <p className="mb-1.5 text-xs font-medium text-stone-500">Tags</p>
            <div className="flex flex-wrap gap-2">
              {TESTIMONIAL_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    tags.includes(tag)
                      ? TAG_COLORS[tag]
                      : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={resultAmount}
              onChange={(e) => setResultAmount(e.target.value)}
              placeholder="Result amount (₹)"
              className="input"
            />
            <input
              value={resultDescription}
              onChange={(e) => setResultDescription(e.target.value)}
              placeholder="Result description"
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="input">
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
              ))}
            </select>

            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
              {TESTIMONIAL_STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            {testimonial ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
