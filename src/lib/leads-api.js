const BASE = "/api/leads";

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

export function fetchLeads({ source, courseInterest, search } = {}) {
  const params = new URLSearchParams();
  if (source && source !== "all") params.set("source", source);
  if (courseInterest && courseInterest !== "all")
    params.set("courseInterest", courseInterest);
  if (search) params.set("search", search);
  const qs = params.toString();
  return request(`${BASE}${qs ? `?${qs}` : ""}`);
}

export function createLead(data) {
  return request(BASE, { method: "POST", body: JSON.stringify(data) });
}

export function updateLead(id, data) {
  return request(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteLead(id) {
  return request(`${BASE}/${id}`, { method: "DELETE" });
}

export function changeStatus(id, status) {
  return request(`${BASE}/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function addNote(id, text) {
  return request(`${BASE}/${id}/notes`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export function seedLeads() {
  return request(`${BASE}/seed`, { method: "POST" });
}
