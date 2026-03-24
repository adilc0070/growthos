"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/students-api";
import {
  STUDENT_STATUSES, STATUS_COLORS, formatDate, progressColor,
} from "@/lib/students-data";
import {
  Plus, Loader2, Trash2, Pencil, X, ChevronDown, ChevronUp,
  IndianRupee, Phone, Mail, Database,
} from "lucide-react";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    try {
      const [s, c] = await Promise.all([
        api.fetchStudents({ status: statusFilter, courseId: courseFilter }),
        api.fetchCourses(),
      ]);
      setStudents(s);
      setCourses(c);
    } catch {} finally {
      setLoading(false);
    }
  }, [statusFilter, courseFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(data) {
    try {
      if (editing) {
        await api.updateStudent(editing._id, data);
      } else {
        await api.createStudent(data);
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this student?")) return;
    try {
      await api.deleteStudent(id);
      await load();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  }

  async function handleSeedCourses() {
    try {
      const res = await api.seedCourses();
      if (!res.seeded) alert(res.message);
      else await load();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-sm"
        >
          <option value="all">All Statuses</option>
          {STUDENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="select-sm"
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          {courses.length === 0 && (
            <button
              onClick={handleSeedCourses}
              className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <Database size={16} /> Seed Courses
            </button>
          )}
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {students.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <p className="text-sm text-stone-500">No students found.</p>
        </div>
      )}

      <div className="space-y-3">
        {students.map((student) => (
          <div
            key={student._id}
            className="rounded-lg border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
          >
            <button
              onClick={() => setExpanded(expanded === student._id ? null : student._id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                {student.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {student.name}
                  </h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[student.status]}`}>
                    {student.status}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-stone-500">
                  {student.courseId?.title || "—"} · {student.progress}% complete
                </p>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <div className="w-24">
                  <div className="h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                    <div
                      className={`h-full rounded-full transition-all ${progressColor(student.progress)}`}
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>
                {student.earnings > 0 && (
                  <span className="flex items-center gap-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                    <IndianRupee size={12} />
                    {student.earnings.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {expanded === student._id ? (
                <ChevronUp size={16} className="text-stone-400" />
              ) : (
                <ChevronDown size={16} className="text-stone-400" />
              )}
            </button>

            {expanded === student._id && (
              <div className="border-t border-stone-200 p-4 dark:border-stone-800">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                      <Mail size={14} /> {student.email || "—"}
                    </p>
                    <p className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                      <Phone size={14} /> {student.phone || "—"}
                    </p>
                    <p className="text-stone-500">
                      Enrolled: {formatDate(student.enrollmentDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-stone-500">Earnings</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      ₹{(student.earnings || 0).toLocaleString("en-IN")}
                    </p>
                    {student.firstEarningDate && (
                      <p className="text-xs text-stone-500">
                        First: {formatDate(student.firstEarningDate)}
                      </p>
                    )}
                  </div>

                  {student.skills?.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-stone-500">Skills</p>
                      <div className="space-y-1">
                        {student.skills.map((skill) => (
                          <div key={skill.name} className="flex items-center gap-2">
                            <span className="w-20 truncate text-xs text-stone-600 dark:text-stone-400">
                              {skill.name}
                            </span>
                            <div className="flex-1 h-1.5 rounded-full bg-stone-100 dark:bg-stone-800">
                              <div
                                className={`h-full rounded-full ${progressColor(skill.level)}`}
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-stone-500">{skill.level}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => { setEditing(student); setShowForm(true); }}
                    className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <StudentFormModal
          student={editing}
          courses={courses}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function StudentFormModal({ student, courses, onSave, onClose }) {
  const [name, setName] = useState(student?.name || "");
  const [email, setEmail] = useState(student?.email || "");
  const [phone, setPhone] = useState(student?.phone || "");
  const [courseId, setCourseId] = useState(student?.courseId?._id || student?.courseId || "");
  const [status, setStatus] = useState(student?.status || "active");

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ name, email, phone, courseId, status });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{student ? "Edit Student" : "Add Student"}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student name" required className="input" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="input" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="input" />

          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required className="input">
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>

          {student && (
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
              {STUDENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            {student ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
