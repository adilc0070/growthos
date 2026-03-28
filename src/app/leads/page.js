"use client";

import { useState, useEffect, useCallback } from "react";
import { STATUSES } from "@/lib/leads-data";
import * as api from "@/lib/leads-api";
import KanbanBoard from "@/components/leads/kanban-board";
import LeadDetail from "@/components/leads/lead-detail";
import LeadFilters from "@/components/leads/lead-filters";
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
  const [filters, setFilters] = useState({
    source: "all",
    courseInterest: "all",
    temperature: "all",
    persona: "all",
  });

  const loadLeads = useCallback(async () => {
    try {
      setError(null);
      const data = await api.fetchLeads({
        source: filters.source,
        courseInterest: filters.courseInterest,
        temperature: filters.temperature,
        persona: filters.persona,
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
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="search"
            placeholder="Search leads…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full pl-9"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {leads.length === 0 && (
            <button
              onClick={handleSeed}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <Database size={16} />
              Seed demo data
            </button>
          )}
          <button
            onClick={() => setShowWhatsApp(true)}
            className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 shadow-sm transition hover:bg-green-100 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300 dark:hover:bg-green-900/50"
          >
            <MessageCircle size={16} />
            WhatsApp Upload
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            <Plus size={16} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <LeadFilters
        filters={filters}
        onChange={setFilters}
        totalCount={leads.length}
        filteredCount={leads.length}
      />

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
