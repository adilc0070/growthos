"use client";

import { useState, useEffect } from "react";
import {
  TEMPERATURES, PERSONAS, AD_SOURCES,
} from "@/lib/leads-data";
import * as api from "@/lib/leads-api";
import {
  Loader2, Flame, Users, BarChart3, RefreshCw,
  TrendingUp, Target, Zap,
} from "lucide-react";

export default function TargetingPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rescoring, setRescoring] = useState(false);
  const [error, setError] = useState(null);

  async function loadAnalytics() {
    try {
      setError(null);
      const data = await api.fetchTargetingAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function handleRescore() {
    setRescoring(true);
    try {
      const res = await api.rescoreAllLeads();
      alert(res.message);
      await loadAnalytics();
    } catch (err) {
      alert("Rescore failed: " + err.message);
    } finally {
      setRescoring(false);
    }
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
          onClick={loadAnalytics}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const temp = analytics?.temperature || {};
  const hot = temp.hot || 0;
  const warm = temp.warm || 0;
  const cold = temp.cold || 0;
  const total = analytics?.totalLeads || 0;

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Lead Quality Dashboard</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Score, segment, and track lead quality across sources
          </p>
        </div>
        <button
          onClick={handleRescore}
          disabled={rescoring}
          className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          <RefreshCw size={14} className={rescoring ? "animate-spin" : ""} />
          Rescore All Leads
        </button>
      </div>

      {/* Temperature overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <TempCard
          label="Hot Leads"
          count={hot}
          total={total}
          color="bg-red-500"
          lightBg="bg-red-50 dark:bg-red-950/30"
          textColor="text-red-700 dark:text-red-300"
          icon={<Flame size={20} className="text-red-500" />}
        />
        <TempCard
          label="Warm Leads"
          count={warm}
          total={total}
          color="bg-amber-500"
          lightBg="bg-amber-50 dark:bg-amber-950/30"
          textColor="text-amber-700 dark:text-amber-300"
          icon={<TrendingUp size={20} className="text-amber-500" />}
        />
        <TempCard
          label="Cold Leads"
          count={cold}
          total={total}
          color="bg-sky-400"
          lightBg="bg-sky-50 dark:bg-sky-950/30"
          textColor="text-sky-700 dark:text-sky-300"
          icon={<Target size={20} className="text-sky-500" />}
        />
      </div>

      {/* Score distribution */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <BarChart3 size={16} />
          Score Distribution
        </h3>
        <div className="mt-4 space-y-3">
          {Object.entries(analytics?.scoreDistribution || {}).map(([range, count]) => (
            <ScoreBar key={range} range={range} count={count} total={total} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Persona breakdown */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Users size={16} />
            Persona Breakdown
          </h3>
          <div className="mt-4 space-y-2">
            {PERSONAS.map((p) => {
              const count = analytics?.personas?.[p.id] || 0;
              return (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2 dark:border-stone-800">
                  <span className="flex items-center gap-2 text-sm">
                    <span>{p.icon}</span>
                    {p.label}
                  </span>
                  <span className="text-sm font-bold tabular-nums">{count}</span>
                </div>
              );
            })}
            {Object.values(analytics?.personas || {}).every((v) => v === 0) && (
              <p className="py-4 text-center text-sm text-stone-400">
                No persona data yet. Qualify your leads to see breakdowns.
              </p>
            )}
          </div>
        </div>

        {/* Ad Source performance */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Zap size={16} />
            Ad Source Performance
          </h3>
          <div className="mt-4">
            {(analytics?.adSources || []).length === 0 && (
              <p className="py-4 text-center text-sm text-stone-400">
                No ad source data yet. Set detailed ad sources on your leads.
              </p>
            )}
            {(analytics?.adSources || []).length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 text-xs font-medium text-stone-500 dark:border-stone-800 dark:text-stone-400">
                      <th className="pb-2 pr-4">Source</th>
                      <th className="pb-2 pr-4 text-right">Leads</th>
                      <th className="pb-2 pr-4 text-right">Converted</th>
                      <th className="pb-2 pr-4 text-right">Conv. %</th>
                      <th className="pb-2 text-right">Avg Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics?.adSources || []).map((s) => {
                      const info = AD_SOURCES.find((a) => a.id === s.adSource);
                      return (
                        <tr key={s.adSource} className="border-b border-stone-100 dark:border-stone-800/50">
                          <td className="py-2 pr-4 font-medium">{info?.label || s.adSource}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">{s.total}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">{s.converted}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">
                            <span className={s.conversionRate >= 50 ? "text-emerald-600 font-semibold" : ""}>
                              {s.conversionRate}%
                            </span>
                          </td>
                          <td className="py-2 text-right tabular-nums">
                            <ScorePill score={s.avgScore} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TempCard({ label, count, total, color, lightBg, textColor, icon }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={`rounded-xl border border-stone-200 p-5 dark:border-stone-800 ${lightBg}`}>
      <div className="flex items-center justify-between">
        {icon}
        <span className={`text-2xl font-bold tabular-nums ${textColor}`}>{count}</span>
      </div>
      <p className="mt-2 text-sm font-medium">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-medium tabular-nums text-stone-500">{pct}%</span>
      </div>
    </div>
  );
}

function ScoreBar({ range, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const color =
    range.startsWith("80") || range.startsWith("60")
      ? "bg-red-500"
      : range.startsWith("40")
        ? "bg-amber-500"
        : range.startsWith("20")
          ? "bg-sky-400"
          : "bg-stone-300";

  return (
    <div className="flex items-center gap-3">
      <span className="w-14 text-xs font-medium tabular-nums text-stone-500 dark:text-stone-400">{range}</span>
      <div className="h-4 flex-1 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-xs font-bold tabular-nums">{count}</span>
    </div>
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
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${bg}`}>
      {score}
    </span>
  );
}
