import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { computeAndApplyScore } from "@/lib/lead-scoring";
import { requireRole } from "@/lib/auth";
import { normalizeLeadAssignees } from "@/lib/normalize-lead-assignees";

export async function GET(_request, { params }) {
  const { error } = await requireRole("admin", "sales");
  if (error) return error;
  await dbConnect();
  await normalizeLeadAssignees();
  const { id } = await params;
  const lead = await Lead.findById(id).populate("assignedTo", "name email role").lean();
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PUT(request, { params }) {
  const { session, error } = await requireRole("admin", "sales");
  if (error) return error;
  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  const lead = await Lead.findById(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updatableFields = [
    "name",
    "phone",
    "email",
    "source",
    "adSource",
    "status",
    "budget",
    "courseInterest",
    "tags",
    "followUpDate",
    "persona",
    "urgency",
    "engagement",
  ];
  for (const key of updatableFields) {
    if (body[key] !== undefined) lead[key] = body[key];
  }

  lead.timeline.push({
    type: "edited",
    description: "Lead details updated",
    actor: {
      userId: session.user.id,
      name: session.user.name || "",
      role: session.user.role || "",
    },
    createdAt: new Date(),
  });

  computeAndApplyScore(lead);
  await lead.save();
  const populated = await Lead.findById(id).populate("assignedTo", "name email role").lean();
  return NextResponse.json(populated);
}

export async function DELETE(_request, { params }) {
  const { error } = await requireRole("admin");
  if (error) return error;
  await dbConnect();
  const { id } = await params;
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
