"use client";

import { useState } from "react";
import { STATUSES, isOverdue, formatDate } from "@/lib/leads-data";
import { Phone, Calendar, GripVertical } from "lucide-react";

export default function KanbanBoard({ leads, onCardClick, onStatusChange }) {
  const [dragOverCol, setDragOverCol] = useState(null);

  function handleDragStart(e, lead) {
    e.dataTransfer.setData("text/plain", lead._id || lead.id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e, statusId) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(statusId);
  }

  function handleDragLeave() {
    setDragOverCol(null);
  }

  function handleDrop(e, statusId) {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain");
    setDragOverCol(null);
    if (leadId) onStatusChange(leadId, statusId);
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {STATUSES.map((status) => {
        const colLeads = leads.filter((l) => l.status === status.id);
        const isOver = dragOverCol === status.id;

        return (
          <div
            key={status.id}
            className={`flex w-72 min-w-[272px] flex-shrink-0 flex-col rounded-xl border bg-stone-50 transition-colors dark:bg-stone-900/50 ${
              isOver
                ? "border-emerald-400 bg-emerald-50/50 dark:border-emerald-600 dark:bg-emerald-950/20"
                : "border-stone-200 dark:border-stone-800"
            }`}
            onDragOver={(e) => handleDragOver(e, status.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            <div className="flex items-center gap-2 border-b border-stone-200 px-3 py-2.5 dark:border-stone-800">
              <span className={`size-2.5 rounded-full ${status.color}`} />
              <span className="text-sm font-semibold">{status.label}</span>
              <span className="ml-auto rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                {colLeads.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-2">
              {colLeads.length === 0 && (
                <p className="py-8 text-center text-xs text-stone-400 dark:text-stone-600">
                  No leads
                </p>
              )}
              {colLeads.map((lead) => (
                <LeadCard
                  key={lead._id || lead.id}
                  lead={lead}
                  onClick={() => onCardClick(lead)}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TemperatureDot({ temperature }) {
  const cls =
    temperature === "hot"
      ? "bg-red-500"
      : temperature === "warm"
        ? "bg-amber-500"
        : "bg-sky-400";
  const label =
    temperature === "hot" ? "Hot" : temperature === "warm" ? "Warm" : "Cold";
  return (
    <span className="flex items-center gap-1" title={`${label} lead`}>
      <span className={`size-2 rounded-full ${cls}`} />
    </span>
  );
}

function ScorePill({ score }) {
  const bg =
    score >= 65
      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
      : score >= 35
        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
        : "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300";
  return (
    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${bg}`}>
      {score}
    </span>
  );
}

function LeadCard({ lead, onClick, onDragStart }) {
  const overdue = isOverdue(lead.followUpDate);
  const sourceBg =
    lead.source === "Ads"
      ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
      : lead.source === "Organic"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
        : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-stone-200 bg-white p-3 shadow-sm transition hover:shadow-md active:opacity-80 dark:border-stone-700 dark:bg-stone-900"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <TemperatureDot temperature={lead.temperature || "cold"} />
          <p className="text-sm font-semibold leading-tight truncate">{lead.name}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <ScorePill score={lead.leadScore || 0} />
          <GripVertical
            size={14}
            className="text-stone-300 opacity-0 transition group-hover:opacity-100 dark:text-stone-600"
          />
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
        <Phone size={12} />
        <span>{lead.phone}</span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${sourceBg}`}>
          {lead.source}
        </span>
        {lead.budget && (
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-400">
            {lead.budget}
          </span>
        )}
        {lead.persona && (
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            {lead.persona.replace(/_/g, " ")}
          </span>
        )}
      </div>

      {lead.courseInterest && (
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
          {lead.courseInterest}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-1">
        {(lead.tags || []).map((tag) => (
          <span
            key={tag}
            className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500 dark:bg-stone-800 dark:text-stone-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {lead.followUpDate && (
        <div
          className={`mt-2 flex items-center gap-1 text-[11px] ${
            overdue
              ? "font-medium text-red-600 dark:text-red-400"
              : "text-stone-400 dark:text-stone-500"
          }`}
        >
          <Calendar size={11} />
          <span>
            {overdue ? "Overdue: " : "Follow-up: "}
            {formatDate(lead.followUpDate)}
          </span>
        </div>
      )}
    </div>
  );
}
