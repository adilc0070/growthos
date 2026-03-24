"use client";

import { useState, useEffect } from "react";
import * as api from "@/lib/students-api";
import {
  Users, BookOpen, Trophy, TrendingUp, CheckCircle2,
  IndianRupee, Loader2, Database,
} from "lucide-react";
import { progressColor } from "@/lib/students-data";

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.fetchStudentAnalytics()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSeedCourses() {
    try {
      const res = await api.seedCourses();
      if (!res.seeded) alert(res.message);
      else location.reload();
    } catch (err) {
      alert("Seed failed: " + err.message);
    }
  }

  async function handleSeedStudents() {
    try {
      const res = await api.seedStudents();
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

  if (!stats || stats.totalStudents === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
        <p className="mb-4 text-sm text-stone-500">
          No data yet. Seed demo data to get started.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleSeedCourses}
            className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <Database size={16} /> Seed Courses
          </button>
          <button
            onClick={handleSeedStudents}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            <Database size={16} /> Seed Students
          </button>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-blue-600 dark:text-blue-400" },
    { label: "Active", value: stats.active, icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Avg Progress", value: `${stats.avgProgress}%`, icon: CheckCircle2, color: "text-amber-600 dark:text-amber-400" },
    { label: "Courses", value: stats.totalCourses, icon: BookOpen, color: "text-purple-600 dark:text-purple-400" },
    { label: "Total Earnings", value: `₹${stats.totalEarnings.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-green-600 dark:text-green-400" },
    { label: "Tasks Completed", value: `${stats.completedTasks}/${stats.totalTasks}`, icon: Trophy, color: "text-orange-600 dark:text-orange-400" },
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
            Enrollment by Course
          </h3>
          <div className="space-y-3">
            {stats.enrollmentByCourse.map((item) => (
              <div key={item.course}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-stone-700 dark:text-stone-300">
                    {item.course}
                  </span>
                  <span className="text-xs font-medium text-stone-500">
                    {item.count} students
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                  <div
                    className={`h-full rounded-full ${progressColor(
                      stats.totalStudents > 0
                        ? (item.count / stats.totalStudents) * 100
                        : 0
                    )}`}
                    style={{
                      width: `${
                        stats.totalStudents > 0
                          ? (item.count / stats.totalStudents) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <h3 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-stone-500">Completed</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {stats.completed}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Dropped</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                {stats.dropped}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Earning Students</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {stats.earners}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Submitted Tasks</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {stats.submittedTasks}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
