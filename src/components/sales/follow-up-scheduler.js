"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/sales-api";
import { formatDateTime, isOverdue } from "@/lib/leads-data";
import { getWhatsAppUrl } from "@/lib/sales-data";
import {
  Loader2, CalendarPlus, Zap, Check, SkipForward,
  MessageCircle, Phone, Mail, X, Clock, AlertTriangle,
} from "lucide-react";

const METHOD_ICONS = { call: Phone, whatsapp: MessageCircle, email: Mail };
const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  completed: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  skipped: "bg-stone-50 text-stone-500 border-stone-200 dark:bg-stone-900 dark:text-stone-500 dark:border-stone-800",
};

export default function FollowUpScheduler() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [leads, setLeads] = useState([]);
  const [showSequenceModal, setShowSequenceModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.fetchFollowUps({ status: statusFilter });
      setFollowUps(data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function loadLeads() {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data);
    } catch { /* ignore */ }
  }

  async function handleStartSequence(leadId) {
    try {
      await api.startSequence(leadId);
      setShowSequenceModal(false);
      await load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleComplete(id) {
    try {
      await api.completeFollowUp(id);
      await load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleSkip(id) {
    try {
      await api.skipFollowUp(id);
      await load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleCreateManual(data) {
    try {
      await api.createFollowUp(data);
      setShowManualModal(false);
      await load();
    } catch (err) {
      alert(err.message);
    }
  }

  const overdue = followUps.filter((f) => f.status === "pending" && isOverdue(f.scheduledDate));
  const upcoming = followUps.filter((f) => f.status === "pending" && !isOverdue(f.scheduledDate));
  const done = followUps.filter((f) => f.status !== "pending");

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
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="skipped">Skipped</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => { loadLeads(); setShowSequenceModal(true); }}
            className="flex items-center gap-2 rounded-lg border border-emerald-300 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
          >
            <Zap size={16} /> Auto Sequence
          </button>
          <button
            onClick={() => { loadLeads(); setShowManualModal(true); }}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            <CalendarPlus size={16} /> Schedule Follow-up
          </button>
        </div>
      </div>

      {overdue.length > 0 && (
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-red-600">
            <AlertTriangle size={14} /> Overdue ({overdue.length})
          </h3>
          {overdue.map((fu) => (
            <FollowUpCard key={fu._id} followUp={fu} overdue onComplete={handleComplete} onSkip={handleSkip} />
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
            <Clock size={14} /> Upcoming ({upcoming.length})
          </h3>
          {upcoming.map((fu) => (
            <FollowUpCard key={fu._id} followUp={fu} onComplete={handleComplete} onSkip={handleSkip} />
          ))}
        </div>
      )}

      {done.length > 0 && statusFilter !== "pending" && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Completed / Skipped ({done.length})
          </h3>
          {done.map((fu) => (
            <FollowUpCard key={fu._id} followUp={fu} />
          ))}
        </div>
      )}

      {followUps.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <p className="text-sm text-stone-500">No follow-ups found. Start an auto sequence or schedule manually.</p>
        </div>
      )}

      {showSequenceModal && (
        <SequenceModal leads={leads} onStart={handleStartSequence} onClose={() => setShowSequenceModal(false)} />
      )}

      {showManualModal && (
        <ManualFollowUpModal leads={leads} onSave={handleCreateManual} onClose={() => setShowManualModal(false)} />
      )}
    </div>
  );
}

function FollowUpCard({ followUp, overdue, onComplete, onSkip }) {
  const Icon = METHOD_ICONS[followUp.method] || Phone;
  const isPending = followUp.status === "pending";

  return (
    <div className={`flex items-center gap-3 rounded-lg border p-3 ${overdue ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20" : STATUS_STYLES[followUp.status]}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
        overdue ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400" :
        followUp.status === "completed" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400" :
        "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400"
      }`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-stone-900 dark:text-stone-100">
          {followUp.leadName}
          {followUp.sequenceDay > 0 && (
            <span className="ml-1.5 text-xs font-normal text-stone-500">Day {followUp.sequenceDay}</span>
          )}
        </p>
        <p className="text-xs text-stone-500">{followUp.leadPhone} &middot; {formatDateTime(followUp.scheduledDate)}</p>
      </div>
      {isPending && (
        <div className="flex items-center gap-1">
          {followUp.method === "whatsapp" && (
            <a
              href={getWhatsAppUrl(followUp.leadPhone, `Hi ${followUp.leadName}!`)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-green-600 p-1.5 text-white hover:bg-green-700"
            >
              <MessageCircle size={14} />
            </a>
          )}
          <button onClick={() => onComplete?.(followUp._id)} className="rounded-md bg-emerald-600 p-1.5 text-white hover:bg-emerald-700">
            <Check size={14} />
          </button>
          <button onClick={() => onSkip?.(followUp._id)} className="rounded-md border border-stone-300 p-1.5 text-stone-500 hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-800">
            <SkipForward size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function SequenceModal({ leads, onStart, onClose }) {
  const [selectedLead, setSelectedLead] = useState("");
  const eligible = leads.filter((l) => !["converted", "dropped"].includes(l.status));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Start Auto Follow-up Sequence</h2>
          <button onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>
        <p className="mb-4 text-sm text-stone-500">
          This will create automatic follow-ups on Day 1, 3, 5, and 7 for the selected lead.
        </p>
        <select value={selectedLead} onChange={(e) => setSelectedLead(e.target.value)} className="input">
          <option value="">Select a lead...</option>
          {eligible.map((l) => (
            <option key={l._id} value={l._id}>{l.name} — {l.phone}</option>
          ))}
        </select>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button
            onClick={() => selectedLead && onStart(selectedLead)}
            disabled={!selectedLead}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Start Sequence
          </button>
        </div>
      </div>
    </div>
  );
}

function ManualFollowUpModal({ leads, onSave, onClose }) {
  const [leadId, setLeadId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [method, setMethod] = useState("whatsapp");

  const selected = leads.find((l) => l._id === leadId);

  function handleSubmit(e) {
    e.preventDefault();
    if (!selected) return;
    onSave({
      leadId,
      leadName: selected.name,
      leadPhone: selected.phone,
      scheduledDate: new Date(scheduledDate),
      method,
      sequenceDay: 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Schedule Follow-up</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <select value={leadId} onChange={(e) => setLeadId(e.target.value)} required className="input">
            <option value="">Select a lead...</option>
            {leads.map((l) => (
              <option key={l._id} value={l._id}>{l.name} — {l.phone}</option>
            ))}
          </select>

          <input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required className="input" />

          <select value={method} onChange={(e) => setMethod(e.target.value)} className="input">
            <option value="whatsapp">WhatsApp</option>
            <option value="call">Phone Call</option>
            <option value="email">Email</option>
          </select>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Schedule
          </button>
        </div>
      </form>
    </div>
  );
}
