"use client";

import { useState } from "react";
import {
  LayoutDashboard, MessageSquareQuote, BookOpen, Wand2, Globe, BarChart3,
} from "lucide-react";
import ProofDashboard from "@/components/proof/proof-dashboard";
import TestimonialList from "@/components/proof/testimonial-list";
import CaseStudyManager from "@/components/proof/case-study-manager";
import ContentEngine from "@/components/proof/content-engine";
import ProofSync from "@/components/proof/proof-sync";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { id: "case-studies", label: "Case Studies", icon: BookOpen },
  { id: "content", label: "Content Engine", icon: Wand2 },
  { id: "sync", label: "Page Sync", icon: Globe },
];

export default function ProofPage() {
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

      {activeTab === "dashboard" && <ProofDashboard />}
      {activeTab === "testimonials" && <TestimonialList />}
      {activeTab === "case-studies" && <CaseStudyManager />}
      {activeTab === "content" && <ContentEngine />}
      {activeTab === "sync" && <ProofSync />}
    </div>
  );
}
