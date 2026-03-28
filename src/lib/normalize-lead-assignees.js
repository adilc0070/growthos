import Lead from "@/models/Lead";

// Backward-compat fix:
// older documents may have assignedTo as string (e.g. "").
// New schema expects ObjectId/null, so normalize strings to null.
export async function normalizeLeadAssignees() {
  await Lead.updateMany(
    { assignedTo: { $type: "string" } },
    { $set: { assignedTo: null } }
  );
}

