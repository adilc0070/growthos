/** Escape a value for CSV (RFC 4180-style). */
export function csvEscape(value) {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const HEADERS = [
  "id",
  "name",
  "phone",
  "email",
  "source",
  "adSource",
  "status",
  "budget",
  "courseInterest",
  "tags",
  "temperature",
  "persona",
  "urgency",
  "engagement",
  "leadScore",
  "followUpDate",
  "assignedTo",
  "createdAt",
];

function leadToRow(lead) {
  const tags = Array.isArray(lead.tags) ? lead.tags.join("; ") : "";
  let assigned = "";
  if (lead.assignedTo && typeof lead.assignedTo === "object") {
    assigned = lead.assignedTo.name || "";
  } else if (lead.assignedTo) {
    assigned = String(lead.assignedTo);
  }
  const followUp = lead.followUpDate
    ? new Date(lead.followUpDate).toISOString().slice(0, 10)
    : "";
  const created = lead.createdAt
    ? new Date(lead.createdAt).toISOString()
    : "";
  return [
    lead._id || lead.id || "",
    lead.name,
    lead.phone,
    lead.email ?? "",
    lead.source ?? "",
    lead.adSource ?? "",
    lead.status ?? "",
    lead.budget ?? "",
    lead.courseInterest ?? "",
    tags,
    lead.temperature ?? "",
    lead.persona ?? "",
    lead.urgency ?? "",
    lead.engagement ?? "",
    lead.leadScore ?? "",
    followUp,
    assigned,
    created,
  ].map(csvEscape);
}

/** Build CSV text for the given leads (current list / filtered view). */
export function leadsToCsv(leads) {
  const lines = [HEADERS.map(csvEscape).join(","), ...leads.map((l) => leadToRow(l).join(","))];
  return lines.join("\r\n");
}

/** Trigger download of leads as CSV in the browser. */
export function downloadLeadsCsv(leads, filename = "leads-export.csv") {
  const csv = leadsToCsv(leads);
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
