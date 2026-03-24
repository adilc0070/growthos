"use client";

import { useState } from "react";
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, Trophy, MessageCircle,
} from "lucide-react";
import StudentDashboard from "@/components/students/student-dashboard";
import StudentList from "@/components/students/student-list";
import CourseManager from "@/components/students/course-manager";
import TaskManager from "@/components/students/task-manager";
import Leaderboard from "@/components/students/leaderboard";
import CheckInPanel from "@/components/students/checkin-panel";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: Users },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "tasks", label: "Tasks", icon: ClipboardList },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "checkins", label: "Check-Ins", icon: MessageCircle },
];

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-stone-200 bg-white p-1 dark:border-stone-800 dark:bg-stone-900">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                  : "text-stone-600 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-800"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "dashboard" && <StudentDashboard />}
      {activeTab === "students" && <StudentList />}
      {activeTab === "courses" && <CourseManager />}
      {activeTab === "tasks" && <TaskManager />}
      {activeTab === "leaderboard" && <Leaderboard />}
      {activeTab === "checkins" && <CheckInPanel />}
    </div>
  );
}
