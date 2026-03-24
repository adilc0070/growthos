"use client";

import { useState } from "react";
import {
  BookOpen,
  ShieldQuestion,
  CalendarClock,
  Phone,
  BarChart3,
} from "lucide-react";
import ScriptsLibrary from "@/components/sales/scripts-library";
import ObjectionTemplates from "@/components/sales/objection-templates";
import FollowUpScheduler from "@/components/sales/follow-up-scheduler";
import CallLogPanel from "@/components/sales/call-log-panel";
import SalesAnalytics from "@/components/sales/sales-analytics";

const TABS = [
  { id: "scripts", label: "Scripts", icon: BookOpen },
  { id: "objections", label: "Objections", icon: ShieldQuestion },
  { id: "follow-ups", label: "Follow-ups", icon: CalendarClock },
  { id: "call-logs", label: "Call Logs", icon: Phone },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("scripts");

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

      {activeTab === "scripts" && <ScriptsLibrary />}
      {activeTab === "objections" && <ObjectionTemplates />}
      {activeTab === "follow-ups" && <FollowUpScheduler />}
      {activeTab === "call-logs" && <CallLogPanel />}
      {activeTab === "analytics" && <SalesAnalytics />}
    </div>
  );
}
