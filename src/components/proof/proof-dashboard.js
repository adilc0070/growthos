"use client";

import { useState, useEffect } from "react";
import * as api from "@/lib/proof-api";
import { formatCurrency } from "@/lib/proof-data";
import {
  MessageSquareQuote, Eye, MousePointerClick, TrendingUp,
  Video, FileText, Image, Star, Loader2, Database,
} from "lucide-react";

export default function ProofDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.fetchProofAnalytics()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSeedTestimonials() {
    try {
      const res = await api.seedTestimonials();
      if (!res.seeded) alert(res.message);
      else location.reload();
    } catch (err) {
      alert("Seed failed: " + err.message);
    }
  }

  async function handleSeedTemplates() {
    try {
      const res = await api.seedTemplates();
      if (!res.seeded) alert(res.message);
      else location.reload();
    } catch (err) {
      alert("Seed failed: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-stone-400" />
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
        <p className="mb-4 text-sm text-stone-500">
          No data yet. Seed demo data to get started.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleSeedTestimonials}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            <Database size={16} /> Seed Testimonials
          </button>
          <button
            onClick={handleSeedTemplates}
            className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <Database size={16} /> Seed Templates
          </button>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Testimonials", value: stats.total, icon: MessageSquareQuote, color: "text-purple-600 dark:text-purple-400" },
    { label: "Published", value: stats.published, icon: Star, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Total Views", value: stats.totalViews.toLocaleString("en-IN"), icon: Eye, color: "text-blue-600 dark:text-blue-400" },
    { label: "Total Clicks", value: stats.totalClicks.toLocaleString("en-IN"), icon: MousePointerClick, color: "text-amber-600 dark:text-amber-400" },
    { label: "Conversions", value: stats.totalConversions, icon: TrendingUp, color: "text-green-600 dark:text-green-400" },
    { label: "Total Results", value: formatCurrency(stats.totalResultAmount), icon: TrendingUp, color: "text-orange-600 dark:text-orange-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900"
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className={card.color} />
                <span className="text-xs text-stone-500">{card.label}</span>
              </div>
              <p className="mt-2 text-xl font-bold text-stone-900 dark:text-stone-100">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <h3 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
            By Type
          </h3>
          <div className="space-y-3">
            {[
              { label: "Video", count: stats.byType.video, icon: Video, color: "bg-purple-500" },
              { label: "Text", count: stats.byType.text, icon: FileText, color: "bg-blue-500" },
              { label: "Screenshot", count: stats.byType.screenshot, icon: Image, color: "bg-amber-500" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
                      <Icon size={14} /> {item.label}
                    </span>
                    <span className="text-xs font-medium text-stone-500">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <h3 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
            Performance
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-stone-500">Click Rate</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {stats.avgClickRate}%
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Conversion Rate</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {stats.avgConversionRate}%
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Featured</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {stats.featured}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Case Studies</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {stats.publishedCaseStudies}/{stats.totalCaseStudies}
              </p>
            </div>
          </div>
        </div>
      </div>

      {stats.topPerformers.length > 0 && (
        <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <h3 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
            Top Performing Testimonials
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-700">
                  <th className="pb-2 text-left font-medium text-stone-500">Student</th>
                  <th className="pb-2 text-left font-medium text-stone-500">Type</th>
                  <th className="pb-2 text-right font-medium text-stone-500">Views</th>
                  <th className="pb-2 text-right font-medium text-stone-500">Clicks</th>
                  <th className="pb-2 text-right font-medium text-stone-500">Conv.</th>
                  <th className="pb-2 text-right font-medium text-stone-500">Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats.topPerformers.map((t) => (
                  <tr key={t.id} className="border-b border-stone-100 dark:border-stone-800">
                    <td className="py-2 text-stone-900 dark:text-stone-100">{t.studentName}</td>
                    <td className="py-2 capitalize text-stone-600 dark:text-stone-400">{t.type}</td>
                    <td className="py-2 text-right text-stone-600 dark:text-stone-400">{t.views}</td>
                    <td className="py-2 text-right text-stone-600 dark:text-stone-400">{t.clicks}</td>
                    <td className="py-2 text-right text-stone-600 dark:text-stone-400">{t.conversions}</td>
                    <td className="py-2 text-right font-medium text-emerald-600 dark:text-emerald-400">{t.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stats.tagPerformance.length > 0 && (
        <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <h3 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
            Performance by Tag
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.tagPerformance.map((tp) => (
              <div
                key={tp.tag}
                className="rounded-lg border border-stone-100 p-3 dark:border-stone-800"
              >
                <p className="mb-1 text-xs font-semibold capitalize text-stone-700 dark:text-stone-300">
                  {tp.tag}
                </p>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>{tp.count} testimonials</span>
                  <span>{tp.views} views</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {tp.conversionRate}% conv.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
