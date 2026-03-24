import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { computeAndApplyScore } from "@/lib/lead-scoring";

export async function POST(_request, { params }) {
  await dbConnect();
  const { id } = await params;

  const lead = await Lead.findById(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const scores = computeAndApplyScore(lead);
  await lead.save();
  return NextResponse.json({ lead, scores });
}
