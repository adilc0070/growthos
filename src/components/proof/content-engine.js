"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/proof-api";
import {
  TEMPLATE_CATEGORIES, TEMPLATE_PLATFORMS,
  CATEGORY_LABELS, PLATFORM_LABELS,
} from "@/lib/proof-data";
import {
  Plus, Loader2, Trash2, Pencil, X, Copy, Wand2, Database, Check,
} from "lucide-react";

export default function ContentEngine() {
  const [templates, setTemplates] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("all");
  const [platFilter, setPlatFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorTemplate, setGeneratorTemplate] = useState(null);

  const load = useCallback(async () => {
    try {
      const [tpls, tsts] = await Promise.all([
        api.fetchTemplates({ category: catFilter, platform: platFilter }),
        api.fetchTestimonials({ status: "published" }),
      ]);
      setTemplates(tpls);
      setTestimonials(tsts);
    } catch {} finally {
      setLoading(false);
    }
  }, [catFilter, platFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(data) {
    try {
      if (editing) {
        await api.updateTemplate(editing._id, data);
      } else {
        await api.createTemplate(data);
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
      await api.deleteTemplate(id);
      await load();
    } catch (err) {
      alert("Delete failed: " + err.message);
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
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="select-sm">
          <option value="all">All Categories</option>
          {TEMPLATE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>

        <select value={platFilter} onChange={(e) => setPlatFilter(e.target.value)} className="select-sm">
          <option value="all">All Platforms</option>
          {TEMPLATE_PLATFORMS.map((p) => (
            <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={async () => {
              try {
                const res = await api.seedTemplates();
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
            <Plus size={16} /> Add Template
          </button>
        </div>
      </div>

      {templates.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <p className="text-sm text-stone-500">No templates found.</p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl) => (
          <div
            key={tpl._id}
            className="flex flex-col rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="mb-2 flex items-center gap-2">
              <h3 className="flex-1 truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                {tpl.title}
              </h3>
              {tpl.isDefault && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  Default
                </span>
              )}
            </div>

            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                {CATEGORY_LABELS[tpl.category] || tpl.category}
              </span>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-400">
                {PLATFORM_LABELS[tpl.platform] || tpl.platform}
              </span>
            </div>

            <pre className="mb-3 flex-1 whitespace-pre-wrap rounded-lg bg-stone-50 p-3 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400">
              {tpl.template.slice(0, 200)}
              {tpl.template.length > 200 ? "..." : ""}
            </pre>

            {tpl.variables?.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {tpl.variables.map((v) => (
                  <span key={v} className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500 dark:bg-stone-800">
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 border-t border-stone-100 pt-3 dark:border-stone-800">
              <button
                onClick={() => { setGeneratorTemplate(tpl); setShowGenerator(true); }}
                className="flex items-center gap-1 rounded-md bg-purple-50 px-2.5 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-400 dark:hover:bg-purple-950"
              >
                <Wand2 size={13} /> Generate
              </button>
              <button
                onClick={() => { setEditing(tpl); setShowForm(true); }}
                className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-stone-600 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-800"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                onClick={() => handleDelete(tpl._id)}
                className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <TemplateFormModal
          template={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {showGenerator && generatorTemplate && (
        <GeneratorModal
          template={generatorTemplate}
          testimonials={testimonials}
          onClose={() => { setShowGenerator(false); setGeneratorTemplate(null); }}
        />
      )}
    </div>
  );
}

function TemplateFormModal({ template, onSave, onClose }) {
  const [title, setTitle] = useState(template?.title || "");
  const [category, setCategory] = useState(template?.category || "social_post");
  const [platform, setPlatform] = useState(template?.platform || "universal");
  const [tplContent, setTplContent] = useState(template?.template || "");
  const [variables, setVariables] = useState((template?.variables || []).join(", "));

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      title, category, platform,
      template: tplContent,
      variables: variables.split(",").map((v) => v.trim()).filter(Boolean),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{template ? "Edit Template" : "Add Template"}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Template title" required className="input" />

          <div className="grid grid-cols-2 gap-3">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              {TEMPLATE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="input">
              {TEMPLATE_PLATFORMS.map((p) => (
                <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
              ))}
            </select>
          </div>

          <textarea
            value={tplContent}
            onChange={(e) => setTplContent(e.target.value)}
            placeholder={"Template content...\nUse {{variableName}} for placeholders"}
            rows={8}
            required
            className="input font-mono text-xs"
          />

          <input
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
            placeholder="Variables (comma-separated, e.g. studentName, amount, quote)"
            className="input"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            {template ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

function GeneratorModal({ template, testimonials, onClose }) {
  const [testimonialId, setTestimonialId] = useState("");
  const [variables, setVariables] = useState({});
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const result = await api.generateContent({
        templateId: template._id,
        testimonialId: testimonialId || undefined,
        variables,
      });
      setOutput(result.generated);
    } catch (err) {
      alert("Generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Generate Content</h2>
          <button onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <p className="mb-3 text-xs text-stone-500">
          Template: <span className="font-medium text-stone-700 dark:text-stone-300">{template.title}</span>
          {" · "}{PLATFORM_LABELS[template.platform]}
        </p>

        <div className="space-y-3">
          {testimonials.length > 0 && (
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500">
                Auto-fill from testimonial (optional)
              </label>
              <select
                value={testimonialId}
                onChange={(e) => setTestimonialId(e.target.value)}
                className="input"
              >
                <option value="">Select testimonial...</option>
                {testimonials.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.studentName} — {t.type}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(template.variables || []).length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-stone-500">Variables</p>
              <div className="grid grid-cols-2 gap-2">
                {template.variables.map((v) => (
                  <input
                    key={v}
                    value={variables[v] || ""}
                    onChange={(e) => setVariables((prev) => ({ ...prev, [v]: e.target.value }))}
                    placeholder={v}
                    className="input text-xs"
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            Generate Content
          </button>

          {output && (
            <div className="relative">
              <pre className="whitespace-pre-wrap rounded-lg bg-stone-50 p-4 text-sm text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                {output}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-stone-600 shadow-sm hover:bg-stone-50 dark:bg-stone-700 dark:text-stone-300"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
