"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/students-api";
import {
  TASK_TYPES, TASK_STATUSES, TASK_STATUS_COLORS, formatDate,
} from "@/lib/students-data";
import {
  Plus, Loader2, Trash2, X, Check, Upload,
  ClipboardList, Zap, FileText,
} from "lucide-react";

const TYPE_ICONS = { task: ClipboardList, challenge: Zap, assignment: FileText };

export default function TaskManager() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskLoading, setTaskLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [weekFilter, setWeekFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showSubmit, setShowSubmit] = useState(null);

  useEffect(() => {
    api.fetchStudents({ status: "active" })
      .then((s) => {
        setStudents(s);
        if (s.length > 0) setSelected(s[0]._id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadTasks = useCallback(async () => {
    if (!selected) return;
    setTaskLoading(true);
    try {
      const data = await api.fetchTasks(selected, {
        status: statusFilter,
        week: weekFilter,
      });
      setTasks(data);
    } catch {} finally {
      setTaskLoading(false);
    }
  }, [selected, statusFilter, weekFilter]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  async function handleCreate(data) {
    try {
      await api.createTask(selected, data);
      setShowForm(false);
      await loadTasks();
    } catch (err) {
      alert("Create failed: " + err.message);
    }
  }

  async function handleComplete(taskId) {
    try {
      await api.updateTask(selected, taskId, { status: "completed" });
      await loadTasks();
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  }

  async function handleSubmission(taskId, content) {
    try {
      await api.updateTask(selected, taskId, {
        status: "submitted",
        submission: { content, submittedAt: new Date() },
      });
      setShowSubmit(null);
      await loadTasks();
    } catch (err) {
      alert("Submit failed: " + err.message);
    }
  }

  async function handleDelete(taskId) {
    if (!confirm("Delete this task?")) return;
    try {
      await api.deleteTask(selected, taskId);
      await loadTasks();
    } catch (err) {
      alert("Delete failed: " + err.message);
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
        <p className="text-sm text-stone-500">No active students. Add students first.</p>
      </div>
    );
  }

  const weeks = [...new Set(tasks.map((t) => t.week))].sort((a, b) => a - b);

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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-sm"
        >
          <option value="all">All Statuses</option>
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>

        <select
          value={weekFilter}
          onChange={(e) => setWeekFilter(e.target.value)}
          className="select-sm"
        >
          <option value="">All Weeks</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((w) => (
            <option key={w} value={w}>Week {w}</option>
          ))}
        </select>

        <button
          onClick={() => setShowForm(true)}
          className="ml-auto flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {taskLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin text-stone-400" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <p className="text-sm text-stone-500">No tasks for this student.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const Icon = TYPE_ICONS[task.type] || ClipboardList;
            return (
              <div
                key={task._id}
                className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900"
              >
                <Icon size={16} className="shrink-0 text-stone-400" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-stone-900 dark:text-stone-100">
                      {task.title}
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${TASK_STATUS_COLORS[task.status]}`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Week {task.week} · {task.type} · {task.points} pts
                    {task.dueDate && ` · Due ${formatDate(task.dueDate)}`}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {task.status !== "completed" && task.type === "assignment" && (
                    <button
                      onClick={() => setShowSubmit(task)}
                      className="rounded-md p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      title="Submit"
                    >
                      <Upload size={14} />
                    </button>
                  )}
                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleComplete(task._id)}
                      className="rounded-md p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      title="Mark complete"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <TaskFormModal
          onSave={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {showSubmit && (
        <SubmissionModal
          task={showSubmit}
          onSubmit={(content) => handleSubmission(showSubmit._id, content)}
          onClose={() => setShowSubmit(null)}
        />
      )}
    </div>
  );
}

function TaskFormModal({ onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [week, setWeek] = useState(1);
  const [type, setType] = useState("task");
  const [points, setPoints] = useState(10);
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      title,
      description,
      week: Number(week),
      type,
      points: Number(points),
      dueDate: dueDate || null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Task</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" required className="input" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} className="input" />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs text-stone-500">Week</label>
              <input type="number" value={week} onChange={(e) => setWeek(e.target.value)} min={1} max={52} className="input" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-500">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input">
                {TASK_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-500">Points</label>
              <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} min={1} className="input" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-stone-500">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

function SubmissionModal({ task, onSubmit, onClose }) {
  const [content, setContent] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Submit: {task.title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Submission notes, links, or content..."
          rows={6}
          className="input"
        />

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(content)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
