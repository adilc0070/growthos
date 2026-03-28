import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { computeAndApplyScore } from "@/lib/lead-scoring";
import { requireRole } from "@/lib/auth";
import { normalizeLeadAssignees } from "@/lib/normalize-lead-assignees";

export async function GET(request) {
  const { session, error } = await requireRole("admin", "sales");
  if (error) return error;
  await dbConnect();
  await normalizeLeadAssignees();

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");
  const courseInterest = searchParams.get("courseInterest");
  const search = searchParams.get("search");
  const temperature = searchParams.get("temperature");
  const persona = searchParams.get("persona");
  const minScore = searchParams.get("minScore");
  const maxScore = searchParams.get("maxScore");
  const adSource = searchParams.get("adSource");

  const filter = {};
  if (source && source !== "all") filter.source = source;
  if (courseInterest && courseInterest !== "all")
    filter.courseInterest = courseInterest;
  if (temperature && temperature !== "all") filter.temperature = temperature;
  if (persona && persona !== "all") filter.persona = persona;
  if (adSource && adSource !== "all") filter.adSource = adSource;
  if (minScore || maxScore) {
    filter.leadScore = {};
    if (minScore) filter.leadScore.$gte = Number(minScore);
    if (maxScore) filter.leadScore.$lte = Number(maxScore);
  }
  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [
      { name: regex },
      { phone: regex },
      { email: regex },
      { tags: regex },
    ];
  }

  const leads = await Lead.find(filter)
    .populate("assignedTo", "name email role")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(leads);
}

export async function POST(request) {
  const { session, error } = await requireRole("admin", "sales");
  if (error) return error;
  await dbConnect();

  const body = await request.json();
  const now = new Date();
  const actor = {
    userId: session.user.id,
    name: session.user.name || "",
    role: session.user.role || "",
  };

  const leadData = {
    ...body,
    timeline: [
      {
        type: "created",
        description: "Lead created manually",
        actor,
        createdAt: now,
      },
    ],
  };

  computeAndApplyScore(leadData);

  const lead = await Lead.create(leadData);
  return NextResponse.json(lead, { status: 201 });
}
