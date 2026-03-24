"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/students-api";
import {
  Plus, Loader2, Trash2, Pencil, X, Database, BookOpen,
} from "lucide-react";

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    try {
      setCourses(await api.fetchCourses());
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSeed() {
    try {
      const res = await api.seedCourses();
      if (res.seeded) await load();
      else alert(res.message);
    } catch (err) {
      alert("Seed failed: " + err.message);
    }
  }

  async function handleSave(data) {
    try {
      if (editing) {
        await api.updateCourse(editing._id, data);
      } else {
        await api.createCourse(data);
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this course?")) return;
    try {
      await api.deleteCourse(id);
      await load();
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="ml-auto flex items-center gap-2">
          {courses.length === 0 && (
            <button onClick={handleSeed} className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800">
              <Database size={16} /> Seed Courses
            </button>
          )}
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            <Plus size={16} /> Add Course
          </button>
        </div>
      </div>

      {courses.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <p className="text-sm text-stone-500">No courses yet. Seed demo courses or add your own.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course._id}
            className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950">
                <BookOpen size={18} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {course.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-stone-500">{course.description}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-stone-500">
              <span>{course.duration} weeks</span>
              <span>{course.totalModules} modules</span>
              <span className={course.isActive ? "text-emerald-600" : "text-red-500"}>
                {course.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {course.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-1 border-t border-stone-100 pt-3 dark:border-stone-800">
              <button
                onClick={() => { setEditing(course); setShowForm(true); }}
                className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(course._id)}
                className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <CourseFormModal
          course={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function CourseFormModal({ course, onSave, onClose }) {
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [duration, setDuration] = useState(course?.duration || 4);
  const [totalModules, setTotalModules] = useState(course?.totalModules || 1);
  const [skills, setSkills] = useState(course?.skills?.join(", ") || "");
  const [isActive, setIsActive] = useState(course?.isActive ?? true);

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      title,
      description,
      duration: Number(duration),
      totalModules: Number(totalModules),
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      isActive,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{course ? "Edit Course" : "Add Course"}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course title" required className="input" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} className="input" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-stone-500">Duration (weeks)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min={1} className="input" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-500">Total Modules</label>
              <input type="number" value={totalModules} onChange={(e) => setTotalModules(e.target.value)} min={1} className="input" />
            </div>
          </div>

          <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills (comma separated)" className="input" />

          <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded" />
            Active
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            {course ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
