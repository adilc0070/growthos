"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/students-api";
import { MOODS, MOOD_EMOJI, formatDate } from "@/lib/students-data";
import {
  Loader2, Plus, X, MessageCircle, IndianRupee, BarChart3,
} from "lucide-react";

export default function CheckInPanel() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showEarning, setShowEarning] = useState(false);

  useEffect(() => {
    api.fetchStudents({ status: "active" })
      .then((s) => {
        setStudents(s);
        if (s.length > 0) setSelected(s[0]._id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadDetail = useCallback(async () => {
    if (!selected) return;
    try {
      setDetail(await api.fetchStudent(selected));
    } catch {}
  }, [selected]);

  useEffect(() => { loadDetail(); }, [loadDetail]);

  async function handleCheckIn(data) {
    try {
      await api.addCheckIn(selected, data);
      setShowCheckIn(false);
      await loadDetail();
    } catch (err) {
      alert("Check-in failed: " + err.message);
    }
  }

  async function handleEarning(amount) {
    try {
      await api.logEarning(selected, amount);
      setShowEarning(false);
      await loadDetail();
    } catch (err) {
      alert("Failed: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-stone-400" />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
        <p className="text-sm text-stone-500">No active students.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selected || ""}
          onChange={(e) => setSelected(e.target.value)}
          className="select-sm"
        >
          {students.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowEarning(true)}
            className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <IndianRupee size={16} /> Log Earning
          </button>
          <button
            onClick={() => setShowCheckIn(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            <Plus size={16} /> Check-In
          </button>
        </div>
      </div>

      {detail && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-stone-100">
              <MessageCircle size={16} /> Check-In History
            </h3>
            {(!detail.checkIns || detail.checkIns.length === 0) ? (
              <p className="text-sm text-stone-500">No check-ins yet.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {[...detail.checkIns].reverse().map((ci) => (
                  <div
                    key={ci._id}
                    className="rounded-lg bg-stone-50 p-3 dark:bg-stone-950"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {MOOD_EMOJI[ci.mood] || ""} {ci.mood}
                      </span>
                      <span className="text-xs text-stone-500">
                        {formatDate(ci.createdAt)}
                      </span>
                    </div>
                    {ci.notes && (
                      <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                        {ci.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-stone-100">
              <BarChart3 size={16} /> Earnings & Skills
            </h3>

            <div className="mb-4 rounded-lg bg-green-50 p-4 dark:bg-green-950/30">
              <p className="text-xs text-green-700 dark:text-green-400">Total Earnings</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                ₹{(detail.earnings || 0).toLocaleString("en-IN")}
              </p>
              {detail.firstEarningDate && (
                <p className="mt-1 text-xs text-green-600 dark:text-green-500">
                  First earning: {formatDate(detail.firstEarningDate)}
                </p>
              )}
            </div>

            {detail.skills?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-stone-500">Skill Progression</p>
                {detail.skills.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-2">
                    <span className="w-24 truncate text-xs text-stone-600 dark:text-stone-400">
                      {skill.name}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-stone-100 dark:bg-stone-800">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                      {skill.level}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            {detail.communityLinks && (detail.communityLinks.whatsapp || detail.communityLinks.discord) && (
              <div className="mt-4 space-y-1">
                <p className="text-xs font-medium text-stone-500">Community</p>
                {detail.communityLinks.whatsapp && (
                  <a href={detail.communityLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="block text-xs text-green-600 hover:underline">
                    WhatsApp Group
                  </a>
                )}
                {detail.communityLinks.discord && (
                  <a href={detail.communityLinks.discord} target="_blank" rel="noopener noreferrer" className="block text-xs text-indigo-600 hover:underline">
                    Discord Server
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showCheckIn && (
        <CheckInModal
          onSave={handleCheckIn}
          onClose={() => setShowCheckIn(false)}
        />
      )}

      {showEarning && (
        <EarningModal
          onSave={handleEarning}
          onClose={() => setShowEarning(false)}
        />
      )}
    </div>
  );
}

function CheckInModal({ onSave, onClose }) {
  const [mood, setMood] = useState("good");
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Weekly Check-In</h2>
          <button onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">
              How are you feeling?
            </label>
            <div className="flex gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`flex-1 rounded-lg border-2 px-3 py-2 text-center text-sm transition-colors ${
                    mood === m
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-stone-200 hover:border-stone-300 dark:border-stone-700"
                  }`}
                >
                  <span className="block text-lg">{MOOD_EMOJI[m]}</span>
                  <span className="text-xs">{m}</span>
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your week? Any wins, struggles, or questions?"
            rows={4}
            className="input"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button
            onClick={() => onSave({ mood, notes })}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Submit Check-In
          </button>
        </div>
      </div>
    </div>
  );
}

function EarningModal({ onSave, onClose }) {
  const [amount, setAmount] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Log Earning</h2>
          <button onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">₹</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min={1}
            className="input pl-7"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button
            onClick={() => onSave(Number(amount))}
            disabled={!amount || Number(amount) <= 0}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Log Earning
          </button>
        </div>
      </div>
    </div>
  );
}
