"use client";

import { useState } from "react";
import {
  STATUSES, PERSONAS, TEMPERATURES, AD_SOURCES,
  formatDateTime, formatDate, isOverdue,
} from "@/lib/leads-data";
import {
  X,
  Phone,
  Mail,
  Calendar,
  Tag,
  Clock,
  MessageSquare,
  Pencil,
  Trash2,
  Plus,
  ChevronRight,
  Gauge,
  Flame,
  ClipboardCheck,
} from "lucide-react";

export default function LeadDetail({
  lead,
  onClose,
  onAddNote,
  onEdit,
  onDelete,
  onStatusChange,
  onQualify,
}) {
  const [tab, setTab] = useState("timeline");
  const [noteText, setNoteText] = useState("");

  if (!lead) return null;

  const status = STATUSES.find((s) => s.id === lead.status);
  const overdue = isOverdue(lead.followUpDate);
  const temp = TEMPERATURES.find((t) => t.id === (lead.temperature || "cold"));
  const personaInfo = PERSONAS.find((p) => p.id === lead.persona);
  const adSourceInfo = AD_SOURCES.find((a) => a.id === lead.adSource);
  const isQualified = !!lead.qualificationData?.qualifiedAt;

  function handleAddNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddNote(lead._id || lead.id, noteText.trim());
    setNoteText("");
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-stone-200 bg-white shadow-xl dark:border-stone-800 dark:bg-stone-950 sm:max-w-lg">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 p-4 dark:border-stone-800">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold leading-tight">
                {lead.name}
              </h2>
              {temp && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${temp.lightBg} ${temp.text} ${temp.border}`}
                >
                  <Flame size={10} />
                  {temp.label}
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1">
                <Phone size={13} /> {lead.phone}
              </span>
              {lead.email && (
                <span className="flex items-center gap-1">
                  <Mail size={13} /> {lead.email}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Score bar */}
        <div className="border-b border-stone-200 px-4 py-3 dark:border-stone-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-stone-600 dark:text-stone-400 flex items-center gap-1">
              <Gauge size={13} /> Lead Score
            </span>
            <span className="font-bold tabular-nums">{lead.leadScore || 0}/100</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
            <div
              className={`h-full rounded-full transition-all ${
                (lead.leadScore || 0) >= 65
                  ? "bg-red-500"
                  : (lead.leadScore || 0) >= 35
                    ? "bg-amber-500"
                    : "bg-sky-400"
              }`}
              style={{ width: `${lead.leadScore || 0}%` }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 px-4 py-3 dark:border-stone-800">
          {status && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.lightBg} ${status.text} ${status.border}`}
            >
              <span className={`size-1.5 rounded-full ${status.color}`} />
              {status.label}
            </span>
          )}
          <SourceBadge source={lead.source} />
          {personaInfo && (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
              {personaInfo.icon} {personaInfo.label}
            </span>
          )}
          {lead.budget && (
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400">
              {lead.budget}
            </span>
          )}
          {lead.courseInterest && (
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400">
              {lead.courseInterest}
            </span>
          )}
          {adSourceInfo && (
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              {adSourceInfo.label}
            </span>
          )}
          {isQualified && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              Qualified
            </span>
          )}
        </div>

        {/* Quick status change */}
        <div className="border-b border-stone-200 px-4 py-3 dark:border-stone-800">
          <p className="mb-2 text-xs font-medium text-stone-500 dark:text-stone-400">
            Move to
          </p>
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.filter((s) => s.id !== lead.status).map((s) => (
              <button
                key={s.id}
                onClick={() => onStatusChange(lead._id || lead.id, s.id)}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition hover:opacity-80 ${s.lightBg} ${s.text} ${s.border}`}
              >
                <ChevronRight size={12} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Follow-up & tags */}
        <div className="flex flex-wrap items-center gap-3 border-b border-stone-200 px-4 py-3 dark:border-stone-800">
          {lead.followUpDate && (
            <span
              className={`flex items-center gap-1 text-xs ${
                overdue
                  ? "font-medium text-red-600 dark:text-red-400"
                  : "text-stone-500 dark:text-stone-400"
              }`}
            >
              <Calendar size={13} />
              {overdue ? "Overdue: " : "Follow-up: "}
              {formatDate(lead.followUpDate)}
            </span>
          )}
          {(lead.tags || []).length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
              <Tag size={13} />
              {lead.tags.join(", ")}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800">
          <TabButton
            active={tab === "timeline"}
            onClick={() => setTab("timeline")}
            icon={<Clock size={14} />}
            label="Timeline"
          />
          <TabButton
            active={tab === "notes"}
            onClick={() => setTab("notes")}
            icon={<MessageSquare size={14} />}
            label={`Notes (${(lead.notes || []).length})`}
          />
          <TabButton
            active={tab === "scoring"}
            onClick={() => setTab("scoring")}
            icon={<Gauge size={14} />}
            label="Score"
          />
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === "timeline" && (
            <ol className="relative border-l-2 border-stone-200 pl-6 dark:border-stone-800">
              {[...(lead.timeline || [])].reverse().map((entry) => (
                <li key={entry.id || entry._id} className="relative mb-6 last:mb-0">
                  <span className="absolute -left-[31px] top-1 flex size-4 items-center justify-center rounded-full border-2 border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900">
                    <span className="size-1.5 rounded-full bg-stone-400" />
                  </span>
                  <p className="text-sm">{entry.description}</p>
                  <p className="mt-0.5 text-xs text-stone-400">
                    {formatDateTime(entry.createdAt)}
                  </p>
                </li>
              ))}
            </ol>
          )}

          {tab === "notes" && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note…"
                  className="input flex-1"
                />
                <button
                  type="submit"
                  disabled={!noteText.trim()}
                  className="flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-40 dark:bg-emerald-500"
                >
                  <Plus size={14} />
                  Add
                </button>
              </form>

              {(lead.notes || []).length === 0 && (
                <p className="py-6 text-center text-sm text-stone-400">
                  No notes yet
                </p>
              )}

              {[...(lead.notes || [])].reverse().map((note) => (
                <div
                  key={note.id || note._id}
                  className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-900/50"
                >
                  <p className="text-sm">{note.text}</p>
                  <p className="mt-1 text-xs text-stone-400">
                    {formatDateTime(note.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === "scoring" && (
            <div className="space-y-4">
              <ScoreRow label="Budget" value={lead.budget || "—"} urgency={lead.urgency} />
              <ScoreRow label="Urgency" value={lead.urgency || "low"} urgency={lead.urgency} />
              <ScoreRow label="Engagement" value={lead.engagement || "none"} />

              {isQualified && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <ClipboardCheck size={13} /> Qualification Data
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-stone-600 dark:text-stone-400">
                    {lead.qualificationData.currentSituation && (
                      <p><span className="font-medium">Situation:</span> {lead.qualificationData.currentSituation}</p>
                    )}
                    {lead.qualificationData.goal && (
                      <p><span className="font-medium">Goal:</span> {lead.qualificationData.goal}</p>
                    )}
                    <p><span className="font-medium">Timeline:</span> {lead.qualificationData.timeline?.replace(/_/g, " ")}</p>
                    <p><span className="font-medium">Budget Range:</span> {lead.qualificationData.budgetRange?.replace(/_/g, " ")}</p>
                    <p><span className="font-medium">Commitment:</span> {lead.qualificationData.commitment?.replace(/_/g, " ")}</p>
                    {lead.qualificationData.previousExperience && (
                      <p><span className="font-medium">Experience:</span> {lead.qualificationData.previousExperience}</p>
                    )}
                  </div>
                </div>
              )}

              {!isQualified && onQualify && (
                <button
                  onClick={() => onQualify(lead)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-stone-300 px-3 py-3 text-sm font-medium text-stone-500 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-stone-700 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                >
                  <ClipboardCheck size={16} />
                  Qualify this lead
                </button>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-stone-200 p-4 dark:border-stone-800">
          <button
            onClick={() => onEdit(lead)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm("Delete this lead?")) onDelete(lead._id || lead.id);
            }}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

function ScoreRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2 dark:border-stone-800">
      <span className="text-xs font-medium text-stone-500 dark:text-stone-400">{label}</span>
      <span className="text-xs font-semibold capitalize">{value?.replace?.(/_/g, " ") || value}</span>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition ${
        active
          ? "border-b-2 border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300"
          : "text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SourceBadge({ source }) {
  const cls =
    source === "Ads"
      ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
      : source === "Organic"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
        : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {source}
    </span>
  );
}
