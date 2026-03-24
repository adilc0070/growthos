"use client";

import { useState, useEffect } from "react";
import * as api from "@/lib/students-api";
import { progressColor } from "@/lib/students-data";
import {
  Loader2, Trophy, Medal, IndianRupee, CheckCircle2,
} from "lucide-react";

const RANK_STYLES = [
  "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
];

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.fetchLeaderboard()
      .then(setEntries)
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

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
        <p className="text-sm text-stone-500">No active students to rank.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {entries.slice(0, 3).map((entry, i) => (
          <div
            key={entry._id}
            className={`relative overflow-hidden rounded-xl border p-5 ${
              i === 0
                ? "border-amber-300 bg-gradient-to-br from-amber-50 to-white dark:border-amber-800 dark:from-amber-950/30 dark:to-stone-900"
                : "border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  RANK_STYLES[i] || ""
                }`}
              >
                {i === 0 ? <Trophy size={18} /> : <Medal size={18} />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {entry.name}
                </h3>
                <p className="text-xs text-stone-500">{entry.course}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-stone-500">Points</p>
                <p className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {entry.points}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">Progress</p>
                <p className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {entry.progress}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
        <div className="border-b border-stone-200 p-4 dark:border-stone-800">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            Full Rankings
          </h3>
        </div>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {entries.map((entry, i) => (
            <div key={entry._id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                {i + 1}
              </span>

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-stone-900 dark:text-stone-100">
                  {entry.name}
                </p>
                <p className="text-xs text-stone-500">{entry.course}</p>
              </div>

              <div className="hidden items-center gap-4 sm:flex">
                <div className="text-center">
                  <p className="text-xs text-stone-500">Tasks</p>
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                    <CheckCircle2 size={12} className="mr-0.5 inline text-emerald-500" />
                    {entry.tasksCompleted}/{entry.totalTasks}
                  </p>
                </div>

                <div className="w-20">
                  <div className="h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                    <div
                      className={`h-full rounded-full ${progressColor(entry.progress)}`}
                      style={{ width: `${entry.progress}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-center text-[10px] text-stone-500">
                    {entry.progress}%
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {entry.points} pts
                </p>
                {entry.earnings > 0 && (
                  <p className="flex items-center justify-end gap-0.5 text-xs text-green-600 dark:text-green-400">
                    <IndianRupee size={10} />
                    {entry.earnings.toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
