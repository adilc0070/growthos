import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { computeAndApplyScore } from "@/lib/lead-scoring";

export async function POST(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  const lead = await Lead.findById(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  lead.qualificationData = {
    currentSituation: body.currentSituation || "",
    goal: body.goal || "",
    timeline: body.timeline || "exploring",
    budgetRange: body.budgetRange || "below_10k",
    previousExperience: body.previousExperience || "",
    commitment: body.commitment || "unsure",
    qualifiedAt: new Date(),
  };

  lead.timeline.push({
    type: "edited",
    description: "Lead qualified via qualification form",
    createdAt: new Date(),
  });

  computeAndApplyScore(lead);
  await lead.save();
  return NextResponse.json(lead);
}
