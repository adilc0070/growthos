"use client";

import { useEffect, useState } from "react";
import {
  STATUSES, PERSONAS, TEMPERATURES, AD_SOURCES,
  formatDateTime, formatDate, isOverdue,
} from "@/lib/leads-data";
import * as leadsApi from "@/lib/leads-api";
import * as salesApi from "@/lib/sales-api";
import {
  getWhatsAppUrl,
  buildSalesScriptContext,
  interpolateSalesScriptContent,
} from "@/lib/sales-data";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
  UserRound,
  MessageCircle,
  Send,
  Forward,
  Mic,
  Video,
  FileText,
  BookOpen,
} from "lucide-react";

function phoneDigits(phone) {
  if (!phone) return "";
  return String(phone).replace(/\D/g, "");
}

function telHref(phone) {
  if (!phone) return null;
  const compact = String(phone).replace(/[\s().-]/g, "");
  return compact ? `tel:${compact}` : null;
}

function waMeHref(phone) {
  const d = phoneDigits(phone);
  return d ? `https://wa.me/${d}` : null;
}

export default function LeadDetail({
  lead,
  onClose,
  onAddNote,
  onEdit,
  onDelete,
  onStatusChange,
  onQualify,
  onLeadUpdated,
}) {
  const [tab, setTab] = useState("timeline");
  const [noteText, setNoteText] = useState("");
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [waScripts, setWaScripts] = useState([]);
  const [waScriptsLoading, setWaScriptsLoading] = useState(false);
  const [selectedPitchId, setSelectedPitchId] = useState("");
  const { data: session } = useSession();
  const canAssign = session?.user?.role === "admin" || session?.user?.role === "sales";

  useEffect(() => {
    if (!canAssign) return;
    fetch("/api/users/assignable")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setAssignableUsers(data))
      .catch(() => {});
  }, [canAssign]);

  useEffect(() => {
    if (tab !== "chat" || !lead) return;
    const leadId = lead._id || lead.id;
    if (!leadId) return;
    setChatLoading(true);
    leadsApi
      .fetchMessages(leadId)
      .then((msgs) => setChatMessages(msgs))
      .catch(() => setChatMessages([]))
      .finally(() => setChatLoading(false));
  }, [tab, lead?._id, lead?.id]);

  useEffect(() => {
    setSelectedPitchId("");
  }, [lead?._id, lead?.id]);

  useEffect(() => {
    if (!lead?.phone) {
      setWaScripts([]);
      return;
    }
    let cancelled = false;
    setWaScriptsLoading(true);
    salesApi
      .fetchScripts("all")
      .then((list) => {
        if (!cancelled) {
          setWaScripts((list || []).filter((s) => s.whatsappReady));
        }
      })
      .catch(() => {
        if (!cancelled) setWaScripts([]);
      })
      .finally(() => {
        if (!cancelled) setWaScriptsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lead?.phone, lead?._id, lead?.id]);

  useEffect(() => {
    if (!lead) return undefined;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lead?._id, lead?.id, onClose]);

  if (!lead) return null;

  const status = STATUSES.find((s) => s.id === lead.status);
  const overdue = isOverdue(lead.followUpDate);
  const temp = TEMPERATURES.find((t) => t.id === (lead.temperature || "cold"));
  const personaInfo = PERSONAS.find((p) => p.id === lead.persona);
  const adSourceInfo = AD_SOURCES.find((a) => a.id === lead.adSource);
  const isQualified = !!lead.qualificationData?.qualifiedAt;

  function handleSendPitchWhatsApp() {
    const script = waScripts.find((s) => s._id === selectedPitchId);
    if (!script || !lead.phone) return;
    const ctx = buildSalesScriptContext(lead, session?.user);
    const text = interpolateSalesScriptContent(script.content, ctx);
    const url = getWhatsAppUrl(lead.phone, text);
    window.open(url, "_blank", "noopener,noreferrer");
    const id = lead._id || lead.id;
    salesApi
      .logWhatsAppSend(id, { message: text, scriptTitle: script.title })
      .then((res) => {
        if (onLeadUpdated && res?.lead) onLeadUpdated(res.lead);
      })
      .catch(() => {});
  }

  function handleAddNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddNote(lead._id || lead.id, noteText.trim());
    setNoteText("");
  }

  return (
    <>
      <div
        role="presentation"
        className="fixed inset-0 z-40 bg-stone-900/45 backdrop-blur-[2px] dark:bg-stone-950/60"
        onClick={onClose}
      />
      <div
        className="fixed z-50 flex max-h-[100dvh] w-full flex-col bg-white shadow-2xl dark:bg-stone-950
          max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-[6dvh] max-sm:rounded-t-2xl max-sm:border-x-0 max-sm:border-b-0 max-sm:border-t max-sm:border-stone-200 max-sm:pt-0 dark:max-sm:border-stone-800
          sm:inset-y-0 sm:right-0 sm:left-auto sm:top-0 sm:max-w-lg sm:rounded-none sm:border-l sm:border-stone-200 sm:pt-[env(safe-area-inset-top)] sm:shadow-xl dark:sm:border-stone-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-detail-title"
      >
        <div
          className="flex shrink-0 justify-center pt-2 pb-1 sm:hidden"
          aria-hidden
        >
          <div className="h-1 w-11 rounded-full bg-stone-300 dark:bg-stone-600" />
        </div>

        {/* Header */}
        <div className="flex shrink-0 items-start gap-3 border-b border-stone-200 bg-white px-3 py-3 dark:border-stone-800 dark:bg-stone-950 sm:px-4 sm:py-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="lead-detail-title"
                className="break-words text-lg font-semibold leading-snug tracking-tight text-stone-900 dark:text-stone-50"
              >
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
            <div className="mt-2 space-y-2 text-sm text-stone-600 dark:text-stone-400">
              {lead.phone && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-stone-100 px-2 py-1 dark:bg-stone-800/80">
                    <Phone size={14} className="shrink-0 text-stone-500" />
                    {telHref(lead.phone) ? (
                      <a
                        href={telHref(lead.phone)}
                        className="min-w-0 font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
                      >
                        {lead.phone}
                      </a>
                    ) : (
                      <span>{lead.phone}</span>
                    )}
                  </span>
                  {waMeHref(lead.phone) && (
                    <a
                      href={waMeHref(lead.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98] hover:bg-[#20bd5a]"
                    >
                      <MessageCircle size={14} />
                      WhatsApp
                    </a>
                  )}
                </div>
              )}
              {lead.email && (
                <div className="flex items-start gap-2 rounded-lg bg-stone-50 px-2 py-1.5 dark:bg-stone-900/60">
                  <Mail size={14} className="mt-0.5 shrink-0 text-stone-500" />
                  <span className="min-w-0 break-all text-sm">{lead.email}</span>
                </div>
              )}
              <Link
                href="/sales"
                className="inline-flex min-h-9 w-fit max-w-full items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
              >
                <BookOpen size={14} />
                Sales scripts
              </Link>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="touch-manipulation -mr-1 -mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <div className="space-y-3 px-3 py-3 sm:space-y-4 sm:px-4 sm:py-4">
            {lead.phone && (
              <section className="rounded-xl border border-stone-200/90 bg-stone-50/80 p-3 dark:border-stone-800 dark:bg-stone-900/40">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  Send pitch on WhatsApp
                </p>
                {waScriptsLoading ? (
                  <p className="text-xs text-stone-400">Loading scripts…</p>
                ) : waScripts.length === 0 ? (
                  <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                    No WhatsApp-ready scripts. Enable in{" "}
                    <Link
                      href="/sales"
                      className="font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-400"
                    >
                      Sales → Scripts
                    </Link>
                    .
                  </p>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                    <select
                      value={selectedPitchId}
                      onChange={(e) => setSelectedPitchId(e.target.value)}
                      className="input min-h-11 min-w-0 flex-1 py-2 text-sm"
                    >
                      <option value="">Choose a script…</option>
                      {waScripts.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!selectedPitchId}
                      onClick={handleSendPitchWhatsApp}
                      className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#20bd5a] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                    >
                      <Send size={16} />
                      Send
                    </button>
                  </div>
                )}
              </section>
            )}

            <section className="rounded-xl border border-stone-200/90 bg-white p-3 dark:border-stone-800 dark:bg-stone-900/30">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-stone-600 dark:text-stone-400">
                  <Gauge size={14} /> Lead score
                </span>
                <span className="font-bold tabular-nums text-stone-900 dark:text-stone-100">
                  {lead.leadScore || 0}/100
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
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
            </section>

            <section className="rounded-xl border border-stone-200/90 bg-white p-3 dark:border-stone-800 dark:bg-stone-900/30">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Tags &amp; pipeline
              </p>
              <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                {status && (
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.lightBg} ${status.text} ${status.border}`}
                  >
                    <span className={`size-1.5 rounded-full ${status.color}`} />
                    {status.label}
                  </span>
                )}
                <SourceBadge source={lead.source} />
                {personaInfo && (
                  <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-800 dark:bg-violet-900/50 dark:text-violet-200">
                    {personaInfo.icon} {personaInfo.label}
                  </span>
                )}
                {lead.budget && (
                  <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                    {lead.budget}
                  </span>
                )}
                {lead.courseInterest && (
                  <span className="max-w-[200px] shrink-0 truncate rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700 dark:bg-stone-800 dark:text-stone-300 sm:max-w-none">
                    {lead.courseInterest}
                  </span>
                )}
                {adSourceInfo && (
                  <span className="shrink-0 rounded-full bg-teal-100 px-2.5 py-1 text-xs text-teal-800 dark:bg-teal-900/50 dark:text-teal-200">
                    {adSourceInfo.label}
                  </span>
                )}
                {isQualified && (
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                    Qualified
                  </span>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-stone-200/90 bg-white p-3 dark:border-stone-800 dark:bg-stone-900/30">
              <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                <UserRound size={12} />
                Assigned to
              </p>
              {canAssign ? (
                <select
                  value={lead.assignedTo?._id || lead.assignedTo || ""}
                  disabled={assigning}
                  onChange={async (e) => {
                    const v = e.target.value || null;
                    setAssigning(true);
                    try {
                      const updated = await leadsApi.assignLead(lead._id || lead.id, v);
                      if (onLeadUpdated) onLeadUpdated(updated);
                    } catch (err) {
                      alert("Failed to assign: " + err.message);
                    } finally {
                      setAssigning(false);
                    }
                  }}
                  className="input min-h-11 w-full"
                >
                  <option value="">Unassigned</option>
                  {assignableUsers.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-stone-700 dark:text-stone-300">
                  {lead.assignedTo?.name || "Unassigned"}
                </p>
              )}
            </section>

            <section className="rounded-xl border border-stone-200/90 bg-white p-3 dark:border-stone-800 dark:bg-stone-900/30">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Move to stage
              </p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {STATUSES.filter((s) => s.id !== lead.status).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onStatusChange(lead._id || lead.id, s.id)}
                    className={`flex min-h-10 touch-manipulation items-center justify-center gap-1 rounded-xl border px-2 py-2 text-center text-xs font-medium transition active:scale-[0.98] hover:opacity-90 sm:min-h-0 sm:rounded-full sm:px-2.5 sm:py-1.5 ${s.lightBg} ${s.text} ${s.border}`}
                  >
                    <ChevronRight size={12} className="hidden shrink-0 sm:inline" />
                    <span className="leading-tight">{s.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-stone-200/90 bg-white p-3 dark:border-stone-800 dark:bg-stone-900/30">
              <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                {lead.followUpDate && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg bg-stone-50 px-2 py-1.5 text-xs dark:bg-stone-800/50 ${
                      overdue
                        ? "font-medium text-red-600 dark:text-red-400"
                        : "text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    <Calendar size={14} className="shrink-0" />
                    {overdue ? "Overdue " : "Follow-up "}
                    {formatDate(lead.followUpDate)}
                  </span>
                )}
                {(lead.tags || []).length > 0 && (
                  <span className="inline-flex items-start gap-1.5 rounded-lg bg-stone-50 px-2 py-1.5 text-xs text-stone-600 dark:bg-stone-800/50 dark:text-stone-400">
                    <Tag size={14} className="mt-0.5 shrink-0" />
                    <span className="min-w-0 break-words">{lead.tags.join(", ")}</span>
                  </span>
                )}
              </div>
            </section>
          </div>

          <div className="sticky top-0 z-10 flex border-y border-stone-200 bg-white/95 px-1 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/95">
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
              active={tab === "chat"}
              onClick={() => setTab("chat")}
              icon={<MessageCircle size={14} />}
              label="Chat"
            />
            <TabButton
              active={tab === "scoring"}
              onClick={() => setTab("scoring")}
              icon={<Gauge size={14} />}
              label="Score"
            />
          </div>

          <div className="px-3 py-4 sm:px-4 sm:pb-6">
            {tab === "timeline" && (
              <ol className="relative space-y-1 border-l-2 border-stone-200 pl-5 dark:border-stone-800">
                {[...(lead.timeline || [])].reverse().map((entry) => (
                  <li key={entry.id || entry._id} className="relative pb-6 last:pb-0">
                    <span className="absolute -left-[25px] top-1 flex size-3.5 items-center justify-center rounded-full border-2 border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-950">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                    </span>
                    <p className="text-sm leading-relaxed text-stone-800 dark:text-stone-200">
                      {entry.description}
                    </p>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-500">
                      {formatDateTime(entry.createdAt)}
                      {entry.actor?.name
                        ? ` · ${entry.actor.name} (${entry.actor.role || "user"})`
                        : ""}
                    </p>
                  </li>
                ))}
              </ol>
            )}

            {tab === "notes" && (
              <div className="space-y-4">
                <form
                  onSubmit={handleAddNote}
                  className="flex flex-col gap-2 sm:flex-row"
                >
                  <input
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note…"
                    className="input min-h-11 flex-1"
                  />
                  <button
                    type="submit"
                    disabled={!noteText.trim()}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-40 dark:bg-emerald-500 sm:w-auto"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </form>

                {(lead.notes || []).length === 0 && (
                  <p className="py-8 text-center text-sm text-stone-400">
                    No notes yet
                  </p>
                )}

                {[...(lead.notes || [])].reverse().map((note) => (
                  <div
                    key={note.id || note._id}
                    className="rounded-xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-900/50"
                  >
                    <p className="text-sm leading-relaxed">{note.text}</p>
                    <p className="mt-2 text-xs text-stone-500">
                      {formatDateTime(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {tab === "chat" && (
              <ChatPanel
                messages={chatMessages}
                loading={chatLoading}
                leadName={lead.name}
                phone={lead.phone}
              />
            )}

            {tab === "scoring" && (
              <div className="space-y-3">
                <ScoreRow label="Budget" value={lead.budget || "—"} />
                <ScoreRow label="Urgency" value={lead.urgency || "low"} />
                <ScoreRow label="Engagement" value={lead.engagement || "none"} />

                {isQualified && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      <ClipboardCheck size={14} /> Qualification
                    </p>
                    <div className="mt-2 space-y-1.5 text-xs leading-relaxed text-stone-700 dark:text-stone-400">
                      {lead.qualificationData.currentSituation && (
                        <p>
                          <span className="font-medium text-stone-800 dark:text-stone-300">Situation:</span>{" "}
                          {lead.qualificationData.currentSituation}
                        </p>
                      )}
                      {lead.qualificationData.goal && (
                        <p>
                          <span className="font-medium text-stone-800 dark:text-stone-300">Goal:</span>{" "}
                          {lead.qualificationData.goal}
                        </p>
                      )}
                      <p>
                        <span className="font-medium text-stone-800 dark:text-stone-300">Timeline:</span>{" "}
                        {lead.qualificationData.timeline?.replace(/_/g, " ")}
                      </p>
                      <p>
                        <span className="font-medium text-stone-800 dark:text-stone-300">Budget range:</span>{" "}
                        {lead.qualificationData.budgetRange?.replace(/_/g, " ")}
                      </p>
                      <p>
                        <span className="font-medium text-stone-800 dark:text-stone-300">Commitment:</span>{" "}
                        {lead.qualificationData.commitment?.replace(/_/g, " ")}
                      </p>
                      {lead.qualificationData.previousExperience && (
                        <p>
                          <span className="font-medium text-stone-800 dark:text-stone-300">Experience:</span>{" "}
                          {lead.qualificationData.previousExperience}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {!isQualified && onQualify && (
                  <button
                    type="button"
                    onClick={() => onQualify(lead)}
                    className="flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 px-3 py-3 text-sm font-medium text-stone-600 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-stone-600 dark:text-stone-400 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                  >
                    <ClipboardCheck size={18} />
                    Qualify this lead
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2 border-t border-stone-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-stone-800 dark:bg-stone-950 sm:gap-3 sm:p-4">
          <button
            type="button"
            onClick={() => onEdit(lead)}
            className="flex min-h-12 flex-1 touch-manipulation items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50 active:scale-[0.99] dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            <Pencil size={16} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Delete this lead?")) onDelete(lead._id || lead.id);
            }}
            className="flex min-h-12 min-w-[5.5rem] touch-manipulation items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 active:scale-[0.99] dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

function ScoreRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-stone-200 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
      <span className="text-xs font-medium text-stone-500 dark:text-stone-400">{label}</span>
      <span className="text-xs font-semibold capitalize text-stone-900 dark:text-stone-100">
        {value?.replace?.(/_/g, " ") || value}
      </span>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-11 min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-semibold leading-tight transition sm:min-h-0 sm:flex-row sm:gap-1.5 sm:px-2 sm:py-2.5 sm:text-xs ${
        active
          ? "border-b-2 border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300"
          : "border-b-2 border-transparent text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
      }`}
    >
      <span className="[&>svg]:size-4 sm:[&>svg]:size-3.5">{icon}</span>
      <span className="max-w-[5.5rem] truncate text-center sm:max-w-none">{label}</span>
    </button>
  );
}

function ChatPanel({ messages, loading, leadName, phone }) {
  const tel = phone ? telHref(phone) : null;
  const wa = phone ? waMeHref(phone) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="size-5 animate-spin rounded-full border-2 border-stone-300 border-t-emerald-500" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <MessageCircle size={28} className="text-stone-300 dark:text-stone-600" />
        <p className="text-sm text-stone-400">No WhatsApp messages yet</p>
        {phone && (
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            {tel && (
              <a
                href={tel}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                <Phone size={16} />
                Call {phone}
              </a>
            )}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#20bd5a]"
              >
                <MessageCircle size={16} />
                WhatsApp chat
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  let lastDate = "";

  return (
    <div className="flex flex-col gap-1">
      {messages.map((msg) => {
        const msgDate = new Date(msg.timestamp * 1000).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        });
        const showDate = msgDate !== lastDate;
        lastDate = msgDate;

        return (
          <div key={msg._id || msg.id}>
            {showDate && (
              <div className="my-2 flex justify-center">
                <span className="rounded-full bg-stone-200 px-3 py-0.5 text-[10px] font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                  {msgDate}
                </span>
              </div>
            )}
            <ChatBubble msg={msg} leadName={leadName} />
          </div>
        );
      })}
    </div>
  );
}

function ChatBubble({ msg, leadName }) {
  const time = new Date(msg.timestamp * 1000).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isMe = msg.fromMe;

  const typeIcon =
    msg.type === "audio" || msg.type === "voice" ? <Mic size={12} /> :
    msg.type === "video" ? <Video size={12} /> :
    msg.type === "document" ? <FileText size={12} /> :
    null;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`relative max-w-[min(90vw,20rem)] rounded-xl px-3 py-2 text-sm shadow-sm sm:max-w-[85%] ${
          isMe
            ? "rounded-tr-sm bg-emerald-100 text-emerald-950 dark:bg-emerald-900/60 dark:text-emerald-50"
            : "rounded-tl-sm bg-white text-stone-800 dark:bg-stone-800 dark:text-stone-100"
        }`}
      >
        {!isMe && msg.fromName && (
          <p className="mb-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            {msg.fromName}
          </p>
        )}

        {msg.forwarded && (
          <p className="mb-0.5 flex items-center gap-1 text-[10px] italic text-stone-400">
            <Forward size={10} /> Forwarded
          </p>
        )}

        {typeIcon && (
          <span className="mb-1 flex items-center gap-1 text-[10px] text-stone-400">
            {typeIcon} {msg.type}
            {msg.audioFile && (
              <a
                href={msg.audioFile}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline"
              >
                Play
              </a>
            )}
          </span>
        )}

        {msg.body && <p className="whitespace-pre-wrap wrap-break-word">{msg.body}</p>}

        <p className={`mt-0.5 text-right text-[10px] ${isMe ? "text-emerald-600/70 dark:text-emerald-300/60" : "text-stone-400"}`}>
          {time}
          {msg.source && <span className="ml-1">• {msg.source}</span>}
        </p>
      </div>
    </div>
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
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {source}
    </span>
  );
}
