"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/sales-api";
import { CALL_TYPES, CALL_OUTCOMES, SALESPERSONS, formatDuration } from "@/lib/sales-data";
import { formatDateTime } from "@/lib/leads-data";
import {
  Plus, Loader2, Phone, MessageCircle, Mic, Trash2,
  ArrowUpRight, ArrowDownLeft, X,
} from "lucide-react";

const TYPE_ICONS = { call: Phone, whatsapp: MessageCircle, voicenote: Mic };
const DIR_ICONS = { outbound: ArrowUpRight, inbound: ArrowDownLeft };

export default function CallLogPanel() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [leads, setLeads] = useState([]);

  const load = useCallback(async () => {
    try {
      const data = await api.fetchCallLogs();
      setLogs(data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function loadLeads() {
    try {
      const res = await fetch("/api/leads");
      setLeads(await res.json());
    } catch { /* ignore */ }
  }

  async function handleSave(data) {
    try {
      await api.createCallLog(data);
      setShowForm(false);
      await load();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this log?")) return;
    try {
      await api.deleteCallLog(id);
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
      <div className="flex items-center justify-end">
        <button
          onClick={() => { loadLeads(); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
        >
          <Plus size={16} /> Log Activity
        </button>
      </div>

      {logs.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <p className="text-sm text-stone-500">No call logs yet. Start logging calls, WhatsApp messages, and voice notes.</p>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800">
        {logs.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900">
              <tr>
                <th className="px-4 py-2.5 font-medium text-stone-600 dark:text-stone-400">Type</th>
                <th className="px-4 py-2.5 font-medium text-stone-600 dark:text-stone-400">Lead</th>
                <th className="hidden px-4 py-2.5 font-medium text-stone-600 dark:text-stone-400 sm:table-cell">Direction</th>
                <th className="hidden px-4 py-2.5 font-medium text-stone-600 dark:text-stone-400 md:table-cell">Duration</th>
                <th className="px-4 py-2.5 font-medium text-stone-600 dark:text-stone-400">Outcome</th>
                <th className="hidden px-4 py-2.5 font-medium text-stone-600 dark:text-stone-400 lg:table-cell">Salesperson</th>
                <th className="px-4 py-2.5 font-medium text-stone-600 dark:text-stone-400">Date</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white dark:divide-stone-800 dark:bg-stone-950">
              {logs.map((log) => {
                const TypeIcon = TYPE_ICONS[log.type] || Phone;
                const DirIcon = DIR_ICONS[log.direction] || ArrowUpRight;
                const outcomeStyle = CALL_OUTCOMES.find((o) => o.id === log.outcome);
                return (
                  <tr key={log._id} className="hover:bg-stone-50 dark:hover:bg-stone-900">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <TypeIcon size={14} className="text-stone-500" />
                        <span className="capitalize">{log.type === "voicenote" ? "Voice Note" : log.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-stone-900 dark:text-stone-100">{log.leadName}</p>
                      <p className="text-xs text-stone-500">{log.leadPhone}</p>
                    </td>
                    <td className="hidden px-4 py-2.5 sm:table-cell">
                      <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                        <DirIcon size={14} /> <span className="capitalize">{log.direction}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-2.5 text-stone-600 dark:text-stone-400 md:table-cell">
                      {formatDuration(log.duration)}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-medium capitalize ${outcomeStyle?.color || "text-stone-600"}`}>
                        {log.outcome?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="hidden px-4 py-2.5 text-stone-600 dark:text-stone-400 lg:table-cell">
                      {log.salesperson || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-stone-500">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => handleDelete(log._id)} className="rounded-md p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <CallLogFormModal leads={leads} onSave={handleSave} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

function CallLogFormModal({ leads, onSave, onClose }) {
  const [leadId, setLeadId] = useState("");
  const [type, setType] = useState("call");
  const [direction, setDirection] = useState("outbound");
  const [duration, setDuration] = useState("");
  const [outcome, setOutcome] = useState("connected");
  const [notes, setNotes] = useState("");
  const [salesperson, setSalesperson] = useState("");

  const selected = leads.find((l) => l._id === leadId);

  function handleSubmit(e) {
    e.preventDefault();
    if (!selected) return;
    onSave({
      leadId,
      leadName: selected.name,
      leadPhone: selected.phone,
      type,
      direction,
      duration: Number(duration) || 0,
      outcome,
      notes,
      salesperson,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Log Activity</h2>
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

          <div className="grid grid-cols-2 gap-3">
            <select value={type} onChange={(e) => setType(e.target.value)} className="input">
              {CALL_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            <select value={direction} onChange={(e) => setDirection(e.target.value)} className="input">
              <option value="outbound">Outbound</option>
              <option value="inbound">Inbound</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (seconds)" className="input" min="0" />
            <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="input">
              {CALL_OUTCOMES.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>

          <select value={salesperson} onChange={(e) => setSalesperson(e.target.value)} className="input">
            <option value="">Salesperson (optional)</option>
            {SALESPERSONS.map((sp) => (
              <option key={sp} value={sp}>{sp}</option>
            ))}
          </select>

          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" rows={3} className="input" />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Save Log
          </button>
        </div>
      </form>
    </div>
  );
}
