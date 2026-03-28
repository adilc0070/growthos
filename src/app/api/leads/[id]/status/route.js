import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { requireRole } from "@/lib/auth";
import { normalizeLeadAssignees } from "@/lib/normalize-lead-assignees";

const STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  payment_pending: "Payment Pending",
  converted: "Converted",
  dropped: "Dropped",
};

export async function PATCH(request, { params }) {
  const { session, error } = await requireRole("admin", "sales");
  if (error) return error;
  await dbConnect();
  await normalizeLeadAssignees();
  const { id } = await params;
  const { status } = await request.json();

  if (!STATUS_LABELS[status]) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const lead = await Lead.findById(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  lead.status = status;
  lead.timeline.push({
    type: "status_change",
    description: `Status changed to ${STATUS_LABELS[status]}`,
    actor: {
      userId: session.user.id,
      name: session.user.name || "",
      role: session.user.role || "",
    },
    createdAt: new Date(),
  });

  await lead.save();
  const populated = await Lead.findById(id).populate("assignedTo", "name email role").lean();
  return NextResponse.json(populated);
}
