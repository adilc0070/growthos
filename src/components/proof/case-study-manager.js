"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/proof-api";
import { CASE_STUDY_STATUSES, STATUS_COLORS, formatDate } from "@/lib/proof-data";
import {
  Plus, Loader2, Trash2, Pencil, X, ChevronDown, ChevronUp,
  BookOpen, Star, StarOff,
} from "lucide-react";

export default function CaseStudyManager() {
  const [studies, setStudies] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    try {
      const [s, t] = await Promise.all([
        api.fetchCaseStudies({ status: statusFilter }),
        api.fetchTestimonials({ status: "published" }),
      ]);
      setStudies(s);
      setTestimonials(t);
    } catch {} finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(data) {
    try {
      if (editing) {
        await api.updateCaseStudy(editing._id, data);
      } else {
        await api.createCaseStudy(data);
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this case study?")) return;
    try {
      await api.deleteCaseStudy(id);
      await load();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  }

  async function handleToggleFeatured(item) {
    try {
      await api.updateCaseStudy(item._id, { featured: !item.featured });
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
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-sm">
          <option value="all">All Statuses</option>
          {CASE_STUDY_STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="ml-auto flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
        >
          <Plus size={16} /> Add Case Study
        </button>
      </div>

      {studies.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <p className="text-sm text-stone-500">No case studies yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {studies.map((study) => (
          <div
            key={study._id}
            className="rounded-lg border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
          >
            <button
              onClick={() => setExpanded(expanded === study._id ? null : study._id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                <BookOpen size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {study.title}
                  </h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[study.status]}`}>
                    {study.status}
                  </span>
                  {study.featured && (
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-stone-500">
                  {study.studentName} · {formatDate(study.createdAt)}
                </p>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                {(study.tags || []).slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                    {tag}
                  </span>
                ))}
              </div>
              {expanded === study._id ? (
                <ChevronUp size={16} className="text-stone-400" />
              ) : (
                <ChevronDown size={16} className="text-stone-400" />
              )}
            </button>

            {expanded === study._id && (
              <div className="border-t border-stone-200 p-4 dark:border-stone-800">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="mb-1 text-xs font-medium text-stone-500">Challenge</p>
                    <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                      {study.challenge || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-stone-500">Solution</p>
                    <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                      {study.solution || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-stone-500">Results</p>
                    <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                      {study.results || "—"}
                    </p>
                  </div>
                </div>

                {study.description && (
                  <div className="mt-3">
                    <p className="mb-1 text-xs font-medium text-stone-500">Description</p>
                    <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                      {study.description}
                    </p>
                  </div>
                )}

                {study.testimonials?.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 text-xs font-medium text-stone-500">
                      Linked Testimonials ({study.testimonials.length})
                    </p>
                    <div className="space-y-1">
                      {study.testimonials.map((t) => (
                        <p key={t._id} className="text-xs text-stone-600 dark:text-stone-400">
                          {t.studentName} — {t.type} — &quot;{t.content?.slice(0, 60)}...&quot;
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFeatured(study)}
                    className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    {study.featured ? <StarOff size={14} /> : <Star size={14} />}
                    {study.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    onClick={() => { setEditing(study); setShowForm(true); }}
                    className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(study._id)}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <CaseStudyFormModal
          study={editing}
          testimonials={testimonials}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function CaseStudyFormModal({ study, testimonials, onSave, onClose }) {
  const [title, setTitle] = useState(study?.title || "");
  const [studentName, setStudentName] = useState(study?.studentName || "");
  const [description, setDescription] = useState(study?.description || "");
  const [challenge, setChallenge] = useState(study?.challenge || "");
  const [solution, setSolution] = useState(study?.solution || "");
  const [results, setResults] = useState(study?.results || "");
  const [tags, setTags] = useState((study?.tags || []).join(", "));
  const [status, setStatus] = useState(study?.status || "draft");
  const [selectedTestimonials, setSelectedTestimonials] = useState(
    (study?.testimonials || []).map((t) => t._id || t)
  );

  function toggleTestimonial(id) {
    setSelectedTestimonials((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      title, studentName, description, challenge, solution, results,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      status,
      testimonials: selectedTestimonials,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{study ? "Edit Case Study" : "Add Case Study"}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Case study title" required className="input" />
          <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name" required className="input" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." rows={2} className="input" />
          <textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} placeholder="What was the challenge?" rows={2} className="input" />
          <textarea value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="What was the solution?" rows={2} className="input" />
          <textarea value={results} onChange={(e) => setResults(e.target.value)} placeholder="What were the results?" rows={2} className="input" />
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" className="input" />

          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
            {CASE_STUDY_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          {testimonials.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-stone-500">Link Testimonials</p>
              <div className="max-h-32 overflow-y-auto space-y-1 rounded-lg border border-stone-200 p-2 dark:border-stone-700">
                {testimonials.map((t) => (
                  <label key={t._id} className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTestimonials.includes(t._id)}
                      onChange={() => toggleTestimonial(t._id)}
                    />
                    {t.studentName} — {t.type}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            {study ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
