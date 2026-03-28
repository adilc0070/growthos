import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import User from "@/models/User";
import { requireRole } from "@/lib/auth";
import { normalizeLeadAssignees } from "@/lib/normalize-lead-assignees";

export async function PATCH(request, { params }) {
  const { session, error } = await requireRole("admin", "sales");
  if (error) return error;

  await dbConnect();
  await normalizeLeadAssignees();
  const { id } = await params;
  const { assignedTo } = await request.json();

  const lead = await Lead.findById(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let assignee = null;
  if (assignedTo) {
    assignee = await User.findById(assignedTo).select("name email role isActive").lean();
    if (!assignee || !assignee.isActive) {
      return NextResponse.json({ error: "Invalid assignee" }, { status: 400 });
    }
  }

  lead.assignedTo = assignedTo || null;
  lead.timeline.push({
    type: "edited",
    description: assignedTo
      ? `Assigned to ${assignee?.name || "user"}`
      : "Unassigned lead",
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

