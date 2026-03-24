const SALES_BASE = "/api/sales";
const LEADS_BASE = "/api/leads";

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

// --- Scripts ---
export function fetchScripts(category) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  const qs = params.toString();
  return request(`${SALES_BASE}/scripts${qs ? `?${qs}` : ""}`);
}

export function createScript(data) {
  return request(`${SALES_BASE}/scripts`, { method: "POST", body: JSON.stringify(data) });
}

export function updateScript(id, data) {
  return request(`${SALES_BASE}/scripts/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteScript(id) {
  return request(`${SALES_BASE}/scripts/${id}`, { method: "DELETE" });
}

export function seedScripts() {
  return request(`${SALES_BASE}/scripts/seed`, { method: "POST" });
}

// --- Objection Templates ---
export function fetchObjections(category) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  const qs = params.toString();
  return request(`${SALES_BASE}/objections${qs ? `?${qs}` : ""}`);
}

export function createObjection(data) {
  return request(`${SALES_BASE}/objections`, { method: "POST", body: JSON.stringify(data) });
}

export function updateObjection(id, data) {
  return request(`${SALES_BASE}/objections/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteObjection(id) {
  return request(`${SALES_BASE}/objections/${id}`, { method: "DELETE" });
}

export function seedObjections() {
  return request(`${SALES_BASE}/objections/seed`, { method: "POST" });
}

// --- Follow-ups ---
export function fetchFollowUps({ status, leadId } = {}) {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (leadId) params.set("leadId", leadId);
  const qs = params.toString();
  return request(`${SALES_BASE}/follow-ups${qs ? `?${qs}` : ""}`);
}

export function createFollowUp(data) {
  return request(`${SALES_BASE}/follow-ups`, { method: "POST", body: JSON.stringify(data) });
}

export function startSequence(leadId) {
  return request(`${SALES_BASE}/follow-ups/sequence`, { method: "POST", body: JSON.stringify({ leadId }) });
}

export function updateFollowUp(id, data) {
  return request(`${SALES_BASE}/follow-ups/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function completeFollowUp(id, notes) {
  return request(`${SALES_BASE}/follow-ups/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "completed", notes }),
  });
}

export function skipFollowUp(id) {
  return request(`${SALES_BASE}/follow-ups/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "skipped" }),
  });
}

export function deleteFollowUp(id) {
  return request(`${SALES_BASE}/follow-ups/${id}`, { method: "DELETE" });
}

// --- Call Logs ---
export function fetchCallLogs({ leadId } = {}) {
  const params = new URLSearchParams();
  if (leadId) params.set("leadId", leadId);
  const qs = params.toString();
  return request(`${SALES_BASE}/call-logs${qs ? `?${qs}` : ""}`);
}

export function createCallLog(data) {
  return request(`${SALES_BASE}/call-logs`, { method: "POST", body: JSON.stringify(data) });
}

export function deleteCallLog(id) {
  return request(`${SALES_BASE}/call-logs/${id}`, { method: "DELETE" });
}

// --- Analytics ---
export function fetchSalesAnalytics() {
  return request(`${SALES_BASE}/analytics`);
}

// --- WhatsApp ---
export function logWhatsAppSend(leadId, data) {
  return request(`${LEADS_BASE}/${leadId}/whatsapp`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
