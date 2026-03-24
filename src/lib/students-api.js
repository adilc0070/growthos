const STUDENTS_BASE = "/api/students";
const COURSES_BASE = "/api/courses";

async function request(url, opts = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

// --- Courses ---
export function fetchCourses() {
  return request(COURSES_BASE);
}

export function createCourse(data) {
  return request(COURSES_BASE, { method: "POST", body: JSON.stringify(data) });
}

export function updateCourse(id, data) {
  return request(`${COURSES_BASE}/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteCourse(id) {
  return request(`${COURSES_BASE}/${id}`, { method: "DELETE" });
}

export function seedCourses() {
  return request(`${COURSES_BASE}/seed`, { method: "POST" });
}

// --- Students ---
export function fetchStudents({ status, courseId } = {}) {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (courseId && courseId !== "all") params.set("courseId", courseId);
  const qs = params.toString();
  return request(`${STUDENTS_BASE}${qs ? `?${qs}` : ""}`);
}

export function fetchStudent(id) {
  return request(`${STUDENTS_BASE}/${id}`);
}

export function createStudent(data) {
  return request(STUDENTS_BASE, { method: "POST", body: JSON.stringify(data) });
}

export function updateStudent(id, data) {
  return request(`${STUDENTS_BASE}/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteStudent(id) {
  return request(`${STUDENTS_BASE}/${id}`, { method: "DELETE" });
}

export function seedStudents() {
  return request(`${STUDENTS_BASE}/seed`, { method: "POST" });
}

// --- Tasks ---
export function fetchTasks(studentId, { status, week } = {}) {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (week) params.set("week", week);
  const qs = params.toString();
  return request(`${STUDENTS_BASE}/${studentId}/tasks${qs ? `?${qs}` : ""}`);
}

export function createTask(studentId, data) {
  return request(`${STUDENTS_BASE}/${studentId}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateTask(studentId, taskId, data) {
  return request(`${STUDENTS_BASE}/${studentId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteTask(studentId, taskId) {
  return request(`${STUDENTS_BASE}/${studentId}/tasks/${taskId}`, { method: "DELETE" });
}

// --- Check-ins ---
export function addCheckIn(studentId, data) {
  return request(`${STUDENTS_BASE}/${studentId}/checkins`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Earnings ---
export function logEarning(studentId, amount) {
  return request(`${STUDENTS_BASE}/${studentId}/earnings`, {
    method: "PATCH",
    body: JSON.stringify({ amount }),
  });
}

// --- Skills ---
export function updateSkills(studentId, skills) {
  return request(`${STUDENTS_BASE}/${studentId}/skills`, {
    method: "PUT",
    body: JSON.stringify({ skills }),
  });
}

// --- Leaderboard ---
export function fetchLeaderboard() {
  return request(`${STUDENTS_BASE}/leaderboard`);
}

// --- Analytics ---
export function fetchStudentAnalytics() {
  return request(`${STUDENTS_BASE}/analytics`);
}
