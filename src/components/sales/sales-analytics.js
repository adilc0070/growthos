"use client";

import { useState, useEffect } from "react";
import {
  Loader2, Users, TrendingUp, Phone, MessageCircle,
  Mic, CalendarClock, UserCheck, UserX,
} from "lucide-react";

export default function SalesAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sales/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-stone-400" />
      </div>
    );
  }

  if (!data) {
    return <p className="py-10 text-center text-sm text-stone-500">Failed to load analytics.</p>;
  }

  const { overview, bySalesperson, bySource } = data;

  const statCards = [
    { label: "Total Leads", value: overview.totalLeads, icon: Users, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
    { label: "Converted", value: overview.converted, icon: UserCheck, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Dropped", value: overview.dropped, icon: UserX, color: "text-red-600 bg-red-50 dark:bg-red-950/40" },
    { label: "Conversion Rate", value: `${overview.conversionRate}%`, icon: TrendingUp, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40" },
    { label: "Total Calls", value: overview.totalCalls, icon: Phone, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
    { label: "WhatsApp Sent", value: overview.totalWhatsApp, icon: MessageCircle, color: "text-green-600 bg-green-50 dark:bg-green-950/40" },
    { label: "Voice Notes", value: overview.totalVoiceNotes, icon: Mic, color: "text-pink-600 bg-pink-50 dark:bg-pink-950/40" },
    { label: "Pending Follow-ups", value: overview.pendingFollowUps, icon: CalendarClock, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40" },
  ];

  const salespersons = Object.entries(bySalesperson);
  const sources = Object.entries(bySource);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{card.value}</p>
                  <p className="text-xs text-stone-500">{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Salesperson performance */}
        <div className="rounded-lg border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
          <div className="border-b border-stone-200 px-4 py-3 dark:border-stone-800">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Conversion by Salesperson</h3>
          </div>
          {salespersons.length === 0 ? (
            <p className="p-6 text-center text-sm text-stone-500">No data yet. Assign leads and log activities.</p>
          ) : (
            <div className="divide-y divide-stone-200 dark:divide-stone-800">
              {salespersons.map(([name, stats]) => {
                const rate = stats.total ? ((stats.converted / stats.total) * 100).toFixed(1) : 0;
                return (
                  <div key={name} className="flex items-center gap-4 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      {name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{name}</p>
                      <div className="mt-1 flex gap-3 text-xs text-stone-500">
                        <span>{stats.total} leads</span>
                        <span className="text-emerald-600">{stats.converted} converted</span>
                        <span className="text-red-500">{stats.dropped} dropped</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">{rate}%</p>
                      <p className="text-[10px] text-stone-500">{stats.calls} calls &middot; {stats.whatsapp} msgs</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Source performance */}
        <div className="rounded-lg border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
          <div className="border-b border-stone-200 px-4 py-3 dark:border-stone-800">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Conversion by Source</h3>
          </div>
          {sources.length === 0 ? (
            <p className="p-6 text-center text-sm text-stone-500">No data yet.</p>
          ) : (
            <div className="divide-y divide-stone-200 dark:divide-stone-800">
              {sources.map(([source, stats]) => {
                const rate = stats.total ? ((stats.converted / stats.total) * 100).toFixed(1) : 0;
                const barWidth = stats.total ? Math.max((stats.converted / stats.total) * 100, 4) : 4;
                return (
                  <div key={source} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{source}</p>
                      <p className="text-xs text-stone-500">{stats.converted}/{stats.total} converted ({rate}%)</p>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
