const BASE = "/api/proof";

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

// --- Testimonials ---
export function fetchTestimonials({ type, status, tag, featured } = {}) {
  const params = new URLSearchParams();
  if (type && type !== "all") params.set("type", type);
  if (status && status !== "all") params.set("status", status);
  if (tag && tag !== "all") params.set("tag", tag);
  if (featured) params.set("featured", "true");
  const qs = params.toString();
  return request(`${BASE}/testimonials${qs ? `?${qs}` : ""}`);
}

export function fetchTestimonial(id) {
  return request(`${BASE}/testimonials/${id}`);
}

export function createTestimonial(data) {
  return request(`${BASE}/testimonials`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateTestimonial(id, data) {
  return request(`${BASE}/testimonials/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteTestimonial(id) {
  return request(`${BASE}/testimonials/${id}`, { method: "DELETE" });
}

export function seedTestimonials() {
  return request(`${BASE}/testimonials/seed`, { method: "POST" });
}

// --- Case Studies ---
export function fetchCaseStudies({ status, featured } = {}) {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (featured) params.set("featured", "true");
  const qs = params.toString();
  return request(`${BASE}/case-studies${qs ? `?${qs}` : ""}`);
}

export function createCaseStudy(data) {
  return request(`${BASE}/case-studies`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCaseStudy(id, data) {
  return request(`${BASE}/case-studies/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteCaseStudy(id) {
  return request(`${BASE}/case-studies/${id}`, { method: "DELETE" });
}

// --- Content Templates ---
export function fetchTemplates({ category, platform } = {}) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (platform && platform !== "all") params.set("platform", platform);
  const qs = params.toString();
  return request(`${BASE}/content/templates${qs ? `?${qs}` : ""}`);
}

export function createTemplate(data) {
  return request(`${BASE}/content/templates`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateTemplate(id, data) {
  return request(`${BASE}/content/templates/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteTemplate(id) {
  return request(`${BASE}/content/templates/${id}`, { method: "DELETE" });
}

export function seedTemplates() {
  return request(`${BASE}/content/templates/seed`, { method: "POST" });
}

// --- Content Generation ---
export function generateContent({ testimonialId, templateId, variables }) {
  return request(`${BASE}/content/generate`, {
    method: "POST",
    body: JSON.stringify({ testimonialId, templateId, variables }),
  });
}

// --- Analytics ---
export function fetchProofAnalytics() {
  return request(`${BASE}/analytics`);
}

// --- Landing Page Sync ---
export function fetchSyncData({ limit, type } = {}) {
  const params = new URLSearchParams();
  if (limit) params.set("limit", limit);
  if (type && type !== "all") params.set("type", type);
  const qs = params.toString();
  return request(`${BASE}/sync${qs ? `?${qs}` : ""}`);
}
