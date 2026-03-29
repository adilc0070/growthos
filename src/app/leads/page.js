"use client";

import { useState, useEffect, useCallback } from "react";
import { STATUSES } from "@/lib/leads-data";
import * as api from "@/lib/leads-api";
import KanbanBoard from "@/components/leads/kanban-board";
import LeadDetail from "@/components/leads/lead-detail";
import LeadFilters, { LEAD_FILTER_DEFAULTS } from "@/components/leads/lead-filters";
import AddLeads from "@/components/leads/add-leads";
import QualificationForm from "@/components/leads/qualification-form";
import WhatsAppBulkUpload from "@/components/leads/whatsapp-bulk-upload";
import { Plus, Search, Loader2, Database, MessageCircle } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedLead, setSelectedLead] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [saving, setSaving] = useState(false);
  const [qualifyingLead, setQualifyingLead] = useState(null);

  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ ...LEAD_FILTER_DEFAULTS });

  const loadLeads = useCallback(async () => {
    try {
      setError(null);
      const data = await api.fetchLeads({
        source: filters.source,
        courseInterest: filters.courseInterest,
        temperature: filters.temperature,
        persona: filters.persona,
        adSource: filters.adSource,
        status: filters.status,
        assignedTo: filters.assignedTo,
        createdFrom: filters.createdFrom || undefined,
        createdTo: filters.createdTo || undefined,
        minScore: filters.minScore || undefined,
        maxScore: filters.maxScore || undefined,
        urgency: filters.urgency,
        engagement: filters.engagement,
        search: search || undefined,
      });
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, search]);

  useEffect(() => {
    const timeout = setTimeout(loadLeads, search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [loadLeads, search]);

  async function handleSeed() {
    try {
      setSaving(true);
      const res = await api.seedLeads();
      if (res.seeded) await loadLeads();
      else alert(res.message);
    } catch (err) {
      alert("Seed failed: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddLead(data) {
    try {
      setSaving(true);
      await api.createLead(data);
      setShowForm(false);
      await loadLeads();
    } catch (err) {
      alert("Failed to add lead: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateLead(id, data) {
    try {
      setSaving(true);
      const updated = await api.updateLead(id, data);
      setEditingLead(null);
      setShowForm(false);
      if (selectedLead?._id === id) setSelectedLead(updated);
      await loadLeads();
    } catch (err) {
      alert("Failed to update lead: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteLead(id) {
    try {
      setSaving(true);
      await api.deleteLead(id);
      setSelectedLead(null);
      await loadLeads();
    } catch (err) {
      alert("Failed to delete lead: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(leadId, newStatus) {
    try {
      const updated = await api.changeStatus(leadId, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? updated : l))
      );
      if (selectedLead?._id === leadId) setSelectedLead(updated);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  }

  async function handleAddNote(leadId, text) {
    try {
      const updated = await api.addNote(leadId, text);
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? updated : l))
      );
      if (selectedLead?._id === leadId) setSelectedLead(updated);
    } catch (err) {
      alert("Failed to add note: " + err.message);
    }
  }

  function openEdit(lead) {
    setEditingLead(lead);
    setShowForm(true);
    setSelectedLead(null);
  }

  function openAdd() {
    setEditingLead(null);
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <Loader2 size={24} className="animate-spin text-stone-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center">
        <p className="text-sm text-red-500">{error}</p>
        <button
          onClick={loadLeads}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 lg:p-6">
      {/* Top bar */}
      <div className="flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center">
        <div className="relative min-w-0 w-full min-[480px]:flex-1 min-[480px]:max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search leads…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full pl-9"
            enterKeyHint="search"
          />
        </div>

        <div className="flex flex-wrap items-stretch gap-2 min-[480px]:ml-auto min-[480px]:justify-end">
          {leads.length === 0 && (
            <button
              type="button"
              onClick={handleSeed}
              disabled={saving}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 min-[400px]:flex-initial dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <Database size={16} className="shrink-0" />
              <span className="truncate">Seed demo</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowWhatsApp(true)}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 shadow-sm transition hover:bg-green-100 min-[400px]:flex-initial dark:border-green-800 dark:bg-green-950/40 dark:text-green-300 dark:hover:bg-green-900/50"
          >
            <MessageCircle size={16} className="shrink-0" />
            <span className="truncate">WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 min-[400px]:flex-initial dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            <Plus size={16} className="shrink-0" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <LeadFilters filters={filters} onChange={setFilters} resultCount={leads.length} />

      {/* Kanban */}
      <KanbanBoard
        leads={leads}
        onCardClick={(lead) => setSelectedLead(lead)}
        onStatusChange={handleStatusChange}
      />

      {/* Add / Edit leads modal */}
      {showForm && (
        <AddLeads
          lead={editingLead}
          saving={saving}
          onSubmitSingle={editingLead ? handleUpdateLead : handleAddLead}
          onBulkDone={() => loadLeads()}
          onClose={() => {
            setShowForm(false);
            setEditingLead(null);
          }}
        />
      )}

      {/* Detail panel */}
      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onAddNote={handleAddNote}
          onEdit={openEdit}
          onDelete={handleDeleteLead}
          onStatusChange={handleStatusChange}
          onLeadUpdated={(updated) => {
            setLeads((prev) => prev.map((l) => (l._id === updated._id ? updated : l)));
            setSelectedLead(updated);
          }}
          onQualify={(lead) => {
            setQualifyingLead(lead);
            setSelectedLead(null);
          }}
        />
      )}

      {/* WhatsApp bulk upload modal */}
      {showWhatsApp && (
        <WhatsAppBulkUpload
          onClose={() => setShowWhatsApp(false)}
          onDone={() => loadLeads()}
        />
      )}

      {/* Qualification form modal */}
      {qualifyingLead && (
        <QualificationForm
          lead={qualifyingLead}
          onSubmit={async (id, data) => {
            const updated = await api.qualifyLead(id, data);
            setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
            setQualifyingLead(null);
          }}
          onClose={() => setQualifyingLead(null)}
        />
      )}

    </div>
  );
}
