export const STUDENT_STATUSES = ["active", "paused", "completed", "dropped"];

export const TASK_TYPES = ["task", "challenge", "assignment"];

export const TASK_STATUSES = ["pending", "in_progress", "submitted", "completed", "overdue"];

export const MOODS = ["great", "good", "okay", "struggling"];

export const STATUS_COLORS = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  paused: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  dropped: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export const TASK_STATUS_COLORS = {
  pending: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  submitted: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  overdue: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export const MOOD_EMOJI = {
  great: "🔥",
  good: "😊",
  okay: "😐",
  struggling: "😟",
};

export function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function progressColor(pct) {
  if (pct >= 75) return "bg-emerald-500";
  if (pct >= 50) return "bg-amber-500";
  if (pct >= 25) return "bg-orange-500";
  return "bg-red-500";
}
